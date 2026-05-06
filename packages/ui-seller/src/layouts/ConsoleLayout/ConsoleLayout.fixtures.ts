import { type SidebarGroup } from '@ecom/core-ui'

export const sidebarGroups: SidebarGroup[] = [
  {
    id: 'main',
    items: [{ id: 'dashboard', label: 'Dashboard' }],
  },
  {
    id: 'management',
    label: 'Management',
    items: [
      { id: 'products', label: 'Products' },
      { id: 'inventory', label: 'Inventory' },
      { id: 'orders', label: 'Orders' },
      { id: 'returns', label: 'Returns' },
    ],
  },
  {
    id: 'marketing',
    label: 'Marketing',
    items: [{ id: 'promotions', label: 'Promotions' }],
  },
  {
    id: 'analytics',
    label: 'Analytics',
    items: [
      { id: 'analytics', label: 'Analytics' },
      { id: 'finance', label: 'Finance' },
    ],
  },
  {
    id: 'communication',
    label: 'Communication',
    items: [{ id: 'messages', label: 'Messages' }],
  },
  {
    id: 'store',
    label: 'Store',
    items: [
      { id: 'shop-profile', label: 'Shop profile' },
      { id: 'storefront', label: 'Storefront' },
    ],
  },
  {
    id: 'system',
    items: [{ id: 'settings', label: 'Settings' }],
  },
]
