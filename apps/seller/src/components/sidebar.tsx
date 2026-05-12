'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard,
  ShoppingCart,
  Package,
  Warehouse,
  Bell,
  Store,
  Truck,
  LogOut,
  Menu,
  X,
  Tag,
  BarChart3,
  Upload,
  Star,
  MessageSquare,
  RotateCcw,
  ClipboardCheck,
  TrendingUp,
  Search,
} from 'lucide-react'
import { useState } from 'react'
import { useAuth } from '../providers/auth-provider'

const NAV_ITEMS = [
  { href: '/', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/orders', label: 'Orders', icon: ShoppingCart },
  { href: '/products', label: 'Products', icon: Package },
  { href: '/inventory', label: 'Inventory', icon: Warehouse },
  { href: '/shipping', label: 'Shipping', icon: Truck },
  { href: '/coupons', label: 'Coupons', icon: Tag },
  { href: '/analytics', label: 'Analytics', icon: BarChart3 },
  { href: '/bulk', label: 'Bulk Operations', icon: Upload },
  { href: '/reviews', label: 'Reviews', icon: Star },
  { href: '/chat', label: 'Chat', icon: MessageSquare },
  { href: '/returns', label: 'Returns', icon: RotateCcw },
  { href: '/approvals', label: 'Approvals', icon: ClipboardCheck },
  { href: '/warehouses', label: 'Warehouses', icon: Warehouse },
  { href: '/metrics', label: 'Performance', icon: TrendingUp },
  { href: '/search', label: 'Search', icon: Search },
  { href: '/notifications', label: 'Notifications', icon: Bell },
  { href: '/settings', label: 'Shop Settings', icon: Store },
]

export function Sidebar() {
  const pathname = usePathname()
  const { logout } = useAuth()
  const [mobileOpen, setMobileOpen] = useState(false)

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/'
    return pathname.startsWith(href)
  }

  const navContent = (
    <nav className="flex h-full flex-col">
      <div className="border-b border-gray-200 p-4">
        <h1 className="text-lg font-bold text-gray-900">Seller Center</h1>
      </div>

      <div className="flex-1 space-y-1 px-2 py-4">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon
          const active = isActive(item.href)
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setMobileOpen(false)}
              className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                active
                  ? 'bg-blue-50 text-blue-700'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }`}
            >
              <Icon className="h-5 w-5 shrink-0" />
              {item.label}
            </Link>
          )
        })}
      </div>

      <div className="border-t border-gray-200 p-2">
        <button
          onClick={() => {
            logout()
            setMobileOpen(false)
          }}
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-50 hover:text-gray-900"
        >
          <LogOut className="h-5 w-5 shrink-0" />
          Logout
        </button>
      </div>
    </nav>
  )

  return (
    <>
      {/* Mobile toggle */}
      <button
        onClick={() => setMobileOpen(!mobileOpen)}
        className="fixed left-4 top-4 z-50 rounded-lg bg-white p-2 shadow-md lg:hidden"
      >
        {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </button>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-64 transform border-r border-gray-200 bg-white transition-transform lg:static lg:z-auto lg:translate-x-0 ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {navContent}
      </aside>
    </>
  )
}
