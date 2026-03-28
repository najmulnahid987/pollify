'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Copy, Download, Globe, Lock, QrCode, Share2 } from 'lucide-react';

function PollShare({ pollId = 'x8j29s' }) {
  const [visibility, setVisibility] = useState<'public' | 'private'>('public');
  const [copied, setCopied] = useState(false);
  const [confirmDialog, setConfirmDialog] = useState<{ isOpen: boolean; newVisibility: 'public' | 'private' | null }>({
    isOpen: false,
    newVisibility: null,
  });
  
  const pollLink = `https://pollify.app/p/${pollId}`;

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(pollLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const handleShareLink = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Vote on my poll!',
          text: 'Check out my poll and share your opinion',
          url: pollLink,
        });
      } catch (err) {
        console.error('Error sharing:', err);
      }
    } else {
      // Fallback: copy to clipboard if Web Share API not available
      handleCopyLink();
    }
  };

  const handleDownloadQR = () => {
    console.log('Downloading QR code...');
  };

  const handleVisibilityChange = (newVisibility: 'public' | 'private') => {
    setConfirmDialog({ isOpen: true, newVisibility });
  };

  const confirmVisibilityChange = () => {
    if (confirmDialog.newVisibility) {
      setVisibility(confirmDialog.newVisibility);
    }
    setConfirmDialog({ isOpen: false, newVisibility: null });
  };

  const cancelVisibilityChange = () => {
    setConfirmDialog({ isOpen: false, newVisibility: null });
  };

  return (
    <div className="bg-white dark:bg-slate-950 flex flex-col font-display antialiased text-slate-900 dark:text-slate-100 p-3 sm:p-4">
      <div className="w-full">
        {/* Header */}
        <div className="mb-4">
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            Share the link or QR code to collect responses
          </p>
        </div>

        {/* Poll Visibility */}
        <div className="mb-5">
          <h3 className="text-sm font-semibold text-slate-900 dark:text-white mb-2">
            Visibility
          </h3>
          <div className="inline-flex rounded-md border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 p-0.5">
            <button
              onClick={() => handleVisibilityChange('public')}
              className={`inline-flex items-center gap-1.5 rounded px-3 py-1.5 text-xs font-medium transition-all ${
                visibility === 'public'
                  ? 'text-slate-900 dark:text-white bg-white dark:bg-slate-800 shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              <Globe className="w-4 h-4" />
              <span>Public</span>
            </button>
            <button
              onClick={() => handleVisibilityChange('private')}
              className={`inline-flex items-center gap-1.5 rounded px-3 py-1.5 text-xs font-medium transition-all ${
                visibility === 'private'
                  ? 'text-slate-900 dark:text-white bg-white dark:bg-slate-800 shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              <Lock className="w-4 h-4" />
              <span>Private</span>
            </button>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">
            {visibility === 'public'
              ? 'Anyone can discover and respond to this poll'
              : 'Only people with the link can respond'}
          </p>
        </div>

        {/* Share Options */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
          {/* Share Link */}
          <div className="flex flex-col gap-3 p-4 bg-slate-50 dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-700">
            <h3 className="text-sm font-semibold text-slate-900 dark:text-white">
              Share Link
            </h3>
            <div className="flex gap-2">
              <Input
                type="text"
                readOnly
                value={pollLink}
                className="text-xs h-9"
              />
              <Button
                onClick={handleCopyLink}
                size="sm"
                className="gap-1.5 whitespace-nowrap h-9"
              >
                <Copy className="w-3.5 h-3.5" />
                <span className="text-xs">
                  {copied ? 'Copied!' : 'Copy'}
                </span>
              </Button>
            </div>
            <Button
              onClick={handleShareLink}
              variant="outline"
              size="sm"
              className="gap-1.5 h-8 text-xs w-full"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>Share</span>
            </Button>
          </div>

          {/* Share QR Code */}
          <div className="flex flex-col gap-3 p-4 bg-slate-50 dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-700">
            <h3 className="text-sm font-semibold text-slate-900 dark:text-white">
              QR Code
            </h3>
            <div className="flex flex-col items-center gap-3">
              <div className="p-2 bg-white dark:bg-slate-800 rounded border border-slate-200 dark:border-slate-700">
                <div className="w-24 h-24 bg-white flex items-center justify-center rounded">
                  <img
                    alt="QR Code"
                    className="w-full h-full object-contain"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuCZhRrkL6k_5W02KL1JDkkRnrF2_yJm9uc9g_f-bDV-4xfmSZEejWkL4CP7xjWg0K_aSbF1Q9LJuloTtbZLeo7quisMvfNpGx-9PcvWFxy69k4_6J66tnfZqKCclxj6Sf-n6AE5AHjm5ciopvaos-lqZ3wawTd0lWJCvZzjL46lxZSOXSi1U7j1T5B9EDu7tL6rhKu6ClEEWAFuS6MYeLeDsCZhX_3ExlJNfk_E-6Oj5N3Xjf1XltgN9k1nANo-oRAnReYui8dQDys"
                  />
                </div>
              </div>
              <Button
                onClick={handleDownloadQR}
                variant="outline"
                size="sm"
                className="gap-1.5 h-8 text-xs w-full"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download</span>
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Confirmation Dialog */}
      {confirmDialog.isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white dark:bg-slate-950 rounded-lg shadow-lg p-6 max-w-sm mx-4">
            <h2 className="text-sm font-semibold text-slate-900 dark:text-white mb-2">
              Confirm Change
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-400 mb-6">
              Are you sure you want to make the poll{' '}
              <span className="font-semibold">
                {confirmDialog.newVisibility === 'public' ? 'public' : 'private'}
              </span>
              ?
            </p>
            <div className="flex gap-3 justify-end">
              <Button
                onClick={cancelVisibilityChange}
                variant="outline"
                size="sm"
                className="text-xs"
              >
                Cancel
              </Button>
              <Button
                onClick={confirmVisibilityChange}
                size="sm"
                className="text-xs"
              >
                Confirm
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default PollShare;