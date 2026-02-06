'use client';

import { AxiosError } from 'axios';
import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { useSession } from 'next-auth/react';
import { api, ApiResponse } from '@/lib/axios';
import Loader from '@/components/Loader';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { MessageSquare, Send, User, Loader2 } from 'lucide-react';
import { formatDate } from '@/lib/helper';

interface FeedbackItem {
  id: string;
  content: string;
  createdAt: string;
  name: string;
  avatar: string;
  username: string;
}

export default function FeedbackPage() {
  const { status } = useSession();
  const [feedback, setFeedback] = useState<FeedbackItem[]>([]);
  const [content, setContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const fetchFeedback = useCallback(async () => {
    try {
      const response = await api.get<ApiResponse<FeedbackItem[]>>('/api/feedback');
      if (response.data.success) {
        setFeedback(response.data.data);
      }
    } catch (err) {
      const message = err instanceof AxiosError ? err.response?.data?.message : 'Failed to fetch feedback';
      toast.error(message ?? 'Failed to fetch feedback');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchFeedback();
  }, [fetchFeedback]);

  const handleSubmit = async (e: React.SubmitEvent) => {
    e.preventDefault();
    if (status !== 'authenticated') {
      toast.error('Please sign in to submit feedback');
      return;
    }
    if (!content.trim()) return;

    setIsSubmitting(true);
    try {
      const res = await api.post<ApiResponse<FeedbackItem>>('/api/feedback', { content });
      if (res.data.success) {
        toast.success('Feedback submitted!');
        setContent('');
      }
    } catch (error) {
      const message = error instanceof AxiosError ? error.response?.data?.message : 'Failed to submit feedback';
      toast.error(message ?? 'Failed to submit feedback');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex h-full flex-col bg-white dark:bg-zinc-950">
      <div className="mx-auto w-full max-w-3xl px-6 py-10">
        <header className="mb-12">
          <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">Feedback</h1>
          <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">
            Help us improve CloutBet. Suggest new features or report issues.
          </p>
        </header>

        <section className="mb-16">
          <div className="rounded-2xl border border-zinc-100 bg-zinc-50/50 p-6 dark:border-zinc-800/50 dark:bg-zinc-900/50">
            <h3 className="mb-4 text-sm font-semibold text-zinc-900 dark:text-zinc-100">Leave your thoughts</h3>
            {status === 'authenticated' ? (
              <form onSubmit={handleSubmit} className="space-y-4">
                <Textarea
                  placeholder="What's on your mind?"
                  value={content}
                  onChange={e => setContent(e.target.value)}
                  className="min-h-30 resize-none border-zinc-200 bg-white text-sm focus-visible:ring-zinc-200 dark:border-zinc-800 dark:bg-zinc-950 dark:focus-visible:ring-zinc-800"
                  required
                />
                <div className="flex justify-end">
                  <Button type="submit" disabled={isSubmitting || !content.trim()} size="sm" className="gap-2 px-5">
                    {isSubmitting ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <>
                        <Send className="h-4 w-4" />
                        Submit
                      </>
                    )}
                  </Button>
                </div>
              </form>
            ) : (
              <div className="flex flex-col items-center justify-center py-6 text-center">
                <p className="mb-4 text-sm text-zinc-500 dark:text-zinc-400">Please sign in to share your feedback.</p>
                <Button variant="outline" size="sm" asChild>
                  <a href="/login">Sign In</a>
                </Button>
              </div>
            )}
          </div>
        </section>

        <section className="space-y-4">
          <div className="flex items-center justify-between border-b border-zinc-100 pb-4 dark:border-zinc-800">
            <h2 className="flex items-center gap-2 text-lg font-bold text-zinc-900 dark:text-zinc-100">
              <MessageSquare className="h-5 w-5 text-zinc-400" />
              Recent Feedback
            </h2>
          </div>

          {isLoading ? (
            <div className="flex justify-center py-20">
              <Loader />
            </div>
          ) : feedback.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center text-zinc-400">
              <MessageSquare className="mb-4 h-12 w-12 opacity-10" />
              <p className="text-sm">No feedback yet. Be the first!</p>
            </div>
          ) : (
            <div className="divide-y divide-zinc-100 dark:divide-zinc-800/50">
              {feedback.map(f => (
                <Feedback key={f.id} {...f} />
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

function Feedback({
  content,
  createdAt,
  name,
  username,
  avatar,
}: {
  content: string;
  createdAt: string;
  name: string;
  username: string;
  avatar: string;
}) {
  return (
    <div className="py-6">
      <div className="flex gap-3">
        <div className="h-9 w-9 shrink-0 overflow-hidden rounded-full bg-zinc-100 dark:bg-zinc-800">
          {avatar ? (
            <Image src={avatar} alt={name} width={36} height={36} className="h-full w-full object-cover" />
          ) : (
            <div className="flex h-full w-full items-center justify-center">
              <User className="h-4 w-4 text-zinc-400" />
            </div>
          )}
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-baseline gap-1.5">
            <span className="text-[13px] font-semibold text-zinc-900 dark:text-zinc-100">{name}</span>
            <span className="text-xs text-zinc-400">@{username}</span>
            <span className="text-xs text-zinc-300 dark:text-zinc-700">·</span>
            <span className="text-xs text-zinc-400">{formatDate(createdAt)}</span>
          </div>
          <p className="mt-1.5 text-[13px] leading-relaxed text-zinc-600 dark:text-zinc-400">{content}</p>
        </div>
      </div>
    </div>
  );
}
