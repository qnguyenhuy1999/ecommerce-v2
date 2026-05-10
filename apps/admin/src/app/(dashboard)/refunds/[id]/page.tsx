import { RefundDetailPage } from '@/features/refunds/components/refund-detail-page'

export default async function RefundDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  return <RefundDetailPage id={id} />
}
