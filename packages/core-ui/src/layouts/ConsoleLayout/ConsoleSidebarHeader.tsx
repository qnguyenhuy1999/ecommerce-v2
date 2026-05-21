import { Avatar, AvatarFallback, AvatarImage } from '../../atoms/Avatar'
import { Typography } from '../../atoms/Typography'
import type { ConsoleLayoutAccount } from './ConsoleLayout.types'
import { getInitials } from './ConsoleLayout.utils'

interface ConsoleSidebarHeaderProps {
  account: ConsoleLayoutAccount
}

export function ConsoleSidebarHeader({ account }: ConsoleSidebarHeaderProps) {
  return (
    <div className="flex items-center gap-3 px-1 py-3">
      <Avatar className="size-7 shrink-0 rounded-xl">
        <AvatarImage src={account.avatarUrl} alt={account.avatarAlt ?? account.name} />
        <AvatarFallback className="bg-primary text-primary-foreground">
          {account.avatarFallback ?? getInitials(account.name)}
        </AvatarFallback>
      </Avatar>
      <div className="min-w-0 group-data-[collapsible=icon]:hidden">
        <Typography
          variant="label"
          className="text-sidebar-foreground block truncate text-base leading-tight"
        >
          {account.name}
        </Typography>
        {account.subtitle && (
          <Typography variant="caption" className="text-muted-foreground truncate text-sm">
            {account.subtitle}
          </Typography>
        )}
      </div>
    </div>
  )
}
