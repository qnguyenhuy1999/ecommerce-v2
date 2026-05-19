import { Badge } from '@ecom/core-ui'
import type { PromotionKind, PromotionRow, PromotionStatus } from './Promotions.types'

const PROMOTION_STATUS_LABELS: Record<PromotionStatus, string> = {
  LIVE: 'Live',
  SCHEDULED: 'Scheduled',
  DRAFT: 'Draft',
  ENDED: 'Ended',
}

const PROMOTION_STATUS_STYLES: Record<PromotionStatus, string> = {
  LIVE: 'bg-success/10 text-success',
  SCHEDULED: 'bg-info/10 text-info',
  DRAFT: 'bg-muted text-muted-foreground',
  ENDED: 'bg-muted text-muted-foreground',
}

const PROMOTION_KIND_LABELS: Record<PromotionKind, string> = {
  FLASH: 'flash',
  BUNDLE: 'bundle',
  DISCOUNT: 'discount',
}

export const promotionStatusOrder: PromotionStatus[] = ['LIVE', 'SCHEDULED', 'DRAFT', 'ENDED']

export function getPromotionStatusLabel(status: PromotionStatus) {
  return PROMOTION_STATUS_LABELS[status]
}

export function getPromotionKindLabel(kind: PromotionKind) {
  return PROMOTION_KIND_LABELS[kind]
}

export function buildPromotionStatusCounts(
  promotions: PromotionRow[],
): Record<PromotionStatus, number> {
  return promotions.reduce<Record<PromotionStatus, number>>(
    (counts, promotion) => {
      counts[promotion.status] += 1
      return counts
    },
    {
      LIVE: 0,
      SCHEDULED: 0,
      DRAFT: 0,
      ENDED: 0,
    },
  )
}

export function groupPromotionsByStatus(
  promotions: PromotionRow[],
): Record<PromotionStatus, PromotionRow[]> {
  return promotions.reduce<Record<PromotionStatus, PromotionRow[]>>(
    (groups, promotion) => {
      groups[promotion.status].push(promotion)
      return groups
    },
    {
      LIVE: [],
      SCHEDULED: [],
      DRAFT: [],
      ENDED: [],
    },
  )
}

export function formatPromotionDateRange(promotion: PromotionRow) {
  return `${promotion.startsAtLabel} -> ${promotion.endsAtLabel}`
}

export function getPromotionProgressValue(promotion: PromotionRow) {
  if (promotion.progressTarget <= 0) {
    return 0
  }

  return Math.min(100, Math.round((promotion.progressCurrent / promotion.progressTarget) * 100))
}

export function formatPromotionCount(count: number) {
  return `${count} promotion${count === 1 ? '' : 's'}`
}

export function PromotionStatusBadge({ status }: { status: PromotionStatus }) {
  return (
    <Badge className={PROMOTION_STATUS_STYLES[status]} variant="secondary">
      <span className="inline-flex items-center gap-1.5">
        <span className="h-1.5 w-1.5 rounded-full bg-current" />
        {getPromotionStatusLabel(status)}
      </span>
    </Badge>
  )
}
