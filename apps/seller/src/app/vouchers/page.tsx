import { Vouchers } from '@ecom/ui-seller'
import { DashboardLayout } from '../../components/dashboard-layout'

export default function VouchersPage() {
  return (
    <DashboardLayout>
      <Vouchers newVoucherHref="/vouchers/new" />
    </DashboardLayout>
  )
}
