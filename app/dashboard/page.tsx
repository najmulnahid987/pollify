'use client'

import React, { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import { X, Plus, Trash2, ImagePlus, Loader2 } from 'lucide-react'
import { createClient } from '@/lib/supabase'

interface PollOption {
  text: string
  image: string | null
}

const MAX_TOTAL_UPLOAD_BYTES = 45 * 1024 * 1024

export default function CreatePollPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const pollId = searchParams?.get('pollId')
  
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [pollImage, setPollImage] = useState<string | null>(null)
  const [options, setOptions] = useState<PollOption[]>([
    { text: '', image: null },
    { text: '', image: null },
  ])
  const [settings, setSettings] = useState({
    allowMultiple: false,
    shareWithoutImage: false,
    shareWithoutOptions: false,
  })
  const [selectedImagePopup, setSelectedImagePopup] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isEditMode, setIsEditMode] = useState(false)
  const [pageLoading, setPageLoading] = useState(true)

  // Fetch poll data if in edit mode
  useEffect(() => {
    const fetchPollData = async () => {
      if (!pollId) {
        setPageLoading(false)
        return
      }

      try {
        setIsEditMode(true)
        const supabase = createClient()

        // Fetch poll data
        const { data: pollData, error: pollError } = await supabase
          .from('polls')
          .select('*')
          .eq('id', pollId)
          .single()

        if (pollError) {
          console.error('Error fetching poll:', pollError)
          setError('Failed to load poll data')
          setPageLoading(false)
          return
        }

        // Fetch poll options
        const { data: optionsData, error: optionsError } = await supabase
          .from('poll_options')
          .select('*')
          .eq('poll_id', pollId)
          .order('id', { ascending: true })

        if (optionsError) {
          console.error('Error fetching options:', optionsError)
        }

        // Populate form with fetched data
        setTitle(pollData.title || '')
        setDescription(pollData.description || '')
        
        // Set poll image
        if (pollData.poll_image_url) {
          setPollImage(pollData.poll_image_url)
        }

        // Set options
        if (optionsData && optionsData.length > 0) {
          setOptions(
            optionsData.map((opt: any) => ({
              text: opt.text || '',
              image: opt.image_url || null,
            }))
          )
        }

        // Set settings
        setSettings({
          allowMultiple: pollData.allow_multiple || false,
          shareWithoutImage: pollData.share_without_image || false,
          shareWithoutOptions: pollData.share_without_options || false,
        })

        setPageLoading(false)
      } catch (error) {
        console.error('Error loading poll:', error)
        setError('Failed to load poll data')
        setPageLoading(false)
      }
    }

    fetchPollData()
  }, [pollId])

  const addOption = () => {
    setOptions([...options, { text: '', image: null }])
  }

  const removeOption = (index: number) => {
    if (options.length > 2) {
      setOptions(options.filter((_, i) => i !== index))
    }
  }

  const updateOption = (index: number, value: string) => {
    const newOptions = [...options]
    newOptions[index].text = value
    setOptions(newOptions)
  }

  const validateImageFile = (file: File): string | null => {
    // Check file size (max 5MB)
    const maxSize = 5 * 1024 * 1024
    if (file.size > maxSize) {
      return `Image must be less than 5MB (current: ${(file.size / 1024 / 1024).toFixed(2)}MB)`
    }

    // Check file type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp']
    if (!allowedTypes.includes(file.type)) {
      return `Invalid image type. Allowed: JPEG, PNG, GIF, WebP`
    }

    return null
  }

  const fileToDataUrl = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = () => resolve(reader.result as string)
      reader.onerror = () => reject(new Error('Failed to read image file'))
      reader.readAsDataURL(file)
    })
  }

  const compressImageToDataUrl = async (
    file: File,
    maxDimension = 1280,
    quality = 0.8
  ): Promise<string> => {
    const originalDataUrl = await fileToDataUrl(file)

    // GIF animation should be preserved; avoid canvas re-encode for GIF.
    if (file.type === 'image/gif') {
      return originalDataUrl
    }

    const img = await new Promise<HTMLImageElement>((resolve, reject) => {
      const image = new Image()
      image.onload = () => resolve(image)
      image.onerror = () => reject(new Error('Failed to load image for compression'))
      image.src = originalDataUrl
    })

    let width = img.width
    let height = img.height

    if (width > maxDimension || height > maxDimension) {
      const ratio = Math.min(maxDimension / width, maxDimension / height)
      width = Math.max(1, Math.round(width * ratio))
      height = Math.max(1, Math.round(height * ratio))
    }

    const canvas = document.createElement('canvas')
    canvas.width = width
    canvas.height = height

    const ctx = canvas.getContext('2d')
    if (!ctx) {
      throw new Error('Failed to process image')
    }

    ctx.drawImage(img, 0, 0, width, height)
    return canvas.toDataURL('image/jpeg', quality)
  }

  const handleImageUpload = async (index: number, file: File) => {
    const error = validateImageFile(file)
    if (error) {
      setError(error)
      return
    }

    try {
      const compressedDataUrl = await compressImageToDataUrl(file)
      const newOptions = [...options]
      newOptions[index].image = compressedDataUrl
      setOptions(newOptions)
      setError(null)
    } catch {
      setError('Failed to process option image')
    }
  }

  const handlePollImageUpload = async (file: File) => {
    const error = validateImageFile(file)
    if (error) {
      setError(error)
      return
    }

    try {
      const compressedDataUrl = await compressImageToDataUrl(file)
      setPollImage(compressedDataUrl)
      setError(null)
    } catch {
      setError('Failed to process poll image')
    }
  }

  const removePollImage = () => {
    setPollImage(null)
  }

  const removeOptionImage = (index: number) => {
    const newOptions = [...options]
    newOptions[index].image = null
    setOptions(newOptions)
  }

  const handleSettingChange = (key: string) => {
    setSettings({
      ...settings,
      [key]: !settings[key as keyof typeof settings],
    })
  }

  const convertBase64ToFile = (base64: string, filename: string): File | null => {
    try {
      // Validate base64 format
      if (!base64 || typeof base64 !== 'string') {
        console.error('Invalid base64: not a string or empty', typeof base64)
        return null
      }

      if (!base64.includes(',')) {
        console.error('Invalid base64 format: missing comma separator')
        return null
      }

      const parts = base64.split(',')
      if (parts.length !== 2) {
        console.error('Invalid base64 format: incorrect number of parts', parts.length)
        return null
      }

      // Extract MIME type and base64 data
      const mimeMatch = parts[0].match(/:(.*?);/)
      const mime = mimeMatch ? mimeMatch[1] : 'image/jpeg'
      const base64Data = parts[1]

      if (!base64Data || base64Data.trim() === '') {
        console.error('Invalid base64: empty data')
        return null
      }

      // Validate base64 characters
      if (!/^[A-Za-z0-9+/=\s]*$/.test(base64Data)) {
        console.error('Invalid base64: contains invalid characters')
        return null
      }

      // Clean up base64 data (remove whitespace)
      const cleanedBase64 = base64Data.replace(/\s/g, '')

      if (cleanedBase64.length === 0) {
        console.error('Invalid base64: empty after cleaning')
        return null
      }

      try {
        // Try to decode base64
        const bstr = atob(cleanedBase64)
        const n = bstr.length
        const u8arr = new Uint8Array(n)
        for (let i = 0; i < n; i++) {
          u8arr[i] = bstr.charCodeAt(i)
        }
        
        const file = new File([u8arr], filename, { type: mime })
        console.log(`Successfully created file: ${filename}, size: ${file.size} bytes, type: ${mime}`)
        return file
      } catch (atobError) {
        console.error('Failed to decode base64:', atobError)
        return null
      }
    } catch (error) {
      console.error('Error converting base64 to file:', error)
      return null
    }
  }

  const handleSavePoll = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Validate that an image is uploaded
    if (!pollImage) {
      setError('Please upload an image for the poll')
      return
    }

    // Validate title
    if (!title.trim()) {
      setError('Poll title is required')
      return
    }

    // Validate options if not in feedback mode
    if (!settings.shareWithoutOptions && !settings.shareWithoutImage) {
      const nonEmptyOptions = options.filter(opt => opt.text.trim() !== '')
      if (nonEmptyOptions.length < 2) {
        setError('Please add at least 2 options')
        return
      }
    }

    setIsLoading(true)
    setError(null)

    try {
      if (isEditMode && pollId) {
        // Update existing poll
        const response = await fetch(`/api/polls/${pollId}/update`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            title,
            description,
            pollImage,
            options,
            settings,
          }),
        })

        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(errorData.error || 'Failed to update poll')
        }

        router.push(`/dashboard/poll/${pollId}`)
      } else {
        // Create new poll
        // Validate image before proceeding
        if (!pollImage || typeof pollImage !== 'string') {
          throw new Error('Poll image is invalid or missing')
        }

        console.log('Converting poll image to file...')
        const pollImageFile = convertBase64ToFile(pollImage, `poll-${Date.now()}.jpg`)
        if (!pollImageFile) {
          throw new Error('Failed to process poll image - the image data may be corrupted or in an unsupported format. Please try uploading a different image.')
        }
        console.log('Poll image file created:', { size: pollImageFile.size, type: pollImageFile.type })

        const formDataObj = new FormData()
        formDataObj.append('title', title)
        formDataObj.append('description', description)
        
        // Add settings data
        formDataObj.append('settings', JSON.stringify(settings))
        
        // Add poll image
        formDataObj.append('pollImage', pollImageFile)

        // Prepare options with only text (no base64 data)
        const optionsForServer = options.map(opt => ({
          text: opt.text || ''
          // NOTE: We do NOT include image data here - it's sent separately as files
        }))
        formDataObj.append('options', JSON.stringify(optionsForServer))
        
        console.log('Options JSON size:', JSON.stringify(optionsForServer).length, 'bytes')

        // Add option images as separate File entries (only if they exist)
        console.log('Processing option images...')
        let totalUploadBytes = pollImageFile.size
        for (let i = 0; i < options.length; i++) {
          const option = options[i]
          if (option.image && option.image.startsWith('data:')) {
            try {
              console.log(`Converting option ${i} image to file...`)
              const optionImageFile = convertBase64ToFile(option.image, `option-${i}.jpg`)
              if (optionImageFile) {
                totalUploadBytes += optionImageFile.size
                formDataObj.append(`optionImage_${i}`, optionImageFile)
                console.log(`Option ${i} image added:`, { size: optionImageFile.size, type: optionImageFile.type })
              } else {
                console.warn(`Option ${i} image conversion returned null`)
              }
            } catch (error) {
              console.error(`Failed to convert option ${i} image:`, error)
            }
          }
        }

        if (totalUploadBytes > MAX_TOTAL_UPLOAD_BYTES) {
          throw new Error('Total image upload is too large. Please use smaller images or fewer images per poll.')
        }

        console.log('Creating poll with', optionsForServer.length, 'options')
        console.log('FormData ready, sending to API...')
        console.log('FormData entries count:', Array.from(formDataObj.entries()).length)

        // Call API endpoint
        const response = await fetch('/api/polls/create', {
          method: 'POST',
          body: formDataObj,
        })

        if (!response.ok) {
          let errorMsg = 'Failed to create poll'
          try {
            const errorData = await response.json()
            errorMsg = errorData.error || errorMsg
            if (errorData.details) {
              errorMsg += `: ${errorData.details}`
            }
          } catch {
            errorMsg = `Server error: ${response.status} ${response.statusText}`
          }
          throw new Error(errorMsg)
        }

        const { pollId: newPollId } = await response.json()

        // Success - redirect to poll detail page
        router.push(`/dashboard/poll/${newPollId}`)
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Something went wrong'
      setError(errorMessage)
      console.error('Error saving poll:', err)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-transparent">
      <main className="">
        <div className="mb-12 sm:mb-16 pt-2 sm:pt-3 px-4 sm:px-6 text-center">
          <h1 className="text-lg sm:text-xl font-bold text-gray-900">
            {isEditMode ? 'Edit Poll' : 'Create a New Poll'}
          </h1>
          <p className="text-xs sm:text-sm text-gray-600 mt-1">
            {isEditMode ? 'Update the details of your poll.' : 'Fill out the details below to create your poll.'}
          </p>
        </div>

        {pageLoading ? (
          <div className="flex justify-center items-center min-h-[60vh]">
            <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
          </div>
        ) : (
          <div className="w-full h-full flex flex-col lg:flex-row gap-6 lg:gap-8 px-4 sm:px-6 lg:px-8 pb-8 justify-center items-center">
            {/* Left Section - Poll Creation */}
            <div className="flex-1 min-w-0 max-w-md flex flex-col items-center">
            <form onSubmit={handleSavePoll} className="space-y-5 w-full">
              {/* Poll Title */}
              <div className="text-center">
                <Label htmlFor="poll-title" className="text-sm font-semibold text-gray-900 mb-2 block">
                  Poll Title
                </Label>
                <Input
                  id="poll-title"
                  name="poll-title"
                  placeholder="e.g., What's your favorite programming language?"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-4 py-2.5 text-sm border border-gray-300 rounded-lg bg-white text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition ease-in-out duration-150"
                />
              </div>

              {/* Description */}
              <div className="text-center">
                <Label htmlFor="poll-description" className="text-sm font-semibold text-gray-900 mb-2 block">
                  Description
                </Label>
                <Textarea
                  id="poll-description"
                  name="poll-description"
                  placeholder="Add a description for your poll..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={3}
                  className="w-full px-4 py-2.5 text-sm border border-gray-300 rounded-lg bg-white text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition ease-in-out duration-150"
                />
              </div>

              {/* Poll Image Upload */}
              <div className="text-center">
                <Label className="text-xs font-semibold text-gray-900 mb-0.5 block">
                  Poll Image <span className="text-red-500">*</span>
                </Label>
                {pollImage ? (
                  <div className="relative inline-block">
                    <button
                      type="button"
                      onClick={() => setSelectedImagePopup(pollImage)}
                      className="relative cursor-pointer group"
                    >
                      <img
                        src={pollImage}
                        alt="Poll preview"
                        className="h-16 w-24 object-cover rounded-lg border-2 border-blue-500 hover:border-blue-600 transition-colors"
                      />
                    </button>
                    <button
                      type="button"
                      onClick={removePollImage}
                      className="absolute -top-2 -right-2 bg-red-500 hover:bg-red-600 text-white rounded-full p-0.5 transition-colors shadow-md"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                ) : (
                  <label htmlFor="poll-image-upload" className="cursor-pointer block">
                    <div className="flex flex-col items-center justify-center h-16 w-full bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors border-2 border-dashed border-gray-300 hover:border-gray-400 p-1">
                      <ImagePlus className="h-5 w-5 text-gray-400" />
                      <p className="text-xs text-gray-700">Upload</p>
                    </div>
                    <input
                      id="poll-image-upload"
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        if (e.target.files?.[0]) {
                          handlePollImageUpload(e.target.files[0])
                        }
                      }}
                      className="hidden"
                    />
                  </label>
                )}
              </div>

              {/* Options */}
              {!settings.shareWithoutOptions && (
                <>
                  <div className="space-y-3">
                    <Label className="text-sm font-semibold text-gray-900 block text-center">Options</Label>
                    {options.map((option, index) => (
                      <div key={index} className="space-y-2">
                        {/* Input Row with Image Upload and Delete */}
                        <div className="flex items-center space-x-3">
                          {/* Image Upload Button / Thumbnail */}
                          {!settings.shareWithoutImage && (
                            <>
                              {option.image ? (
                                <button
                                  type="button"
                                  onClick={() => setSelectedImagePopup(option.image)}
                                  className="relative flex-shrink-0 cursor-pointer group"
                                >
                                  <img
                                    src={option.image}
                                    alt={`Option ${index + 1} preview`}
                                    className="h-10 w-10 object-cover rounded-lg border-2 border-blue-500 hover:border-blue-600 transition-colors"
                                  />
                                  <button
                                    type="button"
                                    onClick={(e) => {
                                      e.stopPropagation()
                                      removeOptionImage(index)
                                    }}
                                    className="absolute -top-2 -right-2 bg-red-500 hover:bg-red-600 text-white rounded-full p-0.5 transition-colors shadow-md"
                                  >
                                    <X className="h-3 w-3" />
                                  </button>
                                </button>
                              ) : (
                                <label htmlFor={`image-upload-${index}`} className="flex-shrink-0 cursor-pointer">
                                  <div className="flex items-center justify-center h-10 w-10 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors">
                                    <ImagePlus className="h-5 w-5 text-gray-400" />
                                  </div>
                                  <input
                                    id={`image-upload-${index}`}
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => {
                                      if (e.target.files?.[0]) {
                                        handleImageUpload(index, e.target.files[0])
                                      }
                                    }}
                                    className="hidden"
                                  />
                                </label>
                              )}
                            </>
                          )}
                          {/* Option Text Input */}
                          <Input
                            type="text"
                            placeholder={`Option ${index + 1}`}
                            value={option.text}
                            onChange={(e) => updateOption(index, e.target.value)}
                            className="w-full px-4 py-2.5 text-sm border border-gray-300 rounded-lg bg-white text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition ease-in-out duration-150"
                          />
                          {/* Delete Button */}
                          <button
                            type="button"
                            onClick={() => removeOption(index)}
                            className="text-gray-400 hover:text-red-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex-shrink-0 p-2"
                            disabled={options.length <= 2}
                          >
                            <Trash2 className="h-5 w-5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Add Option Button */}
                  <div className="flex justify-center">
                    <button
                      type="button"
                      onClick={addOption}
                      className="flex justify-center items-center gap-2 text-blue-600 bg-blue-50 px-4 py-2 rounded-lg font-semibold text-sm hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition ease-in-out duration-150"
                    >
                      <Plus className="h-4 w-4" />
                      <span>Add Option</span>
                    </button>
                  </div>
                </>
              )}
            </form>
          </div>

          {/* Right Section - Poll Settings */}
          <div className="flex-1 min-w-0 max-w-md flex flex-col items-start border-l border-gray-200 pl-6 lg:pl-8 self-start">
            <form onSubmit={handleSavePoll} className="space-y-4 w-full">
              <h2 className="text-base font-bold text-gray-900 text-center">Poll Settings</h2>

              {/* Allow Multiple Choices */}
              <div className="flex items-start gap-3 w-full">
                <Checkbox
                  id="allow-multiple-choices"
                  checked={settings.allowMultiple}
                  onCheckedChange={() => handleSettingChange('allowMultiple')}
                  className="mt-1 h-4 w-4"
                />
                <div>
                  <Label htmlFor="allow-multiple-choices" className="font-semibold text-gray-900 cursor-pointer block text-sm">
                    Allow multiple choices
                  </Label>
                  <p className="text-sm text-gray-600 mt-1">Multiple selections are allowed.</p>
                </div>
              </div>

              {/* Share Without Image */}
              <div className="flex items-start gap-3 w-full">
                <Checkbox
                  id="share-without-image"
                  checked={settings.shareWithoutImage}
                  onCheckedChange={() => handleSettingChange('shareWithoutImage')}
                  className="mt-1 h-4 w-4"
                />
                <div>
                  <Label htmlFor="share-without-image" className="font-semibold text-gray-900 cursor-pointer block text-sm">
                    Share without image
                  </Label>
                  <p className="text-sm text-gray-600 mt-1">Image upload is optional for each option.</p>
                </div>
              </div>

              {/* Share Without Options */}
              <div className="flex items-start gap-3 w-full">
                <Checkbox
                  id="share-without-options"
                  checked={settings.shareWithoutOptions}
                  onCheckedChange={() => handleSettingChange('shareWithoutOptions')}
                  className="mt-1 h-4 w-4"
                />
                <div>
                  <Label htmlFor="share-without-options" className="font-semibold text-gray-900 cursor-pointer block text-sm">
                    Share Without Options
                  </Label>
                  <p className="text-sm text-gray-600 mt-1">Voters can quickly share feedback by providing their name, email</p>
                </div>
              </div>

              {/* Save Button */}
              <div className="mt-6 pt-4 border-t border-gray-200">
                {error && (
                  <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-sm text-red-600">{error}</p>
                  </div>
                )}
                <div className="flex justify-center">
                  <Button
                    type="submit"
                    disabled={isLoading}
                    className="bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold text-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-opacity-50 transition ease-in-out duration-150 shadow-lg shadow-blue-500/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        {isEditMode ? 'Updating...' : 'Creating...'}
                      </>
                    ) : (
                      isEditMode ? 'Update Poll' : 'Save Poll'
                    )}
                  </Button>
                </div>
              </div>
            </form>
          </div>
        </div>
        )}

        {/* Image Popup Modal */}
        {selectedImagePopup && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
            onClick={() => setSelectedImagePopup(null)}
          >
            <div
              className="bg-white rounded-lg shadow-xl max-w-2xl max-h-[90vh] overflow-auto relative"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close Button */}
              <button
                onClick={() => setSelectedImagePopup(null)}
                className="absolute top-4 right-4 bg-red-500 hover:bg-red-600 text-white rounded-full p-2 transition-colors shadow-md z-10"
              >
                <X className="h-6 w-6" />
              </button>

              {/* Image Display */}
              <img
                src={selectedImagePopup}
                alt="Poll option preview"
                className="w-full h-auto"
              />
            </div>
          </div>
        )}
      </main>
    </div>
  )
}