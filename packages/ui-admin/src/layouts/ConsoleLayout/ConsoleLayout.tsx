import {
  ConsoleLayout as CoreConsoleLayout,
  Root as CoreRoot,
  type ConsoleLayoutProps,
  type SidebarGroup,
} from '@ecom/core-ui'
import {
  defaultSidebarAccount,
  defaultSidebarGroups,
  defaultUserMenu,
  defaultWorkspaceSwitcher,
} from './ConsoleLayout.utils'

export interface AdminConsoleLayoutProps extends Omit<ConsoleLayoutProps, 'sidebarGroups'> {
  sidebarGroups?: SidebarGroup[]
}

function ConsoleLayoutBase({
  children,
  sidebarGroups = defaultSidebarGroups,
  sidebarAccount = defaultSidebarAccount,
  workspaceSwitcher = defaultWorkspaceSwitcher,
  searchPlaceholder = 'Search users, sellers, orders, disputes...',
  notificationCount = 1,
  storefrontLabel = 'Preview',
  userMenu = defaultUserMenu,
  contentClassName,
}: AdminConsoleLayoutProps) {
  const contentProps = contentClassName ? { contentClassName } : {}

  return (
    <CoreConsoleLayout
      sidebarGroups={sidebarGroups}
      sidebarAccount={sidebarAccount}
      workspaceSwitcher={workspaceSwitcher}
      searchPlaceholder={searchPlaceholder}
      notificationCount={notificationCount}
      storefrontLabel={storefrontLabel}
      userMenu={userMenu}
      {...contentProps}
    >
      {children}
    </CoreConsoleLayout>
  )
}

type ConsoleLayoutComponent = typeof ConsoleLayoutBase & {
  Root: typeof CoreRoot
}

export const ConsoleLayout: ConsoleLayoutComponent = Object.assign(ConsoleLayoutBase, {
  Root: CoreRoot,
})

export const Root: typeof CoreRoot = CoreRoot
