import type { ProductDetailProps } from './ProductDetail.types'
import { productDetailDefaultProps } from './ProductDetail.fixtures'
import { ProductDetailClient } from './ProductDetail.client'

export function ProductDetail({
  title = productDetailDefaultProps.title,
  breadcrumb = productDetailDefaultProps.breadcrumb,
  previewHref = productDetailDefaultProps.previewHref,
  saveDraftHref = productDetailDefaultProps.saveDraftHref,
  publishHref = productDetailDefaultProps.publishHref,
  lastSavedLabel = productDetailDefaultProps.lastSavedLabel,
  categories = productDetailDefaultProps.categories,
  brands = productDetailDefaultProps.brands,
  statuses = productDetailDefaultProps.statuses,
  initialData = productDetailDefaultProps.initialData,
}: ProductDetailProps) {
  return (
    <ProductDetailClient
      title={title}
      breadcrumb={breadcrumb}
      previewHref={previewHref}
      saveDraftHref={saveDraftHref}
      publishHref={publishHref}
      lastSavedLabel={lastSavedLabel}
      categories={categories}
      brands={brands}
      statuses={statuses}
      initialData={initialData}
    />
  )
}
