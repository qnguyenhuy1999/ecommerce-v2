import { SellerDetailPage } from '@/features/sellers/components/seller-detail-page'

export default async function SellerDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  return <SellerDetailPage id={id} />
}
