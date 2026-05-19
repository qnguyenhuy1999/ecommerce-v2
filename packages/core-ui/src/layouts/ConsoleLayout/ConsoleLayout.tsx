import { withDefined } from '@ecom/shared/utils'
import { SidebarInset, SidebarMenuRenderer, SidebarShell } from '../../organisms/Sidebar'
import { cn } from '../../lib/utils'
import type { ConsoleLayoutProps } from './ConsoleLayout.types'
import {
  defaultSidebarAccount,
  defaultUserMenu,
  defaultWorkspaceSwitcher,
} from './ConsoleLayout.utils'
import { ConsoleLayoutProviders } from './ConsoleLayoutProviders.client'
import { ConsoleSidebarHeader } from './ConsoleSidebarHeader'
import { ConsoleTopbar } from './ConsoleTopbar'

export type {
  ConsoleLayoutAccount,
  ConsoleLayoutProps,
  ConsoleLayoutSwitcher,
  ConsoleLayoutUserMenu,
} from './ConsoleLayout.types'

export function ConsoleLayout({
  children,
  sidebarGroups = [],
  sidebarAccount = defaultSidebarAccount,
  workspaceSwitcher = defaultWorkspaceSwitcher,
  searchPlaceholder = 'Search...',
  balanceLabel,
  notificationCount,
  storefrontLabel,
  userMenu = defaultUserMenu,
  contentClassName,
}: ConsoleLayoutProps) {
  return (
    <ConsoleLayoutProviders>
      <SidebarShell
        header={sidebarAccount ? <ConsoleSidebarHeader account={sidebarAccount} /> : undefined}
      >
        <SidebarMenuRenderer groups={sidebarGroups} />
      </SidebarShell>

      <SidebarInset className="bg-muted/40">
        <div className="flex min-h-svh flex-col">
          <ConsoleTopbar
            {...withDefined({
              workspaceSwitcher,
              searchPlaceholder,
              balanceLabel,
              notificationCount,
              storefrontLabel,
              userMenu,
            })}
          />
          <div className={cn('min-w-0 flex-1 p-4 md:p-6', contentClassName)}>{children}</div>
        </div>
      </SidebarInset>
    </ConsoleLayoutProviders>
  )
}

export const Root = Object.assign(ConsoleLayout, {
  Providers: ConsoleLayoutProviders,
  SidebarHeader: ConsoleSidebarHeader,
  Topbar: ConsoleTopbar,
})
