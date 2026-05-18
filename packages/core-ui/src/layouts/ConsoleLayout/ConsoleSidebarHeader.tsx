import { Avatar, AvatarFallback, AvatarImage } from '../../atoms/Avatar'
import type { ConsoleLayoutAccount } from './ConsoleLayout.types'
import { getInitials } from './ConsoleLayout.utils'

interface ConsoleSidebarHeaderProps {
  account: ConsoleLayoutAccount
}

export function ConsoleSidebarHeader({ account }: ConsoleSidebarHeaderProps) {
  return (
    <div className="flex items-center gap-3 px-1 py-2">
      <Avatar className="size-7 shrink-0">
        <AvatarImage src={account.avatarUrl} alt={account.avatarAlt ?? account.name} />
        <AvatarFallback>{account.avatarFallback ?? getInitials(account.name)}</AvatarFallback>
      </Avatar>
      <div className="min-w-0 group-data-[collapsible=icon]:hidden">
        <p className="truncate text-sm leading-tight font-semibold">{account.name}</p>
        {account.subtitle && (
          <p className="text-muted-foreground truncate text-xs">{account.subtitle}</p>
        )}
      </div>
    </div>
  )
}
