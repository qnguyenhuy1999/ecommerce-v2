import { VoucherDetail } from '@ecom/ui-seller'
import { DashboardLayout } from '../../../components/dashboard-layout'

export default function NewVoucherPage() {
  return (
    <DashboardLayout>
      <VoucherDetail
        breadcrumb={[
          { label: 'Seller', href: '/' },
          { label: 'Vouchers', href: '/vouchers' },
          { label: 'New' },
        ]}
        cancelHref="/vouchers"
      />
    </DashboardLayout>
  )
}
