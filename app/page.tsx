'use client';

import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Navbar from '@/components/Navbar';

export default function Home() {
  return (
    <div className="from-background to-secondary text-foreground relative min-h-screen bg-linear-to-b">
      <Navbar />

      <main className="relative z-10">
        <section className="relative flex min-h-[90vh] flex-col items-center justify-center overflow-hidden px-4 pt-32 pb-16 md:px-6 md:pt-40 lg:pt-44">
          <div className="absolute inset-0 -z-10 overflow-hidden">
            <div className="bg-primary/10 absolute top-0 left-1/4 h-96 w-96 rounded-full blur-3xl"></div>
            <div className="bg-accent/10 absolute right-1/4 bottom-0 h-96 w-96 rounded-full blur-3xl"></div>
          </div>

          <div className="relative mx-auto max-w-5xl text-center">
            <div className="bg-secondary border-border/40 mb-6 inline-flex items-center gap-2 rounded-full border px-4 py-2">
              <span className="text-muted-foreground text-xs">Predict tweets before they go viral</span>
              <ArrowRight className="text-muted-foreground h-3 w-3" />
            </div>

            <h1 className="mb-6 text-4xl leading-tight font-bold tracking-tight text-balance md:text-6xl lg:text-7xl">
              <span className="text-primary">Predict</span> Tech Twitter Post Performance
            </h1>

            <p className="text-muted-foreground mx-auto mb-10 max-w-2xl px-4 text-base leading-relaxed md:px-0 md:text-xl">
              Make your call on which posts will hit, before the numbers settle.
            </p>

            <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link href="/feed">
                <Button size="lg" className="group gap-2">
                  Start Predicting
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>
              <Link href="https://github.com/pryxnsu/cloutbet" target="_blank">
                <Button size="lg" variant="outline">
                  View on GitHub
                </Button>
              </Link>
            </div>
          </div>
        </section>

        <footer className="border-border/40 relative border-t px-4 py-12 md:px-6 md:py-16">
          <div className="mx-auto max-w-6xl">
            <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
              <p className="text-muted-foreground text-sm">© 2026 CloutBet. All rights reserved.</p>
              <p className="text-muted-foreground text-sm">
                Built by{' '}
                <Link href="https://github.com/pryxnsu" target="_blank" className="text-primary hover:underline">
                  Priyanshu
                </Link>
              </p>
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
}
