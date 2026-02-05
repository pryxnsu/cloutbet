import Link from 'next/link';
import { TrendingUp, Github } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function Navbar() {
  return (
    <div className="fixed top-4 left-1/2 z-50 w-full max-w-4xl -translate-x-1/2 px-4 md:top-6 md:px-6">
      <nav className="flex h-14 items-center justify-between rounded-xl bg-white/80 px-3 shadow-[0_8px_30px_rgb(0,0,0,0.08)] backdrop-blur-sm md:h-16 md:px-4">
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-black shadow-lg transition-transform hover:rotate-12 md:h-9 md:w-9">
            <TrendingUp className="h-4 w-4 text-white md:h-5 md:w-5" />
          </div>
          <span className="text-base font-bold tracking-tight text-black md:text-lg">CloutBet</span>
        </Link>

        <div className="flex items-center gap-2 md:gap-3">
          <Link href="https://github.com/pryxnsu/cloutbet" target="_blank">
            <Button variant="outline" size="icon" className="flex h-9 w-9 md:hidden">
              <Github className="h-4 w-4" />
            </Button>
          </Link>

          <Link
            href="/login"
            className="rounded-lg bg-black px-3 py-2 text-xs font-medium text-white shadow-lg transition-all hover:bg-[#0F1419]/90 active:scale-95 md:px-4 md:py-2.5 md:text-sm"
          >
            Get started
          </Link>
        </div>
      </nav>
    </div>
  );
}
