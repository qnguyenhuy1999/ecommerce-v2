import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem as UIItem,
} from '../../primitives/ui/sidebar'
import type { SidebarGroup as Group } from './Sidebar.types'
import type { ReactNode } from 'react'

type SidebarMenuRendererProps = {
  groups: Group[]
}
type SidebarShellProps = {
  header?: ReactNode
  footer?: ReactNode
  children: ReactNode
}

export function SidebarMenuRenderer({ groups }: SidebarMenuRendererProps) {
  return (
    <>
      {groups.map((group) => (
        <SidebarGroup key={group.id}>
          {group.label && <SidebarGroupLabel>{group.label}</SidebarGroupLabel>}

          <SidebarGroupContent>
            <SidebarMenu>
              {group.items.map((item) => (
                <UIItem key={item.id}>
                  <SidebarMenuButton
                    asChild
                    tooltip={item.label}
                    {...(item.isActive !== undefined ? { isActive: item.isActive } : {})}
                  >
                    <a href={item.href || '#'}>
                      {item.icon && <item.icon />}
                      <span>{item.label}</span>

                      {item.badge != null && (
                        <span className="bg-primary text-primary-foreground ml-auto inline-flex min-w-5 items-center justify-center rounded-full px-2 py-0.5 text-xs font-semibold tabular-nums">
                          {item.badge}
                        </span>
                      )}
                    </a>
                  </SidebarMenuButton>
                </UIItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      ))}
    </>
  )
}

export function SidebarShell({ header, footer, children }: SidebarShellProps) {
  return (
    <Sidebar collapsible="icon">
      {header && <SidebarHeader>{header}</SidebarHeader>}

      <SidebarContent>{children}</SidebarContent>

      {footer && <SidebarFooter>{footer}</SidebarFooter>}
    </Sidebar>
  )
}

export { SidebarInset, SidebarProvider, SidebarTrigger } from '../../primitives/ui/sidebar'
