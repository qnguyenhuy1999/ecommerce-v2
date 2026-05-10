import { ProductDetailPage } from '@/features/products/components/product-detail-page'

export default async function ProductDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  return <ProductDetailPage id={id} />
}
