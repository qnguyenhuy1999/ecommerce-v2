'use client'

import { Avatar, AvatarFallback, AvatarImage } from '../../atoms/Avatar'
import { Typography } from '../../atoms/Typography'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../../molecules/DropdownMenu'
import { LogOutIcon, SettingsIcon, UserIcon } from 'lucide-react'
import type { ConsoleLayoutUserMenu } from './ConsoleLayout.types'
import { getInitials } from './ConsoleLayout.utils'

interface ConsoleUserMenuProps {
  menu: ConsoleLayoutUserMenu
}

export function ConsoleUserMenu({ menu }: ConsoleUserMenuProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="hover:bg-muted hidden items-center gap-2 rounded-xl px-1.5 py-1.5 transition-colors sm:flex">
        <Avatar className="size-8 rounded-xl">
          <AvatarImage src={menu.avatarUrl} alt={menu.avatarAlt ?? menu.name} />
          <AvatarFallback>{menu.avatarFallback ?? getInitials(menu.name)}</AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="max-w-80 min-w-60">
        <DropdownMenuItem className="flex items-center gap-2">
          <Avatar className="size-7">
            <AvatarImage src={menu.avatarUrl} alt={menu.avatarAlt ?? menu.name} />
            <AvatarFallback>{menu.avatarFallback ?? getInitials(menu.name)}</AvatarFallback>
          </Avatar>
          <div className="ml-2 min-w-0">
            <Typography variant="label" className="block truncate">
              {menu.name}
            </Typography>
            <Typography variant="caption" className="text-muted-foreground truncate">
              {menu.email}
            </Typography>
          </div>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          <UserIcon /> Profile
        </DropdownMenuItem>
        <DropdownMenuItem>
          <SettingsIcon /> Settings
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          <LogOutIcon /> Logout
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
