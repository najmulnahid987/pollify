'use client'

import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import { X, Plus, Trash2 } from 'lucide-react'

export default function CreatePollPage() {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [options, setOptions] = useState(['', ''])
  const [settings, setSettings] = useState({
    allowMultiple: false,
    shareWithoutOpinion: false,
    keepRateOnly: false,
  })

  const addOption = () => {
    setOptions([...options, ''])
  }

  const removeOption = (index: number) => {
    if (options.length > 2) {
      setOptions(options.filter((_, i) => i !== index))
    }
  }

  const updateOption = (index: number, value: string) => {
    const newOptions = [...options]
    newOptions[index] = value
    setOptions(newOptions)
  }

  const handleSettingChange = (key: string) => {
    setSettings({
      ...settings,
      [key]: !settings[key as keyof typeof settings],
    })
  }

  const handleSavePoll = (e: React.FormEvent) => {
    e.preventDefault()
    console.log({
      title,
      description,
      options: options.filter(opt => opt.trim() !== ''),
      settings,
    })
    // TODO: Add API call to save poll
  }

  return (
    <div className="min-h-screen bg-transparent">
      <main className="">
        <div className="mb-6 sm:mb-8 pt-2 sm:pt-3 px-4 sm:px-6">
              <h1 className="text-lg sm:text-xl font-bold text-gray-900">Create a New Poll</h1>
              <p className="text-xs sm:text-sm text-gray-600 mt-1">Fill out the details below to create your poll.</p>
            </div>
        <div className="w-full h-full flex flex-col items-center">
          <div className="w-full max-w-2xl bg-transparent p-4 sm:p-6 md:p-8">
            

            <form onSubmit={handleSavePoll} className="space-y-5">
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
                  Description (optional)
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

              {/* Options */}
              <div className="space-y-3">
                <Label className="text-sm font-semibold text-gray-900 block text-center">Options</Label>
                {options.map((option, index) => (
                  <div key={index} className="flex items-center space-x-3 justify-center">
                    <Input
                      type="text"
                      placeholder={`Option ${index + 1}`}
                      value={option}
                      onChange={(e) => updateOption(index, e.target.value)}
                      className="w-full max-w-md px-4 py-2.5 text-sm border border-gray-300 rounded-lg bg-white text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition ease-in-out duration-150"
                    />
                    <button
                      type="button"
                      onClick={() => removeOption(index)}
                      className="text-gray-400 hover:text-red-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex-shrink-0 p-2"
                      disabled={options.length <= 2}
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
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

              {/* Poll Settings */}
              <div className="space-y-4 mt-5 pt-5 border-t border-gray-200">
                <h2 className="text-base font-bold text-gray-900">Poll Settings</h2>

                {/* Allow Multiple Choices */}
                <div className="flex items-start gap-3">
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
                    <p className="text-sm text-gray-600 mt-1">Voters can select more than one option.</p>
                  </div>
                </div>

                {/* Share Without Opinion */}
                <div className="flex items-start gap-3">
                  <Checkbox
                    id="share-without-opinion"
                    checked={settings.shareWithoutOpinion}
                    onCheckedChange={() => handleSettingChange('shareWithoutOpinion')}
                    className="mt-1 h-4 w-4"
                  />
                  <div>
                    <Label htmlFor="share-without-opinion" className="font-semibold text-gray-900 cursor-pointer block text-sm">
                      Share without opinion
                    </Label>
                    <p className="text-sm text-gray-600 mt-1">Voters can't share opinion and rate.</p>
                  </div>
                </div>

                {/* Keep Rate Only */}
                <div className="flex items-start gap-3">
                  <Checkbox
                    id="keep-rate-only"
                    checked={settings.keepRateOnly}
                    onCheckedChange={() => handleSettingChange('keepRateOnly')}
                    className="mt-1 h-4 w-4"
                  />
                  <div>
                    <Label htmlFor="keep-rate-only" className="font-semibold text-gray-900 cursor-pointer block text-sm">
                      Keep the rate only
                    </Label>
                    <p className="text-sm text-gray-600 mt-1">Voters only share the rating.</p>
                  </div>
                </div>
              </div>

              {/* Save Button */}
              <div className="mt-5 pt-5 border-t border-gray-200 flex justify-center">
                <Button
                  type="submit"
                  className="bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold text-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-opacity-50 transition ease-in-out duration-150 shadow-lg shadow-blue-500/20"
                >
                  Save Poll
                </Button>
              </div>
            </form>
          </div>
        </div>
      </main>
    </div>
  )
}