import { withDefined } from '@ecom/shared/utils'
import type { ConsoleLayoutSwitcher, ConsoleLayoutUserMenu } from './ConsoleLayout.types'
import { ConsoleSidebarTrigger } from './ConsoleSidebarTrigger.client'
import { ConsoleWorkspaceSwitcher } from './ConsoleWorkspaceSwitcher.client'
import { ConsoleSearch } from './ConsoleSearch'
import { ConsoleHelpButton } from './ConsoleHelpButton'
import { ConsoleNotificationButton } from './ConsoleNotificationButton'
import { ConsoleStorefrontButton } from './ConsoleStorefrontButton'
import { ConsoleUserMenu } from './ConsoleUserMenu.client'

interface ConsoleTopbarProps {
  workspaceSwitcher?: ConsoleLayoutSwitcher
  searchPlaceholder?: string
  balanceLabel?: string
  notificationCount?: number
  storefrontLabel?: string
  userMenu?: ConsoleLayoutUserMenu
}

export function ConsoleTopbar({
  workspaceSwitcher,
  searchPlaceholder,
  balanceLabel,
  notificationCount,
  storefrontLabel,
  userMenu,
}: ConsoleTopbarProps) {
  return (
    <header className="bg-background border-border flex min-h-16 shrink-0 items-center gap-3 border-b px-4 md:px-6">
      <div className="flex items-center gap-2 md:gap-3">
        <ConsoleSidebarTrigger />
        {workspaceSwitcher ? <ConsoleWorkspaceSwitcher switcher={workspaceSwitcher} /> : null}
      </div>

      <ConsoleSearch {...withDefined({ placeholder: searchPlaceholder })} />

      <div className="ml-auto flex items-center gap-2 md:gap-3">
        {balanceLabel ? (
          <span className="bg-success/10 text-success hidden rounded-full px-3 py-1 text-sm font-semibold md:inline-flex">
            {balanceLabel}
          </span>
        ) : null}
        <ConsoleHelpButton />
        {notificationCount !== undefined ? (
          <ConsoleNotificationButton count={notificationCount} />
        ) : null}
        {storefrontLabel ? <ConsoleStorefrontButton label={storefrontLabel} /> : null}
        {userMenu ? <ConsoleUserMenu menu={userMenu} /> : null}
      </div>
    </header>
  )
}
