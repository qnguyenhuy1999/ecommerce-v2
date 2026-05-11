'use client'

import { usePathname } from 'next/navigation'
import Link from 'next/link'
import {
  SidebarShell,
  SidebarMenuRenderer,
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from '@ecom/core-ui'
import type { SidebarGroup } from '@ecom/core-ui'
import { Store, LogOut, ChevronRight } from 'lucide-react'
import { sidebarGroups } from './sidebar-config'
import { useAdminProfile, useLogout } from '@/features/auth/hooks/use-auth'

export function AdminSidebar({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const { data: profile } = useAdminProfile()
  const logout = useLogout()

  const groupsWithActive: SidebarGroup[] = sidebarGroups.map((group) => ({
    ...group,
    items: group.items.map((item) => ({
      ...item,
      isActive:
        item.href === '/' ? pathname === '/' : !!item.href && pathname.startsWith(item.href),
    })),
  }))

  return (
    <SidebarProvider>
      <SidebarShell
        header={
          <Link href="/" className="flex items-center gap-2 px-2 py-1">
            <div className="bg-primary text-primary-foreground flex size-8 items-center justify-center rounded-lg">
              <Store className="size-4" />
            </div>
            <div className="flex flex-col leading-none">
              <span className="text-sm font-semibold">Admin Panel</span>
              <span className="text-muted-foreground text-xs">Marketplace</span>
            </div>
          </Link>
        }
        footer={
          <button
            onClick={() => logout.mutate()}
            className="text-muted-foreground hover:bg-accent hover:text-foreground flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-sm"
          >
            <LogOut className="size-4" />
            <span>Sign out</span>
          </button>
        }
      >
        <SidebarMenuRenderer groups={groupsWithActive} />
      </SidebarShell>

      <SidebarInset>
        <header className="flex h-14 items-center gap-2 border-b px-4">
          <SidebarTrigger className="-ml-1" />
          <div className="text-muted-foreground flex items-center gap-1 text-sm">
            <ChevronRight className="size-3" />
            <span className="text-foreground font-medium">{getCurrentPageTitle(pathname)}</span>
          </div>
          <div className="ml-auto flex items-center gap-2">
            {profile && (
              <span className="text-muted-foreground text-sm">
                {profile.firstName} {profile.lastName}
              </span>
            )}
          </div>
        </header>
        <main className="flex-1 overflow-auto p-4 md:p-6">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  )
}

function getCurrentPageTitle(pathname: string): string {
  const flat = sidebarGroups.flatMap((g) => g.items)
  if (pathname === '/') return 'Dashboard'
  const match = flat.find(
    (item) => item.href && item.href !== '/' && pathname.startsWith(item.href),
  )
  return match?.label ?? 'Admin'
}
