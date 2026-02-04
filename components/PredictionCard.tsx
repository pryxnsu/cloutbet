'use client';

import React, { useCallback } from 'react';
import { Users, Clock, TrendingUp, TrendingDown, Check } from 'lucide-react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { PredictionCardProps } from '@/types';
import { extractTweetId } from '@/lib/helper';
import TweetCard from './TweetCard';

function formatDate(date: string | Date): string {
  return new Date(date).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
  });
}

function PredictionCard({
  id,
  title,
  avatar,
  name,
  username,
  participants,
  expiry,
  onBet,
  url,
  userBetSide,
}: PredictionCardProps) {
    const handleBetIn = useCallback(() => onBet(id, 'in'), [id, onBet]);
  const handleBetOut = useCallback(() => onBet(id, 'out'), [id, onBet]);
  return (
    <div className="w-full">
      <div className="border-border bg-card flex flex-col space-y-5 rounded-2xl border p-5">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="relative h-10 w-10 overflow-hidden rounded-lg">
              <Image src={avatar} alt={name} fill sizes="40px" className="object-cover" />
            </div>
          </div>
          <div className="flex flex-col">
            <span className="text-foreground max-w-32 truncate text-sm leading-tight font-semibold">{name}</span>
            <span className="text-muted-foreground max-w-32 truncate text-xs font-medium">@{username}</span>
          </div>
        </div>

        <p className="text-md mb-1 wrap-break-word text-black">{title}</p>

        <TweetCard tweetId={extractTweetId(url)} />

        <div className="bg-border h-px" />

        <div className="text-muted-foreground flex items-center justify-between text-xs">
          <div className="flex items-center gap-1.5">
            <Clock className="h-3.5 w-3.5" />
            <span className="font-medium">Expires at: {formatDate(expiry)}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Users className="h-3.5 w-3.5" />
            <span className="font-medium">{participants}</span>
          </div>
        </div>

        <div className="flex gap-3 pt-1">
          {userBetSide ? (
            // User has already bet, show their selection
            <div className="flex w-full items-center justify-center gap-1 rounded-xl bg-zinc-100 py-3 text-sm font-medium text-zinc-600">
              <Check className="h-4 w-4 text-emerald-500" />
              You bet <span className="font-semibold text-zinc-900">{userBetSide === 'in' ? 'In' : 'Out'}</span>
            </div>
          ) : (
            <>
              <Button
                onClick={handleBetIn}
                className="group h-11 flex-1 gap-2 rounded-xl bg-zinc-900 text-sm font-semibold text-white transition-all duration-200 hover:bg-zinc-800 active:scale-[0.98]"
              >
                <TrendingUp className="h-4 w-4 transition-transform duration-200 group-hover:-translate-y-0.5" />
                Bet In
              </Button>
              <Button
                onClick={handleBetOut}
                className="group h-11 flex-1 gap-2 rounded-xl border border-zinc-200 bg-white text-sm font-semibold text-zinc-900 transition-all duration-200 hover:border-zinc-300 hover:bg-zinc-50 active:scale-[0.98]"
              >
                <TrendingDown className="h-4 w-4 transition-transform duration-200 group-hover:translate-y-0.5" />
                Bet Out
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default React.memo(PredictionCard);
