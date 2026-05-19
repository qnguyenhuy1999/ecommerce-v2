import type {
  ProductDetailFormData,
  ProductDetailOptionGroup,
  ProductDetailProps,
  ProductDetailShippingMethod,
  ProductDetailStatus,
  ProductDetailVisibilityOption,
} from './ProductDetail.types'
import type { VariantDraft } from './ProductDetail.utils'

export type ProductEditorProps = Required<ProductDetailProps>

export type BasicInfoState = Pick<
  ProductDetailFormData,
  'name' | 'category' | 'brand' | 'shortDescription' | 'fullDescription'
>

export type ShippingState = Pick<
  ProductDetailFormData,
  'weightKg' | 'lengthCm' | 'widthCm' | 'heightCm' | 'shippingMethods'
>

export type SeoState = Pick<ProductDetailFormData, 'slug' | 'metaTitle' | 'metaDescription'>

export interface ProductEditorState {
  basicInfo: BasicInfoState
  status: ProductDetailStatus
  visibility: ProductDetailVisibilityOption[]
  media: ProductDetailFormData['media']
  optionGroups: ProductDetailOptionGroup[]
  shipping: ShippingState
  seo: SeoState
  variantDrafts: Record<string, VariantDraft>
  draftValueInputs: Record<string, string>
  slugTouched: boolean
}

export type ProductEditorAction =
  | { type: 'SET_BASIC_INFO_FIELD'; field: keyof BasicInfoState; value: string }
  | { type: 'SET_STATUS'; value: ProductDetailStatus }
  | { type: 'SET_VISIBILITY'; id: string; checked: boolean }
  | { type: 'ADD_MEDIA_ITEMS'; items: ProductDetailFormData['media'] }
  | { type: 'REMOVE_MEDIA_ITEM'; id: string }
  | { type: 'SET_OPTION_GROUP'; groupId: string; nextGroup: ProductDetailOptionGroup }
  | { type: 'REMOVE_OPTION_GROUP'; groupId: string }
  | { type: 'ADD_OPTION_GROUP' }
  | { type: 'ADD_OPTION_VALUE'; groupId: string; value: string }
  | { type: 'REMOVE_OPTION_VALUE'; groupId: string; value: string }
  | { type: 'SET_VARIANT_DRAFT'; key: string; field: keyof VariantDraft; value: string }
  | { type: 'SET_DRAFT_VALUE_INPUT'; groupId: string; value: string }
  | {
      type: 'SET_SHIPPING_FIELD'
      field: Exclude<keyof ShippingState, 'shippingMethods'>
      value: string
    }
  | { type: 'SET_SHIPPING_METHOD'; id: string; checked: boolean }
  | { type: 'SET_SEO_FIELD'; field: keyof SeoState; value: string }
  | { type: 'SET_SLUG_TOUCHED'; value: boolean }

export function cloneVisibilityOptions(options: ProductDetailVisibilityOption[]) {
  return options.map((option) => ({ ...option }))
}

export function cloneShippingMethods(methods: ProductDetailShippingMethod[]) {
  return methods.map((method) => ({ ...method }))
}
