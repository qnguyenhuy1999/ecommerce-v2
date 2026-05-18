'use client'

import { TooltipProvider } from '../../molecules/Tooltip'
import { SidebarProvider } from '../../organisms/Sidebar'
import type { ReactNode } from 'react'

interface ConsoleLayoutProvidersProps {
  children: ReactNode
}

export function ConsoleLayoutProviders({ children }: ConsoleLayoutProvidersProps) {
  return (
    <TooltipProvider>
      <SidebarProvider defaultOpen>{children}</SidebarProvider>
    </TooltipProvider>
  )
}
