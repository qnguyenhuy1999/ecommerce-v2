'use client'

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../../molecules/DropdownMenu'
import { ChevronDown } from 'lucide-react'
import type { ConsoleLayoutSwitcher } from './ConsoleLayout.types'

interface ConsoleWorkspaceSwitcherProps {
  switcher: ConsoleLayoutSwitcher
}

export function ConsoleWorkspaceSwitcher({ switcher }: ConsoleWorkspaceSwitcherProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="hover:bg-secondary flex items-center gap-1 rounded-md px-2 py-1 text-sm font-semibold">
        {switcher.label}
        <ChevronDown className="text-muted-foreground h-3.5 w-3.5" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="min-w-48">
        {switcher.items.map((item) => (
          <DropdownMenuItem key={item}>{item}</DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
