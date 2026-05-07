import type { Meta, StoryObj } from '@storybook/react-vite'
import {
  Bell,
  FileText,
  LayoutDashboard,
  LifeBuoy,
  LogOutIcon,
  Megaphone,
  MessageCircle,
  SearchIcon,
  SettingsIcon,
  ShieldAlert,
  ShoppingBag,
  Store,
  Tag,
  UserIcon,
  Users,
} from 'lucide-react'

import { SidebarInset, SidebarMenuRenderer, SidebarProvider, SidebarShell, SidebarTrigger } from './Sidebar'
import { InputGroup, InputGroupAddon, InputGroupInput } from '../../atoms/InputGroup'
import { Avatar, AvatarFallback, AvatarImage } from '../../atoms/Avatar'
import { Kbd } from '../../atoms/Kbd'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '../../molecules/DropdownMenu'

const meta: Meta = {
  title: 'organisms/Sidebar',
  tags: ['autodocs'],
  parameters: { layout: 'fullscreen' },
}
export default meta
type Story = StoryObj

const groups = [
  {
    id: 'admin-console',
    label: 'Admin Console',
    items: [
      {
        id: 'dashboard',
        label: 'Dashboard',
        icon: LayoutDashboard,
        href: '/',
        isActive: true,
      },
    ],
  },
  {
    id: 'operations',
    label: 'Operations',
    items: [
      { id: 'users', label: 'Users', icon: Users, href: '/users' },
      { id: 'sellers', label: 'Sellers', icon: Store, href: '/sellers', badge: 3 },
      { id: 'orders', label: 'Orders', icon: ShoppingBag, href: '/orders' },
    ],
  },
  {
    id: 'catalog',
    label: 'Catalog',
    items: [
      { id: 'products', label: 'Products', icon: Tag, href: '/products', badge: 12 },
      { id: 'categories', label: 'Categories', icon: Tag, href: '/categories' },
    ],
  },
  {
    id: 'trust',
    label: 'Trust & Safety',
    items: [
      { id: 'disputes', label: 'Disputes', icon: ShieldAlert, href: '/disputes', badge: 8 },
      { id: 'support', label: 'Support', icon: LifeBuoy, href: '/support' },
      { id: 'audit', label: 'Audit logs', icon: FileText, href: '/audit' },
    ],
  },
  {
    id: 'growth',
    label: 'Growth',
    items: [{ id: 'campaigns', label: 'Campaigns', icon: Megaphone, href: '/campaigns' }],
  },
]

export const Default: Story = {
  render: () => (
    <SidebarProvider defaultOpen>
      <div className="flex min-h-svh w-full bg-background">
        <SidebarShell
          header={
            <div className="flex items-center gap-2 px-3 py-2 text-sm font-semibold">
              <span className="flex size-7 items-center justify-center rounded-md bg-primary text-white">K</span>
              Kavi.
            </div>
          }>
          <SidebarMenuRenderer groups={groups} />
        </SidebarShell>

        <SidebarInset className="bg-background">
          <div className="flex min-h-svh flex-col">
            <header className="flex flex-col gap-4 border-b px-4 py-4 md:flex-row md:items-center md:justify-between">
              <div className="flex w-full items-center gap-3 md:max-w-xl">
                <SidebarTrigger />
                <InputGroup>
                  <InputGroupInput placeholder="Search..." />
                  <InputGroupAddon align="inline-start">
                    <SearchIcon />
                  </InputGroupAddon>
                  <InputGroupAddon align="inline-end">
                    <Kbd className="text-xs">⌘ K</Kbd>
                  </InputGroupAddon>
                </InputGroup>
              </div>
              <div className="flex items-center gap-5">
                <div className="relative">
                  <Bell className="w-4 h-4" />
                  <div className="absolute -top-2 -right-2 flex size-4 items-center justify-center rounded-full bg-primary text-white">
                    <span className="text-xs">3</span>
                  </div>
                </div>

                <div className="relative">
                  <MessageCircle className="w-4 h-4" />
                  <div className="absolute -top-2 -right-2 flex size-4 items-center justify-center rounded-full bg-primary text-white">
                    <span className="text-xs">3</span>
                  </div>
                </div>

                <DropdownMenu>
                  <DropdownMenuTrigger className="flex items-center gap-2 rounded-md hover:bg-secondary px-2 py-1">
                    <Avatar className="size-7">
                      <AvatarImage src="https://github.com/evilrabbit.png" alt="@evilrabbit" />
                      <AvatarFallback>ER</AvatarFallback>
                    </Avatar>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="min-w-60 max-w-80">
                    <DropdownMenuItem className="flex items-center gap-2">
                      <Avatar className="size-7">
                        <AvatarImage src="https://github.com/evilrabbit.png" alt="@evilrabbit" />
                        <AvatarFallback>ER</AvatarFallback>
                      </Avatar>

                      <div className="ml-2 min-w-0">
                        <p className="text-sm font-medium truncate">Evil Rabbit</p>
                        <p className="text-xs text-muted-foreground truncate">evil.rabbit@example.com</p>
                      </div>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <UserIcon /> Profile
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <SettingsIcon /> Settings
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <LogOutIcon /> Logout
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </header>

            <div>
              <h2 className="px-6 py-4 text-lg font-semibold">Overview</h2>
            </div>
          </div>
        </SidebarInset>
      </div>
    </SidebarProvider>
  ),
}
