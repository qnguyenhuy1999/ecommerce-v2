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
    <header className="flex h-14 shrink-0 items-center gap-3 border-b px-4">
      <div className="flex items-center gap-2">
        <ConsoleSidebarTrigger />
        {workspaceSwitcher ? <ConsoleWorkspaceSwitcher switcher={workspaceSwitcher} /> : null}
      </div>

      <ConsoleSearch placeholder={searchPlaceholder} />

      <div className="ml-auto flex items-center gap-3">
        {balanceLabel ? (
          <span className="text-sm font-medium text-green-600">{balanceLabel}</span>
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
