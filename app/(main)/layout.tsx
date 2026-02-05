'use client';

import { SessionProvider } from 'next-auth/react';
import Activity from '@/components/Activity';
import Sidebar from '@/components/Sidebar';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { Separator } from '@/components/ui/separator';

export default function MarketLayout({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <SidebarProvider className="bg-sidebar">
        <Sidebar />
        <main className="flex min-h-[calc(100vh-12px)] flex-1 bg-white lg:mr-[31%]">
          <div className="mt-2 w-full">
            <SidebarTrigger />
            <Separator className="mt-2" />
            {children}
          </div>
        </main>
        <aside className="fixed top-0 right-0 z-40 hidden h-screen w-[31%] overflow-auto border-l bg-white lg:block">
          <Activity />
        </aside>
      </SidebarProvider>
    </SessionProvider>
  );
}
