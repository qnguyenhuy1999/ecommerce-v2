import type { Meta, StoryObj } from '@storybook/react-vite'
import { Button, ConsolePageLayout, SidebarInset, SidebarMenuRenderer, SidebarShell } from '@ecom/core-ui'
import { ConsoleLayout } from './ConsoleLayout'
import {
  defaultSidebarAccount,
  defaultSidebarGroups,
  defaultUserMenu,
  defaultWorkspaceSwitcher,
} from './ConsoleLayout.utils'
import { Plus } from 'lucide-react'

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
      <ConsolePageLayout
        title="Products"
        description="24 products in catalog"
        actions={
          <>
            <Button size="sm" variant="outline">
              Import
            </Button>
            <Button size="sm" variant="outline">
              Export
            </Button>
            <Button size="sm">
              <Plus />
              New product
            </Button>
          </>
        }
        aside={
          <div className="bg-card border-border rounded-md border p-4">
            <div className="border-border border-b p-4">Product categories</div>
            <div className="text-muted-foreground p-4 text-sm">Category list</div>
          </div>
        }>
        <div className="bg-card border-border rounded-md border shadow-sm">
          <div className="border-border border-b p-4">Search and filters</div>
          <div className="text-muted-foreground p-4 text-sm">Table content</div>
        </div>
      </ConsolePageLayout>
    </ConsoleLayout>
  ),
}

export const FullyCompound: Story = {
  render: () => (
    <ConsoleLayout.Root.Providers>
      <SidebarShell header={<ConsoleLayout.Root.SidebarHeader account={defaultSidebarAccount} />}>
        <SidebarMenuRenderer groups={defaultSidebarGroups} />
      </SidebarShell>

      <SidebarInset className="bg-muted/40">
        <div className="flex min-h-svh flex-col">
          <ConsoleLayout.Root.Topbar
            workspaceSwitcher={defaultWorkspaceSwitcher}
            searchPlaceholder="Search orders, SKUs, customers..."
            balanceLabel="Balance · $9,740"
            notificationCount={12}
            storefrontLabel="Live Store"
            userMenu={defaultUserMenu}
          />
          <main className="flex-1 p-6">
            <ConsolePageLayout title="Products" description="24 products in catalog">
              <div className="bg-card border-border rounded-[1.75rem] border p-4">Table content</div>
            </ConsolePageLayout>
          </main>
        </div>
      </SidebarInset>
    </ConsoleLayout.Root.Providers>
  ),
}
