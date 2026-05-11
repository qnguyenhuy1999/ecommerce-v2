'use client'

import { ShoppingCart, Package, Warehouse, Bell } from 'lucide-react'
import { DashboardLayout } from '../components/dashboard-layout'
import { PageHeader } from '../components/page-header'
import { StatCard } from '@ecom/core-ui'

export default function DashboardPage() {
  return (
    <DashboardLayout>
      <PageHeader title="Dashboard" description="Overview of your seller performance" />

      <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard title="Pending Orders" value={0} icon={ShoppingCart} />
        <StatCard title="Active Products" value={0} icon={Package} />
        <StatCard title="Low Stock Items" value={0} icon={Warehouse} />
        <StatCard title="Unread Notifications" value={0} icon={Bell} />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="rounded-lg border border-gray-200 bg-white p-6">
          <h2 className="mb-4 text-lg font-semibold text-gray-900">Recent Orders</h2>
          <p className="text-sm text-gray-500">No recent orders</p>
        </div>

        <div className="rounded-lg border border-gray-200 bg-white p-6">
          <h2 className="mb-4 text-lg font-semibold text-gray-900">Low Stock Alerts</h2>
          <p className="text-sm text-gray-500">No low stock items</p>
        </div>
      </div>
    </DashboardLayout>
  )
}
