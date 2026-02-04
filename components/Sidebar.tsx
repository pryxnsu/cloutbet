'use client';

import { cn } from '@/lib/utils';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { Settings, MessageSquare, User as UserIcon, Trophy, Zap } from 'lucide-react';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from '@/components/ui/sidebar';
import { useSession } from 'next-auth/react';

const mainItems = [
  {
    title: 'Feed',
    url: '/feed',
    icon: Zap,
  },
  {
    title: 'Leaderboard',
    url: '/leaderboard',
    icon: Trophy,
  },
];

const footerItems = [
  {
    title: 'Feedback',
    url: '/feedback',
    icon: MessageSquare,
  },
  {
    title: 'Settings',
    url: '/settings',
    icon: Settings,
  },
];

export default function AppSidebar() {
  const pathname = usePathname();
  const { state } = useSidebar();

  const { data: session, status } = useSession();

  if (status === 'unauthenticated') {
    return null;
  }

  if (!session?.user) {
    return null;
  }
  return (
    <Sidebar collapsible="icon" className="border-none">
      <SidebarHeader className="px-4 pt-6">
        {state === 'expanded' ? (
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex size-8 items-center justify-center overflow-hidden rounded-md border">
                  {session?.user?.avatar ? (
                    <Image
                      src={session.user.avatar}
                      alt={session.user.name || 'User avatar'}
                      className="h-full w-full object-fill"
                      width={24}
                      height={24}
                    />
                  ) : (
                    <UserIcon className="size-6 text-zinc-400" />
                  )}
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-1">
              <span className="text-sm font-semibold text-zinc-900">{session?.user?.name}</span>
              <span className="truncate text-xs text-zinc-500">@{session?.user?.username}</span>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-4 py-2">
            <div className="flex size-8 items-center justify-center overflow-hidden rounded-lg border">
              <UserIcon className="size-5 text-black" />
            </div>
          </div>
        )}
      </SidebarHeader>
      <SidebarContent className="mt-4 px-2">
        <SidebarGroup className={cn('p-0', state === 'expanded' ? 'p-2' : 'p-0')}>
          <SidebarGroupLabel className="mb-2 px-4 text-sm font-medium text-zinc-400">Main</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="gap-2">
              {mainItems.map(item => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    isActive={pathname === item.url}
                    tooltip={item.title}
                    className={cn(
                      'h-11 px-4 transition-colors',
                      state === 'expanded' ? 'rounded-lg' : 'rounded-sm',
                      pathname.includes(item.url)
                        ? 'bg-zinc-100 text-zinc-900'
                        : 'text-zinc-500 hover:bg-zinc-100 hover:text-zinc-900'
                    )}
                  >
                    <Link href={item.url} className="flex items-center gap-3">
                      <item.icon className={cn('size-5 text-black')} />
                      <span className="text-sm text-black">{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-none px-2 pt-0 pb-6">
        <SidebarMenu className="gap-1">
          {footerItems.map(item => (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton
                asChild
                isActive={pathname === item.url}
                tooltip={item.title}
                className={cn(
                  'h-11 px-4 transition-colors',
                  state === 'expanded' ? 'rounded-lg' : 'rounded-sm',
                  pathname.includes(item.url)
                    ? 'bg-zinc-100 text-zinc-900'
                    : 'text-zinc-500 hover:bg-zinc-100 hover:text-zinc-900'
                )}
              >
                <Link href={item.url} className="flex items-center gap-3">
                  <item.icon className="size-5 text-black" />
                  <span className="text-sm text-black">{item.title}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
