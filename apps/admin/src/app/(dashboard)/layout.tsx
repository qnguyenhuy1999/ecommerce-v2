import { AdminSidebar } from '@/components/layout/admin-sidebar'

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return <AdminSidebar>{children}</AdminSidebar>
}
