'use client';

import { Button } from '@/components/ui/button';
import { signIn } from 'next-auth/react';

export default function Page() {
  return (
    <div className="bg-background relative flex min-h-screen w-full items-center justify-center">
      <div className="absolute inset-0 overflow-hidden">
        <div className="from-muted-foreground/20 absolute top-0 right-0 h-px w-px bg-linear-to-br to-transparent opacity-40" />
      </div>

      <div className="relative z-10 flex w-full max-w-sm flex-col items-center justify-center px-6 sm:px-0">
        <div className="mb-6 text-center">
          <h1 className="text-foreground text-3xl font-bold tracking-tight text-balance md:text-5xl">
            Login to CloutBet
          </h1>
        </div>

        <Button
          onClick={() => signIn('twitter', { callbackUrl: '/feed' })}
          className="group h-12 w-full cursor-pointer bg-transparent px-6 text-base font-medium transition-all duration-200"
          variant="outline"
        >
          <div className="flex items-center justify-center gap-2.5">
            <span>Continue with</span>
            <svg viewBox="0 0 24 24" className="h-5 w-5 fill-current" aria-hidden="true">
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
            </svg>
          </div>
        </Button>

        <p className="text-muted-foreground mt-8 text-center text-sm">
          By signing in, you agree to our{' '}
          <button className="hover:text-foreground underline transition-colors">Terms of Service</button>
        </p>
      </div>
    </div>
  );
}
