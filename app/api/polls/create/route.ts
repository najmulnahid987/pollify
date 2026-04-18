import { createSupabaseServerClient } from '@/lib/supabase-server'
import { cookies } from 'next/headers'

export async function POST(request: Request) {
  try {
    // 1. Get authenticated user
    const supabase = await createSupabaseServerClient()
    
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // 2. Parse FormData with enhanced error handling
    let formData
    try {
      console.log('Attempting to parse FormData...')
      console.log('Request headers:', {
        contentType: request.headers.get('content-type'),
        contentLength: request.headers.get('content-length'),
      })
      formData = await request.formData()
      console.log('FormData parsed successfully')
    } catch (formDataError: any) {
      console.error('FormData parsing error:', formDataError)
      console.error('Error details:', {
        message: formDataError?.message,
        name: formDataError?.name,
        stack: formDataError?.stack
      })
      return Response.json(
        { 
          error: 'Invalid request format',
          details: `Unable to parse form data: ${formDataError?.message || 'Unknown error'}. Please ensure images are properly uploaded.`
        },
        { status: 400 }
      )
    }

    const title = formData.get('title') as string
    const description = formData.get('description') as string
    const pollImageFile = formData.get('pollImage') as File
    const optionsJson = formData.get('options') as string
    const settingsJson = formData.get('settings') as string

    // Log what we received
    console.log('FormData entries received:', {
      hasTitle: !!title,
      hasDescription: !!description,
      hasPollImage: !!pollImageFile,
      hasOptions: !!optionsJson,
      hasSettings: !!settingsJson,
      pollImageType: pollImageFile?.type,
      pollImageSize: pollImageFile?.size,
      allKeys: Array.from(formData.keys())
    })

    // 3. Validate required fields
    if (!title || !title.trim()) {
      return Response.json(
        { error: 'Poll title is required' },
        { status: 400 }
      )
    }

    if (!pollImageFile || !(pollImageFile instanceof File)) {
      console.error('Poll image file missing or invalid', { pollImageFile })
      return Response.json(
        { error: 'Poll image is required and must be a valid image file' },
        { status: 400 }
      )
    }

    // Validate file size
    if (pollImageFile.size > 5 * 1024 * 1024) {
      return Response.json(
        { error: 'Poll image exceeds 5MB limit' },
        { status: 400 }
      )
    }

    let options: any[], settings: any
    try {
      options = JSON.parse(optionsJson || '[]')
      settings = JSON.parse(settingsJson || '{}')
    } catch (parseError) {
      console.error('JSON parsing error:', parseError)
      return Response.json(
        { error: 'Invalid options or settings format' },
        { status: 400 }
      )
    }

    // 4. Upload poll header image
    console.log('Poll image file info:', {
      size: pollImageFile.size,
      type: pollImageFile.type,
      name: pollImageFile.name,
    })

    const pollImageBuffer = await pollImageFile.arrayBuffer()
    
    if (pollImageBuffer.byteLength === 0) {
      return Response.json(
        { error: 'Poll image file is empty' },
        { status: 400 }
      )
    }

    const pollImagePath = `polls/${user.id}/poll-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`

    const { data: pollImageData, error: pollImageError } = await supabase.storage
      .from('poll-images')
      .upload(pollImagePath, pollImageBuffer, {
        contentType: pollImageFile.type,
      })

    if (pollImageError) {
      return Response.json(
        { error: 'Failed to upload poll image', details: pollImageError.message },
        { status: 500 }
      )
    }

    // Get public URL for poll image
    const { data: pollImageUrl } = supabase.storage
      .from('poll-images')
      .getPublicUrl(pollImageData.path)

    // 5. Upload option images (only if not in feedback mode) - using parallel uploads
    const optionImageUrls: (string | null)[] = []

    if (!settings.shareWithoutOptions && options.length > 0) {
      // Create upload promises for all option images from FormData
      const uploadPromises = options.map(async (option: any, i: number) => {
        // Try to get the option image file from formData
        const optionImageFile = formData.get(`optionImage_${i}`) as File | null

        if (optionImageFile && optionImageFile instanceof File) {
          try {
            // File is already in the correct format, just upload it
            console.log(`Uploading option ${i} image:`, optionImageFile.name, optionImageFile.size, 'bytes')
            
            const buffer = await optionImageFile.arrayBuffer()
            
            if (buffer.byteLength === 0) {
              console.error(`Option image ${i} is empty`)
              return null
            }

            const optionImagePath = `polls/${user.id}/option-${Date.now()}-${i}-${Math.random().toString(36).substr(2, 9)}`

            const { data: optionImageData, error: optionImageError } =
              await supabase.storage
                .from('poll-option-images')
                .upload(optionImagePath, buffer, {
                  contentType: optionImageFile.type || 'image/jpeg',
                })

            if (!optionImageError && optionImageData) {
              const { data: optionImageUrlData } = supabase.storage
                .from('poll-option-images')
                .getPublicUrl(optionImageData.path)

              return optionImageUrlData.publicUrl
            } else {
              console.error(`Upload error for option ${i}:`, optionImageError?.message)
              return null
            }
          } catch (error) {
            console.error(`Failed to process option image ${i}:`, error)
            return null
          }
        }
        return null
      })

      // Wait for all uploads to complete in parallel
      const results = await Promise.all(uploadPromises)
      optionImageUrls.push(...results)
    }

    // 6. Insert poll record
    const { data: pollData, error: pollInsertError } = await supabase
      .from('polls')
      .insert({
        user_id: user.id,
        title: title.trim(),
        description: description?.trim() || null,
        poll_image_url: pollImageUrl.publicUrl,
        allow_multiple: settings.allowMultiple || false,
        share_without_image: settings.shareWithoutImage || false,
        share_without_options: settings.shareWithoutOptions || false,
        is_published: true,
        is_closed: false,
        visibility: settings.visibility || 'public', // 'public' or 'private'
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .select()
      .single()

    if (pollInsertError) {
      return Response.json(
        { error: 'Failed to create poll', details: pollInsertError.message },
        { status: 500 }
      )
    }

    const pollId = pollData.id

    // 7. Insert poll options (only if not in feedback mode)
    if (!settings.shareWithoutOptions && options.length > 0) {
      const validOptions = options
        .map((opt: any, index: number) => ({
          text: opt.text,
          image_url: optionImageUrls[index] || null,
        }))
        .filter((opt: any) => opt.text.trim() !== '')

      if (validOptions.length > 0) {
        const optionsToInsert = validOptions.map((opt: any, index: number) => ({
          poll_id: pollId,
          text: opt.text.trim(),
          image_url: opt.image_url,
          order: index,
        }))

        const { error: optionsInsertError } = await supabase
          .from('poll_options')
          .insert(optionsToInsert)

        if (optionsInsertError) {
          console.error('Failed to insert options:', optionsInsertError)
          // Don't fail the poll creation if options fail - poll is already created
        }
      }
    }

    // 8. Return success response
    return Response.json(
      {
        success: true,
        pollId: pollId,
        message: 'Poll created successfully',
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('Error creating poll:', error)
    return Response.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}
