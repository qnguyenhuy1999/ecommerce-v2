import { OrderDetailPage } from '@/features/orders/components/order-detail-page';

export default async function OrderDetail({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <OrderDetailPage id={id} />;
}
