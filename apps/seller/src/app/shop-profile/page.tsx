import { ShopProfile } from '@ecom/ui-seller'
import { DashboardLayout } from '../../components/dashboard-layout'

export default function ShopProfilePage() {
  return (
    <DashboardLayout>
      <ShopProfile breadcrumb={[{ label: 'Seller', href: '/' }, { label: 'Shop profile' }]} />
    </DashboardLayout>
  )
}
