import {
  ConsoleLayout as CoreConsoleLayout,
  Root as CoreRoot,
  type ConsoleLayoutProps,
} from '@ecom/core-ui'
import {
  defaultSidebarAccount,
  defaultSidebarGroups,
  defaultUserMenu,
  defaultWorkspaceSwitcher,
} from './ConsoleLayout.utils'

function ConsoleLayoutBase({
  children,
  sidebarGroups = defaultSidebarGroups,
  sidebarAccount = defaultSidebarAccount,
  workspaceSwitcher = defaultWorkspaceSwitcher,
  searchPlaceholder = 'Search orders, products, buyers...',
  balanceLabel = 'Balance · $4,820',
  notificationCount = 3,
  storefrontLabel = 'Storefront',
  userMenu = defaultUserMenu,
  contentClassName,
}: ConsoleLayoutProps) {
  return (
    <CoreConsoleLayout
      sidebarGroups={sidebarGroups}
      sidebarAccount={sidebarAccount}
      workspaceSwitcher={workspaceSwitcher}
      searchPlaceholder={searchPlaceholder}
      balanceLabel={balanceLabel}
      notificationCount={notificationCount}
      storefrontLabel={storefrontLabel}
      userMenu={userMenu}
      contentClassName={contentClassName}
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
