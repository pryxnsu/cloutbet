'use client';

import { SessionProvider } from 'next-auth/react';
import Sidebar from '@/components/Sidebar';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';

export default function MarketLayout({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <SidebarProvider className="bg-sidebar">
        <Sidebar />
        <main className="my-1.5 w-full rounded-2xl bg-white px-2 shadow-xs lg:w-1/2">
          <SidebarTrigger />
          <div className="mt-2">{children}</div>
        </main>
      </SidebarProvider>
    </SessionProvider>
  );
}
