import type { Meta, StoryObj } from '@storybook/react-vite'
import { SidebarInset, SidebarMenuRenderer, SidebarShell } from '@ecom/core-ui'
import { ConsoleLayout } from './ConsoleLayout'
import {
  defaultSidebarAccount,
  defaultSidebarGroups,
  defaultUserMenu,
  defaultWorkspaceSwitcher,
} from './ConsoleLayout.utils'

const meta: Meta = {
  title: 'layouts/ConsoleLayout',
  tags: ['autodocs'],
  parameters: { layout: 'fullscreen' },
}
export default meta
type Story = StoryObj

export const Primary: Story = {
  render: () => (
    <ConsoleLayout
      balanceLabel="Balance · $9,740"
      notificationCount={12}
      searchPlaceholder="Search orders, SKUs, customers..."
      sidebarAccount={{
        name: 'Halo Seller',
        subtitle: 'Lumen Audio Official',
        avatarUrl: 'https://github.com/evilrabbit.png',
        avatarAlt: 'Halo Seller',
        avatarFallback: 'HS',
      }}
      storefrontLabel="Live Store"
      userMenu={{
        name: 'Evil Rabbit',
        email: 'evil.rabbit@example.com',
        avatarUrl: 'https://github.com/evilrabbit.png',
        avatarAlt: '@evilrabbit',
        avatarFallback: 'ER',
      }}
      workspaceSwitcher={{
        label: 'Seller Center',
        items: ['Seller Center', 'Buyer Account'],
      }}>
      abc
    </ConsoleLayout>
  ),
}

export const FullyCompound: Story = {
  render: () => (
    <ConsoleLayout.Root.Providers>
      <SidebarShell header={<ConsoleLayout.Root.SidebarHeader account={defaultSidebarAccount} />}>
        <SidebarMenuRenderer groups={defaultSidebarGroups} />
      </SidebarShell>

      <SidebarInset className="bg-background">
        <div className="flex min-h-svh flex-col">
          <ConsoleLayout.Root.Topbar
            workspaceSwitcher={defaultWorkspaceSwitcher}
            searchPlaceholder="Search orders, SKUs, customers..."
            balanceLabel="Balance Â· $9,740"
            notificationCount={12}
            storefrontLabel="Live Store"
            userMenu={defaultUserMenu}
          />
          <main className="p-6">abc</main>
        </div>
      </SidebarInset>
    </ConsoleLayout.Root.Providers>
  ),
}
