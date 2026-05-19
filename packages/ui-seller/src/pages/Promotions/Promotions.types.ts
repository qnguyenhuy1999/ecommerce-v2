export type PromotionStatus = 'LIVE' | 'SCHEDULED' | 'DRAFT' | 'ENDED'

export type PromotionKind = 'FLASH' | 'BUNDLE' | 'DISCOUNT'

export interface PromotionRow {
  id: string
  name: string
  status: PromotionStatus
  kind: PromotionKind
  startsAtLabel: string
  endsAtLabel: string
  offerLabel: string
  productCount: number
  progressCurrent: number
  progressTarget: number
  active: boolean
}

export interface PromotionsProps {
  title?: string
  description?: string
  newPromotionHref?: string
  promotions?: PromotionRow[]
  onEdit?: (promotion: PromotionRow) => void
  onDuplicate?: (promotion: PromotionRow) => void
  onActiveChange?: (promotionId: string, active: boolean) => void
}
