import { SidebarInset, SidebarMenuRenderer, SidebarShell } from '../../organisms/Sidebar'
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
}: ConsoleLayoutProps) {
  return (
    <ConsoleLayoutProviders>
      <SidebarShell
        header={sidebarAccount ? <ConsoleSidebarHeader account={sidebarAccount} /> : undefined}
      >
        <SidebarMenuRenderer groups={sidebarGroups} />
      </SidebarShell>

      <SidebarInset className="bg-background">
        <div className="flex min-h-svh flex-col">
          <ConsoleTopbar
            workspaceSwitcher={workspaceSwitcher}
            searchPlaceholder={searchPlaceholder}
            balanceLabel={balanceLabel}
            notificationCount={notificationCount}
            storefrontLabel={storefrontLabel}
            userMenu={userMenu}
          />
          <div className="min-w-0 p-4 md:p-6">{children}</div>
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
