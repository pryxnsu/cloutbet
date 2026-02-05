'use client';

import React, { useCallback } from 'react';
import { Users, Clock, TrendingUp, TrendingDown, Check } from 'lucide-react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { PredictionCardProps } from '@/types';
import { extractTweetId } from '@/lib/helper';
import TweetCard from './TweetCard';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

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
      <div className="bg-card flex flex-col space-y-5 p-5">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-full">
              <Image src={avatar} alt={name} fill sizes="40px" className="object-cover" />
            </div>
            <div className="flex flex-col">
              <span className="text-foreground max-w-32 truncate text-sm leading-tight font-semibold">{name}</span>
              <span className="text-muted-foreground max-w-32 truncate text-xs">@{username}</span>
            </div>
          </div>

          <div className="flex items-center gap-4 text-xs text-zinc-500">
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="flex cursor-help items-center gap-1.5">
                  <Clock className="h-3.5 w-3.5" />
                  <span>{formatDate(expiry)}</span>
                </div>
              </TooltipTrigger>
              <TooltipContent>Prediction expires at this time</TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="flex cursor-help items-center gap-1.5">
                  <Users className="h-3.5 w-3.5" />
                  <span>{participants}</span>
                </div>
              </TooltipTrigger>
              <TooltipContent>Number of predictions</TooltipContent>
            </Tooltip>
          </div>
        </div>

        <p className="mb-0 text-base leading-snug wrap-break-word text-zinc-900">{title}</p>

        <TweetCard tweetId={extractTweetId(url)} />

        <div className="flex gap-3">
          {userBetSide ? (
            <div
              className={`flex w-full items-center justify-center gap-2 rounded-lg py-2.5 text-sm font-medium ${
                userBetSide === 'in' ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'
              }`}
            >
              <Check className="h-4 w-4" />
              You predicted <span className="font-semibold">{userBetSide === 'in' ? 'Will Hit' : 'Will Flop'}</span>
            </div>
          ) : (
            <>
              <Button
                onClick={handleBetIn}
                className="group h-10 flex-1 gap-2 rounded-lg bg-emerald-600 text-sm font-medium text-white transition-all duration-200 hover:bg-emerald-700 active:scale-[0.98]"
              >
                <TrendingUp className="h-4 w-4 transition-transform duration-200 group-hover:-translate-y-0.5" />
                Will Hit
              </Button>
              <Button
                onClick={handleBetOut}
                className="group h-10 flex-1 gap-2 rounded-lg border border-rose-200 bg-white text-sm font-medium text-rose-600 transition-all duration-200 hover:border-rose-300 hover:bg-rose-50 active:scale-[0.98]"
              >
                <TrendingDown className="h-4 w-4 transition-transform duration-200 group-hover:translate-y-0.5" />
                Will Flop
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default React.memo(PredictionCard);
