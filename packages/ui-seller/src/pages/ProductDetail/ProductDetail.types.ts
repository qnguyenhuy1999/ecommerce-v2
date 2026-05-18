import type { MediaItem } from '../../molecules/ProductMediaUpload'

export type ProductDetailStatus = 'DRAFT' | 'PENDING' | 'LIVE' | 'OUT_OF_STOCK'

export interface ProductDetailOptionGroup {
  id: string
  name: string
  values: string[]
}

export interface ProductDetailVariantSeed {
  key: string
  sku: string
  price: string
  stock: string
}

export interface ProductDetailVisibilityOption {
  id: string
  label: string
  checked: boolean
}

export interface ProductDetailShippingMethod {
  id: string
  label: string
  checked: boolean
}

export interface ProductDetailValidationItem {
  id: string
  label: string
  complete: boolean
}

export interface ProductDetailFormData {
  name: string
  category: string
  brand: string
  shortDescription: string
  fullDescription: string
  status: ProductDetailStatus
  media: MediaItem[]
  optionGroups: ProductDetailOptionGroup[]
  variantSeeds: ProductDetailVariantSeed[]
  weightKg: string
  lengthCm: string
  widthCm: string
  heightCm: string
  shippingMethods: ProductDetailShippingMethod[]
  slug: string
  metaTitle: string
  metaDescription: string
  visibility: ProductDetailVisibilityOption[]
  validationItems: ProductDetailValidationItem[]
}

export interface ProductDetailProps {
  title?: string
  breadcrumb?: Array<{ label: string; href?: string }>
  previewHref?: string
  saveDraftHref?: string
  publishHref?: string
  lastSavedLabel?: string
  categories?: string[]
  brands?: string[]
  statuses?: ProductDetailStatus[]
  initialData?: ProductDetailFormData
}
