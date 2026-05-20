export interface ShopProfileFormData {
  shopName: string
  slug: string
  tagline: string
  about: string
  logoUrl: string
  bannerUrl: string
  supportEmail: string
  supportPhone: string
  country: string
  responseTarget: string
  followersLabel: string
  ratingLabel: string
  previewUrl: string
}

export interface ShopProfileProps {
  title?: string
  description?: string
  breadcrumb?: Array<{ label: string; href?: string }>
  submitLabel?: string
  initialData?: ShopProfileFormData
  countryOptions?: string[]
  responseTargetOptions?: string[]
  onSubmit?: (data: ShopProfileFormData) => void
  onReplaceLogo?: () => void
  onReplaceBanner?: () => void
}
