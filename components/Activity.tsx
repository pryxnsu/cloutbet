'use client';

import { useSession } from 'next-auth/react';
import { TrendingUp, TrendingDown, Clock, ExternalLink } from 'lucide-react';
import Link from 'next/link';
import Loader from './Loader';
import ErrorUI from '@/components/ErrorUI';
import { memo, useCallback, useEffect, useState } from 'react';
import { api } from '@/lib/axios';
import { AxiosError } from 'axios';

type ActivityType = 'in' | 'out';

interface ActivityItem {
  betId: string;
  side: ActivityType;
  title: string;
  timestamp: Date;
}

function formatTimeAgo(date: Date): string {
  date = new Date(date);
  const seconds = Math.floor((Date.now() - date.getTime()) / 1000);

  if (seconds < 60) return 'just now';
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
  return `${Math.floor(seconds / 86400)}d ago`;
}

function getActivityIcon(type: ActivityType) {
  switch (type) {
    case 'in':
      return <TrendingUp className="h-4 w-4 text-emerald-500" />;
    case 'out':
      return <TrendingDown className="h-4 w-4 text-rose-500" />;
  }
}

function getActivityLabel(type: ActivityType) {
  switch (type) {
    case 'in':
      return <span className="font-medium text-emerald-600">Bet In</span>;
    case 'out':
      return <span className="font-medium text-rose-600">Bet Out</span>;
  }
}

const ActivityCard = memo(function ActivityCard({ activity }: { activity: ActivityItem }) {
  return (
    <div className="group flex items-start gap-3 rounded-xl py-3">
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-zinc-100">
        {getActivityIcon(activity.side)}
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2 text-xs">
          {getActivityLabel(activity.side)}
          <span className="text-zinc-400">•</span>
          <span className="text-zinc-400">{formatTimeAgo(activity?.timestamp)}</span>
        </div>
        <p className="mt-0.5 truncate text-sm text-zinc-700">{activity.title}</p>
      </div>
    </div>
  );
});

export default function Activity() {
  const { status } = useSession();

  const [activities, setActivities] = useState<ActivityItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    if (status !== 'authenticated') return;
    setIsLoading(true);
    setError(null);
    try {
      const response = await api.get('/api/activities');
      setActivities(response.data?.data ?? []);
    } catch (error) {
      const message =
        error instanceof AxiosError
          ? (error.response?.data?.message ?? 'Failed to fetch activities')
          : 'An unexpected error occurred';
      setError(message);
    } finally {
      setIsLoading(false);
    }
  }, [status]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const renderContent = () => {
    if (status === 'loading' || (status === 'authenticated' && isLoading && activities.length === 0)) {
      return <Loader />;
    }

    if (status === 'unauthenticated') {
      return (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <div className="mb-3 rounded-full bg-zinc-100 p-3">
            <Clock className="h-5 w-5 text-zinc-400" />
          </div>
          <Link href="/login" className="text-sm font-medium text-zinc-600">
            Sign in to see your activity
          </Link>
          <p className="mt-1 text-xs text-zinc-400">Track your bets and predictions</p>
        </div>
      );
    }

    if (error) {
      return <ErrorUI error={error} refresh={fetchData} />;
    }

    if (activities.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <div className="mb-3 rounded-full bg-zinc-100 p-3">
            <Clock className="h-5 w-5 text-zinc-400" />
          </div>
          <p className="text-sm font-medium text-zinc-600">No activity yet</p>
          <p className="mt-1 text-xs text-zinc-400">Start betting on predictions!</p>
        </div>
      );
    }

    return activities.map(activity => <ActivityCard key={activity.betId} activity={activity} />);
  };

  return (
    <div className="flex h-full flex-col px-5 py-4">
      <div className="mb-4">
        <h2 className="text-lg font-semibold text-zinc-900">Recent Activity</h2>
        <p className="text-xs text-zinc-500">Your latest bets</p>
      </div>

      <div className="flex-1 space-y-1 overflow-auto">{renderContent()}</div>

      <div className="mt-auto border-t border-zinc-100 pt-4">
        <Link
          href="https://x.com/pryxnsu"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-1.5 text-xs text-zinc-400 transition-colors hover:text-zinc-600"
        >
          Made by @Priyanshu
          <ExternalLink className="h-3 w-3" />
        </Link>
      </div>
    </div>
  );
}
