'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase';
import PollPreviewAll from '@/components/pollsAll/pollsPreview/PollPreviewAll';
import PollPreviewTwo from '@/components/pollsAll/pollsPreview/PollPreviewTwo';
import { HydrationProvider } from '@/components/HydrationProvider';
import Link from 'next/link';

interface Poll {
  id: string;
  title: string;
  description?: string;
  poll_image_url?: string;
  visibility?: 'public' | 'private';
  is_published?: boolean;
  share_without_image?: boolean;
  share_without_options?: boolean;
  allow_multiple?: boolean;
  user_id?: string;
  options?: Array<{
    id: string;
    text: string;
    image_url?: string;
  }>;
}

export default function PublicPollPage() {
  const params = useParams();
  const pollId = params.pollId as string;
  const [poll, setPoll] = useState<Poll | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showBanner, setShowBanner] = useState(true);

  useEffect(() => {
    const fetchPoll = async () => {
      try {
        setIsLoading(true);
        const supabase = createClient();

        // Get current user
        const { data: { user } } = await supabase.auth.getUser();

        // Fetch poll data
        const { data: pollData, error: pollError } = await supabase
          .from('polls')
          .select('*')
          .eq('id', pollId)
          .single();

        if (pollError || !pollData) {
          setError('Poll not found');
          return;
        }

        // Check if poll is accessible
        const visibility = pollData.visibility || 'public'; // Default to public if null
        const isPrivate = visibility === 'private';
        const isOwner = user?.id === pollData.user_id;
        const isPublished = pollData.is_published !== false; // Default to true if not set

        // Access control: 
        // - Public polls must be published
        // - Private polls: only owner can access (published status doesn't matter for owner)
        if (isPrivate) {
          // Private poll: only owner can access
          if (!isOwner) {
            setError('This poll is private and not accessible');
            return;
          }
          if (!isPublished) {
            setError('Poll not found or is not published');
            return;
          }
        } else {
          // Public poll: must be published (or if is_published is not set, allow it)
          if (pollData.is_published === false) {
            setError('Poll not found or is not published');
            return;
          }
        }

        // Fetch poll options
        const { data: optionsData, error: optionsError } = await supabase
          .from('poll_options')
          .select('*')
          .eq('poll_id', pollId)
          .order('order', { ascending: true });

        if (optionsError) {
          console.error('Error fetching options:', optionsError);
        }

        setPoll({
          ...pollData,
          options: optionsData || [],
        });
      } catch (err) {
        console.error('Error fetching poll:', err);
        setError('Failed to load poll');
      } finally {
        setIsLoading(false);
      }
    };

    fetchPoll();
  }, [pollId]);

  if (isLoading) {
    return (
      <HydrationProvider>
        <div className="min-h-screen bg-white dark:bg-slate-950 flex items-center justify-center">
          <div className="text-center">
            <div className="w-8 h-8 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-2"></div>
            <p className="text-sm text-slate-600 dark:text-slate-400">Loading poll...</p>
          </div>
        </div>
      </HydrationProvider>
    );
  }

  if (error || !poll) {
    return (
      <HydrationProvider>
        <div className="min-h-screen bg-white dark:bg-slate-950 flex items-center justify-center p-4">
          <div className="text-center max-w-md">
            <div className="mb-4">
              <svg
                className="w-16 h-16 mx-auto text-red-500/60"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4v2m0 4v2M9 3h6m0 0a9 9 0 019 9v6a9 9 0 01-9 9H9a9 9 0 01-9-9v-6a9 9 0 019-9z"
                />
              </svg>
            </div>
            <h1 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
              Poll Not Found
            </h1>
            <p className="text-slate-600 dark:text-slate-400">
              {error || 'This poll does not exist or is not publicly available.'}
            </p>
          </div>
        </div>
      </HydrationProvider>
    );
  }

  return (
    <HydrationProvider>
      <div className="min-h-screen bg-white dark:bg-slate-950">
        {/* Notification Banner */}
        {showBanner && (
          <div className="bg-amber-100 dark:bg-amber-900 border-b border-amber-200 dark:border-amber-800 px-4 py-1.5">
            <div className="max-w-2xl mx-auto flex items-center justify-center gap-1">
              <Link
                href="/"
                className="flex items-center gap-1.5 text-amber-900 dark:text-amber-100 hover:opacity-80 transition-opacity"
              >
                <span className="text-sm">🎉</span>
                <span className="text-xs font-medium">
                  This survey was created using Pollify.com
                </span>
              </Link>
              <button
                onClick={() => setShowBanner(false)}
                className="text-amber-900 dark:text-amber-100 hover:opacity-60 transition-opacity flex-shrink-0 ml-auto"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
        )}

        <div className="max-w-2xl mx-auto p-4">
          {poll.share_without_options ? (
            <PollPreviewTwo
              pollId={pollId}
              userId="" // No user ID for guest voting
              title={poll.title}
              description={poll.description}
              bannerImage={poll.poll_image_url}
              previewMode="pc"
            />
          ) : (
            <PollPreviewAll
              pollId={pollId}
              userId="" // No user ID for guest voting
              title={poll.title}
              description={poll.description}
              bannerImage={poll.poll_image_url}
              options={poll.options?.map((opt) => ({
                id: opt.id,
                title: opt.text,
                image: opt.image_url || '',
                description: undefined,
              }))}
              showImages={true}
              share_without_image={poll.share_without_image}
              allow_multiple={poll.allow_multiple}
              previewMode="pc"
            />
          )}
        </div>
      </div>
    </HydrationProvider>
  );
}
