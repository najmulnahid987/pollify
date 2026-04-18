import { createSupabaseServerClient } from '@/lib/supabase-server'

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ pollId: string }> }
) {
  try {
    // Get params - it's a Promise in Next.js 13+
    const { pollId } = await params

    // 1. Get authenticated user
    const supabase = await createSupabaseServerClient()

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // 2. Verify poll ownership
    const { data: existingPoll, error: fetchError } = await supabase
      .from('polls')
      .select('id, user_id, poll_image_url')
      .eq('id', pollId)
      .single()

    if (fetchError || !existingPoll) {
      console.error('Poll not found:', fetchError)
      return Response.json({ error: 'Poll not found' }, { status: 404 })
    }

    if (existingPoll.user_id !== user.id) {
      return Response.json({ error: 'Unauthorized' }, { status: 403 })
    }

    // 3. Parse request body
    const { title, description, pollImage, options, settings } = await request.json()

    // 4. Validate required fields
    if (!title) {
      return Response.json(
        { error: 'Poll title is required' },
        { status: 400 }
      )
    }

    if (!pollImage) {
      return Response.json(
        { error: 'Poll image is required' },
        { status: 400 }
      )
    }

    let pollImageUrl = existingPoll.poll_image_url

    // 5. Upload new poll image if it's a base64 string (new image)
    if (pollImage.startsWith('data:')) {
      try {
        // Parse base64 data with proper error handling
        const parts = pollImage.split(',')
        if (parts.length !== 2) {
          return Response.json(
            { error: 'Invalid poll image format' },
            { status: 400 }
          )
        }

        const mimeMatch = parts[0].match(/:(.*?);/)
        const mimeType = mimeMatch ? mimeMatch[1] : 'image/jpeg'
        
        const base64Data = parts[1]
        if (!base64Data || !/^[A-Za-z0-9+/=]+$/.test(base64Data)) {
          return Response.json(
            { error: 'Invalid poll image data' },
            { status: 400 }
          )
        }

        const buffer = Buffer.from(base64Data, 'base64')

        // Validate buffer size (max 5MB)
        if (buffer.length > 5 * 1024 * 1024) {
          return Response.json(
            { error: 'Poll image exceeds 5MB limit' },
            { status: 400 }
          )
        }

        const pollImagePath = `polls/${user.id}/poll-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`

        const { data: pollImageData, error: pollImageError } = await supabase.storage
          .from('poll-images')
          .upload(pollImagePath, buffer, {
            contentType: mimeType,
          })

        if (!pollImageError && pollImageData) {
          const { data: pollImageUrlData } = supabase.storage
            .from('poll-images')
            .getPublicUrl(pollImageData.path)

          pollImageUrl = pollImageUrlData.publicUrl

          // Delete old poll image
          try {
            const oldImagePath = existingPoll.poll_image_url.split('/').slice(-2).join('/')
            await supabase.storage.from('poll-images').remove([oldImagePath])
          } catch (deleteError) {
            console.error('Error deleting old poll image:', deleteError)
          }
        } else {
          return Response.json(
            { error: 'Failed to upload poll image', details: pollImageError?.message },
            { status: 500 }
          )
        }
      } catch (error) {
        console.error('Error processing poll image:', error)
        return Response.json(
          { error: 'Failed to process poll image' },
          { status: 500 }
        )
      }
    }

    // 6. Process option images - using parallel uploads
    const optionImageUrls: (string | null)[] = []

    if (!settings.shareWithoutOptions && options.length > 0) {
      // Create upload promises for all options
      const uploadPromises = options.map(async (option, i) => {
        if (option.image && option.image.startsWith('data:')) {
          try {
            // Parse base64 data with proper error handling
            const parts = option.image.split(',')
            if (parts.length !== 2) {
              console.error(`Invalid base64 format for option image ${i}`)
              return null
            }

            const mimeMatch = parts[0].match(/:(.*?);/)
            const mimeType = mimeMatch ? mimeMatch[1] : 'image/jpeg'
            
            const base64Data = parts[1]
            if (!base64Data) {
              console.error(`Empty base64 data for option image ${i}`)
              return null
            }

            // Validate base64 format
            if (!/^[A-Za-z0-9+/=]+$/.test(base64Data)) {
              console.error(`Invalid base64 characters in option image ${i}`)
              return null
            }

            const buffer = Buffer.from(base64Data, 'base64')
            
            // Validate buffer size (max 5MB per image)
            if (buffer.length > 5 * 1024 * 1024) {
              console.error(`Option image ${i} exceeds 5MB limit`)
              return null
            }

            const optionImagePath = `polls/${user.id}/option-${Date.now()}-${i}-${Math.random().toString(36).substr(2, 9)}`

            const { data: optionImageData, error: optionImageError } = await supabase.storage
              .from('poll-option-images')
              .upload(optionImagePath, buffer, {
                contentType: mimeType,
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
        } else if (option.image && !option.image.startsWith('data:')) {
          // Existing URL image - return as is
          return option.image
        }
        return null
      })

      // Wait for all uploads to complete in parallel
      const results = await Promise.all(uploadPromises)
      optionImageUrls.push(...results)
    }

    // 7. Update poll record
    const { error: pollUpdateError } = await supabase
      .from('polls')
      .update({
        title: title.trim(),
        description: description?.trim() || null,
        poll_image_url: pollImageUrl,
        allow_multiple: settings.allowMultiple || false,
        share_without_image: settings.shareWithoutImage || false,
        share_without_options: settings.shareWithoutOptions || false,
        updated_at: new Date().toISOString(),
      })
      .eq('id', pollId)

    if (pollUpdateError) {
      return Response.json(
        { error: 'Failed to update poll', details: pollUpdateError.message },
        { status: 500 }
      )
    }

    // 8. Get existing poll options and their vote counts
    const { data: oldOptions, error: oldOptionsError } = await supabase
      .from('poll_options')
      .select('id, text')
      .eq('poll_id', pollId)

    if (oldOptionsError) {
      console.error('Error fetching old options:', oldOptionsError)
    }

    // Create a mapping of old option indices to their IDs for vote preservation
    const optionIdMapping: { [key: number]: string } = {}
    if (oldOptions) {
      oldOptions.forEach((opt: any, index: number) => {
        optionIdMapping[index] = opt.id
      })
    }

    // 9. Update or insert poll options while preserving votes
    if (!settings.shareWithoutOptions && options.length > 0) {
      const validOptions = options
        .map((opt: any, index: number) => ({
          text: opt.text,
          image_url: optionImageUrls[index] || null,
          oldId: optionIdMapping[index] || null,
        }))
        .filter((opt: any) => opt.text.trim() !== '')

      if (validOptions.length > 0) {
        // Update existing options first (preserve their IDs and votes)
        for (let i = 0; i < validOptions.length && i < (oldOptions?.length || 0); i++) {
          const opt = validOptions[i]
          if (opt.oldId) {
            const { error: updateError } = await supabase
              .from('poll_options')
              .update({
                text: opt.text.trim(),
                image_url: opt.image_url,
              })
              .eq('id', opt.oldId)

            if (updateError) {
              console.error('Error updating option:', updateError)
            }
          }
        }

        // Insert new options (if there are more options than before)
        const newOptionsToInsert = validOptions.slice((oldOptions?.length || 0)).map((opt: any, index: number) => ({
          poll_id: pollId,
          text: opt.text.trim(),
          image_url: opt.image_url,
          order: (oldOptions?.length || 0) + index,
        }))

        if (newOptionsToInsert.length > 0) {
          const { error: insertError } = await supabase
            .from('poll_options')
            .insert(newOptionsToInsert)

          if (insertError) {
            console.error('Error inserting new options:', insertError)
          }
        }

        // Delete old options that are no longer needed (if fewer options than before)
        if (validOptions.length < (oldOptions?.length || 0)) {
          const optionsToDelete = oldOptions!.slice(validOptions.length)
          for (const opt of optionsToDelete) {
            const { error: deleteError } = await supabase
              .from('poll_options')
              .delete()
              .eq('id', opt.id)

            if (deleteError) {
              console.error('Error deleting old option:', deleteError)
            }
          }
        }
      }
    } else if (settings.shareWithoutOptions && oldOptions && oldOptions.length > 0) {
      // If switching to feedback mode, delete all options
      for (const opt of oldOptions) {
        await supabase
          .from('poll_options')
          .delete()
          .eq('id', opt.id)
      }
    }

    // 10. Return success response
    return Response.json(
      {
        success: true,
        pollId: pollId,
        message: 'Poll updated successfully',
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('Error updating poll:', error)
    return Response.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}
