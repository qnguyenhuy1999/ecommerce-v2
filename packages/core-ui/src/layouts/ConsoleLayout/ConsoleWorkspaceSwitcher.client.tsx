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
      <DropdownMenuTrigger className="text-foreground hover:bg-muted flex items-center gap-2 rounded-xl px-2.5 py-2 text-sm font-semibold transition-colors">
        {switcher.label}
        <ChevronDown className="text-muted-foreground size-3.5" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="min-w-48">
        {switcher.items.map((item) => (
          <DropdownMenuItem key={item}>{item}</DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
