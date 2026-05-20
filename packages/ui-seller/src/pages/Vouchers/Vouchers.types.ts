import type { DataTableProps } from '@ecom/core-ui'

export type VoucherType = 'AMOUNT' | 'PERCENT' | 'FREESHIP'

export type VoucherStatus = 'ACTIVE' | 'INACTIVE'

export interface VoucherRow {
  id: string
  code: string
  type: VoucherType
  valueLabel: string
  minSpend: number
  used: number
  quota: number
  startsAtLabel: string
  endsAtLabel: string
  status: VoucherStatus
}

export interface VouchersProps {
  title?: string
  description?: string
  newVoucherHref?: string
  vouchers?: VoucherRow[]
  columns?: DataTableProps<VoucherRow>['columns']
  emptyMessage?: string
}
