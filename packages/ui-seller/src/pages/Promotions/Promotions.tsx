import { Button, ConsolePageLayout } from '@ecom/core-ui'
import { Plus } from 'lucide-react'
import { PromotionsClient } from './Promotions.client'
import { promotionsDefaultProps } from './Promotions.fixtures'
import type { PromotionsProps } from './Promotions.types'

export function Promotions({
  title = promotionsDefaultProps.title,
  description = promotionsDefaultProps.description,
  newPromotionHref = promotionsDefaultProps.newPromotionHref,
  promotions = promotionsDefaultProps.promotions,
  onEdit = promotionsDefaultProps.onEdit,
  onDuplicate = promotionsDefaultProps.onDuplicate,
  onActiveChange = promotionsDefaultProps.onActiveChange,
}: PromotionsProps) {
  return (
    <ConsolePageLayout
      title={title}
      description={description}
      actions={
        <Button asChild size="sm">
          <a href={newPromotionHref}>
            <Plus />
            New promotion
          </a>
        </Button>
      }
    >
      <PromotionsClient
        promotions={promotions}
        onEdit={onEdit}
        onDuplicate={onDuplicate}
        onActiveChange={onActiveChange}
      />
    </ConsolePageLayout>
  )
}
