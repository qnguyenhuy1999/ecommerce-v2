import { Button } from '@ecom/core-ui'
import { Plus } from 'lucide-react'
import { SellerListPage } from '../../organisms/SellerListPage'
import { vouchersDefaultProps } from './Vouchers.fixtures'
import type { VouchersProps } from './Vouchers.types'
import { VouchersClient } from './Vouchers.client'
import { vouchersColumns } from './Vouchers.utils'

export function Vouchers({
  title = vouchersDefaultProps.title,
  description = vouchersDefaultProps.description,
  newVoucherHref = vouchersDefaultProps.newVoucherHref,
  vouchers = vouchersDefaultProps.vouchers,
  columns = vouchersColumns,
  emptyMessage = vouchersDefaultProps.emptyMessage,
}: VouchersProps) {
  return (
    <SellerListPage
      title={title}
      description={description}
      actions={
        <SellerListPage.Actions>
          <Button asChild size="sm">
            <a href={newVoucherHref}>
              <Plus />
              New voucher
            </a>
          </Button>
        </SellerListPage.Actions>
      }
    >
      <VouchersClient vouchers={vouchers} columns={columns} emptyMessage={emptyMessage} />
    </SellerListPage>
  )
}
