import {
  LayoutDashboard,
  Users,
  Store,
  Package,
  FolderTree,
  ShoppingCart,
  RotateCcw,
  Ticket,
  Image,
  ShieldCheck,
  UserCog,
  FileText,
  Settings,
} from 'lucide-react';
import type { SidebarGroup } from '@ecom/core-ui';

export const sidebarGroups: SidebarGroup[] = [
  {
    id: 'main',
    items: [
      {
        id: 'dashboard',
        label: 'Dashboard',
        icon: LayoutDashboard,
        href: '/',
      },
    ],
  },
  {
    id: 'users',
    label: 'Users',
    items: [
      { id: 'buyers', label: 'Buyers', icon: Users, href: '/buyers' },
      { id: 'sellers', label: 'Sellers', icon: Store, href: '/sellers' },
    ],
  },
  {
    id: 'catalog',
    label: 'Catalog',
    items: [
      {
        id: 'products',
        label: 'Products',
        icon: Package,
        href: '/products',
      },
      {
        id: 'categories',
        label: 'Categories',
        icon: FolderTree,
        href: '/categories',
      },
    ],
  },
  {
    id: 'orders',
    label: 'Orders',
    items: [
      {
        id: 'orders',
        label: 'Orders',
        icon: ShoppingCart,
        href: '/orders',
      },
      {
        id: 'refunds',
        label: 'Refunds',
        icon: RotateCcw,
        href: '/refunds',
      },
    ],
  },
  {
    id: 'marketing',
    label: 'Marketing',
    items: [
      {
        id: 'vouchers',
        label: 'Vouchers',
        icon: Ticket,
        href: '/vouchers',
      },
      { id: 'banners', label: 'Banners', icon: Image, href: '/banners' },
    ],
  },
  {
    id: 'system',
    label: 'System',
    items: [
      { id: 'admins', label: 'Admins', icon: UserCog, href: '/admins' },
      { id: 'roles', label: 'Roles', icon: ShieldCheck, href: '/roles' },
      {
        id: 'audit-logs',
        label: 'Audit Logs',
        icon: FileText,
        href: '/audit-logs',
      },
      {
        id: 'settings',
        label: 'Settings',
        icon: Settings,
        href: '/settings',
      },
    ],
  },
];
