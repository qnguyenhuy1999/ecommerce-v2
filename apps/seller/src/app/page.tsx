'use client'

import { ShoppingCart, Package, Warehouse, Bell } from 'lucide-react'
import { DashboardLayout } from '../components/dashboard-layout'
import { PageHeader } from '../components/page-header'
import { StatCard } from '../components/stat-card'

export default function DashboardPage() {
  return (
    <DashboardLayout>
      <PageHeader title="Dashboard" description="Overview of your seller performance" />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard title="Pending Orders" value={0} icon={ShoppingCart} />
        <StatCard title="Active Products" value={0} icon={Package} />
        <StatCard title="Low Stock Items" value={0} icon={Warehouse} />
        <StatCard title="Unread Notifications" value={0} icon={Bell} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Orders</h2>
          <p className="text-sm text-gray-500">No recent orders</p>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Low Stock Alerts</h2>
          <p className="text-sm text-gray-500">No low stock items</p>
        </div>
      </div>
    </DashboardLayout>
  )
}
