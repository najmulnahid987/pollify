'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Copy, Download, Globe, Lock, QrCode, Share2 } from 'lucide-react';
import { QRCodeCanvas } from 'qrcode.react';
import { createClient } from '@/lib/supabase';

interface PollShareProps {
  pollId: string;
  userId: string;
}

function PollShare({ pollId, userId }: PollShareProps) {
  const [visibility, setVisibility] = useState<'public' | 'private'>('public');
  const [copied, setCopied] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [pendingVisibility, setPendingVisibility] = useState<'public' | 'private' | null>(null);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const qrRef = useRef<HTMLDivElement>(null);
  
  // Determine the base URL (localhost for dev, production domain for prod)
  const getBaseUrl = () => {
    if (typeof window === 'undefined') {
      return 'https://pollify.app';
    }
    const hostname = window.location.hostname;
    if (hostname === 'localhost' || hostname === '127.0.0.1') {
      return `http://${hostname}:3000`;
    }
    return 'https://pollify.app';
  };

  const pollLink = `${getBaseUrl()}/p/${pollId}`;

  // Fetch current poll visibility on mount
  useEffect(() => {
    const fetchPollVisibility = async () => {
      try {
        setIsLoading(true);
        const supabase = createClient();
        
        const { data, error: fetchError } = await supabase
          .from('polls')
          .select('visibility')
          .eq('id', pollId)
          .single();

        if (fetchError) {
          console.error('Error fetching poll visibility:', fetchError);
          setError('Failed to load poll settings');
          return;
        }

        setVisibility(data?.visibility || 'public');
      } catch (err) {
        console.error('Error:', err);
        setError('Failed to load poll settings');
      } finally {
        setIsLoading(false);
      }
    };

    fetchPollVisibility();
  }, [pollId]);

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

  const handleDownloadQR = async () => {
    if (!qrRef.current) return;

    try {
      const canvas = qrRef.current.querySelector('canvas') as HTMLCanvasElement;
      if (!canvas) {
        setError('Failed to generate QR code image');
        return;
      }

      canvas.toBlob((blob) => {
        if (!blob) {
          setError('Failed to create QR code blob');
          return;
        }

        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `poll-${pollId}-qr.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
      });
    } catch (err) {
      console.error('Error downloading QR code:', err);
      setError('Failed to download QR code');
    }
  };

  const handleVisibilityChange = async (newVisibility: 'public' | 'private') => {
    if (newVisibility === visibility) return;
    
    // Show confirmation dialog
    setPendingVisibility(newVisibility);
    setShowConfirmation(true);
  };

  const confirmVisibilityChange = async () => {
    if (!pendingVisibility) return;

    // Validate pollId before proceeding
    if (!pollId || pollId.trim() === '') {
      setError('Poll ID is missing. Please refresh the page.');
      setPendingVisibility(null);
      return;
    }

    try {
      setError(null);
      setShowConfirmation(false);

      // Optimistic update
      setVisibility(pendingVisibility);

      // Use Supabase client directly instead of API endpoint
      const supabase = createClient();
      
      const { error: updateError } = await supabase
        .from('polls')
        .update({ visibility: pendingVisibility })
        .eq('id', pollId)
        .select();

      if (updateError) {
        throw new Error(updateError.message || 'Failed to update visibility');
      }

      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
      setPendingVisibility(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update visibility');
      // Revert optimistic update
      setVisibility(visibility === 'public' ? 'private' : 'public');
      setPendingVisibility(null);
    }
  };

  const cancelVisibilityChange = () => {
    setShowConfirmation(false);
    setPendingVisibility(null);
  };

  // Guard: Don't render if pollId is missing
  if (!pollId || pollId.trim() === '') {
    return (
      <div className="bg-white dark:bg-slate-950 flex flex-col font-display antialiased text-slate-900 dark:text-slate-100 p-3 sm:p-4">
        <div className="w-full">
          <p className="text-xs sm:text-sm text-red-500">
            Error: Poll ID is missing. Please refresh the page.
          </p>
        </div>
      </div>
    );
  }

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
              <div className="p-2 bg-white dark:bg-slate-800 rounded border border-slate-200 dark:border-slate-700" ref={qrRef}>
                <QRCodeCanvas
                  value={pollLink}
                  size={160}
                  level="H"
                  includeMargin={true}
                />
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
      {showConfirmation && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-slate-900 rounded-lg shadow-lg max-w-sm w-full p-6">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
              Change Poll Visibility?
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-300 mb-4">
              {pendingVisibility === 'public'
                ? 'Make this poll PUBLIC? Anyone will be able to find and respond to it.'
                : 'Make this poll PRIVATE? Only people with the link and you can access it.'}
            </p>
            <div className="flex gap-3 justify-end">
              <Button
                onClick={cancelVisibilityChange}
                variant="outline"
                className="text-xs h-8"
              >
                Cancel
              </Button>
              <Button
                onClick={confirmVisibilityChange}
                className="text-xs h-8"
              >
                Yes, Change to {pendingVisibility === 'public' ? 'PUBLIC' : 'PRIVATE'}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Error/Success Messages */}
      {error && (
        <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg dark:bg-red-950 dark:border-red-800">
          <p className="text-xs text-red-600 dark:text-red-400">✗ {error}</p>
        </div>
      )}
      {showSuccess && (
        <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg dark:bg-green-950 dark:border-green-800">
          <p className="text-xs text-green-600 dark:text-green-400">
            ✓ Poll is now {visibility === 'public' ? 'PUBLIC' : 'PRIVATE'}!
          </p>
        </div>
      )}
    </div>
  );
}

export default PollShare;