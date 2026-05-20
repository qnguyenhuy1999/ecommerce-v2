'use client'

import { SellerListPage } from '../../organisms/SellerListPage'
import { vouchersDefaultProps } from './Vouchers.fixtures'
import type { VoucherRow, VouchersProps } from './Vouchers.types'
import { vouchersColumns } from './Vouchers.utils'

interface VouchersClientProps {
  vouchers: VoucherRow[]
  columns?: VouchersProps['columns']
  emptyMessage?: VouchersProps['emptyMessage']
}

export function VouchersClient({
  vouchers,
  columns = vouchersColumns,
  emptyMessage = vouchersDefaultProps.emptyMessage,
}: VouchersClientProps) {
  return <SellerListPage.Table columns={columns} data={vouchers} emptyMessage={emptyMessage} />
}
