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
  Bell,
  Star,
  Shield,
  ScrollText,
  Settings,
  type LucideIcon,
} from 'lucide-react';

export interface SidebarItem {
  id: string;
  label: string;
  href: string;
  icon: LucideIcon;
  permission?: string;
}

export interface SidebarGroup {
  id: string;
  label: string;
  items: SidebarItem[];
}

export const sidebarGroups: SidebarGroup[] = [
  {
    id: 'overview',
    label: 'Overview',
    items: [
      { id: 'dashboard', label: 'Dashboard', href: '/', icon: LayoutDashboard, permission: 'DASHBOARD_VIEW' },
    ],
  },
  {
    id: 'marketplace',
    label: 'Marketplace',
    items: [
      { id: 'buyers', label: 'Buyers', href: '/buyers', icon: Users, permission: 'USER_VIEW' },
      { id: 'sellers', label: 'Sellers', href: '/sellers', icon: Store, permission: 'SELLER_VIEW' },
      { id: 'products', label: 'Products', href: '/products', icon: Package, permission: 'PRODUCT_VIEW' },
      { id: 'categories', label: 'Categories', href: '/categories', icon: FolderTree, permission: 'CATEGORY_MANAGE' },
      { id: 'orders', label: 'Orders', href: '/orders', icon: ShoppingCart, permission: 'ORDER_VIEW' },
      { id: 'refunds', label: 'Refunds', href: '/refunds', icon: RotateCcw, permission: 'REFUND_VIEW' },
    ],
  },
  {
    id: 'marketing',
    label: 'Marketing',
    items: [
      { id: 'vouchers', label: 'Vouchers', href: '/vouchers', icon: Ticket, permission: 'MARKETING_MANAGE' },
      { id: 'banners', label: 'Banners', href: '/banners', icon: Image, permission: 'BANNER_MANAGE' },
    ],
  },
  {
    id: 'moderation',
    label: 'Moderation',
    items: [
      { id: 'reviews', label: 'Reviews', href: '/reviews', icon: Star, permission: 'REVIEW_MODERATE' },
      { id: 'notifications', label: 'Notifications', href: '/notifications', icon: Bell, permission: 'NOTIFICATION_MANAGE' },
    ],
  },
  {
    id: 'administration',
    label: 'Administration',
    items: [
      { id: 'admins', label: 'Admins', href: '/admins', icon: Shield, permission: 'ADMIN_MANAGE' },
      { id: 'roles', label: 'Roles', href: '/roles', icon: Shield, permission: 'ROLE_MANAGE' },
      { id: 'audit-logs', label: 'Audit Logs', href: '/audit-logs', icon: ScrollText, permission: 'AUDIT_VIEW' },
      { id: 'settings', label: 'Settings', href: '/settings', icon: Settings, permission: 'SETTINGS_MANAGE' },
    ],
  },
];
