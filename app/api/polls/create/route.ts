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

    // 2. Parse FormData
    const formData = await request.formData()
    const title = formData.get('title') as string
    const description = formData.get('description') as string
    const pollImageFile = formData.get('pollImage') as File
    const optionsJson = formData.get('options') as string
    const settingsJson = formData.get('settings') as string

    // 3. Validate required fields
    if (!title) {
      return Response.json(
        { error: 'Poll title is required' },
        { status: 400 }
      )
    }

    if (!pollImageFile) {
      return Response.json(
        { error: 'Poll image is required' },
        { status: 400 }
      )
    }

    const options = JSON.parse(optionsJson || '[]')
    const settings = JSON.parse(settingsJson || '{}')

    // 4. Upload poll header image
    const pollImageBuffer = await pollImageFile.arrayBuffer()
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

    // 5. Upload option images (only if not in feedback mode)
    const optionImageUrls: (string | null)[] = []

    if (!settings.shareWithoutOptions && options.length > 0) {
      for (let i = 0; i < options.length; i++) {
        const option = options[i]

        if (option.image && option.image.startsWith('data:')) {
          try {
            // Convert base64 to buffer
            const base64Data = option.image.split(',')[1]
            const buffer = Buffer.from(base64Data, 'base64')

            const optionImagePath = `polls/${user.id}/option-${Date.now()}-${i}-${Math.random().toString(36).substr(2, 9)}`

            const { data: optionImageData, error: optionImageError } =
              await supabase.storage
                .from('poll-option-images')
                .upload(optionImagePath, buffer, {
                  contentType: 'image/jpeg', // Default, could detect from base64
                })

            if (!optionImageError && optionImageData) {
              const { data: optionImageUrlData } = supabase.storage
                .from('poll-option-images')
                .getPublicUrl(optionImageData.path)

              optionImageUrls.push(optionImageUrlData.publicUrl)
            } else {
              optionImageUrls.push(null)
            }
          } catch (error) {
            console.error(`Failed to process option image ${i}:`, error)
            optionImageUrls.push(null)
          }
        } else {
          optionImageUrls.push(null)
        }
      }
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
