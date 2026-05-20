import type { VoucherRow, VouchersProps } from './Vouchers.types'
import { vouchersColumns } from './Vouchers.utils'

export const vouchersPageRows: VoucherRow[] = [
  {
    id: 'voucher-lumen5',
    code: 'LUMEN5',
    type: 'AMOUNT',
    valueLabel: '$5',
    minSpend: 30,
    used: 124,
    quota: 500,
    startsAtLabel: 'May 6, 2026',
    endsAtLabel: 'Jun 5, 2026',
    status: 'ACTIVE',
  },
  {
    id: 'voucher-audio10',
    code: 'AUDIO10',
    type: 'PERCENT',
    valueLabel: '10%',
    minSpend: 50,
    used: 480,
    quota: 1000,
    startsAtLabel: 'May 1, 2026',
    endsAtLabel: 'May 31, 2026',
    status: 'ACTIVE',
  },
  {
    id: 'voucher-freeship-lum',
    code: 'FREESHIP-LUM',
    type: 'FREESHIP',
    valueLabel: 'Free ship',
    minSpend: 25,
    used: 980,
    quota: 2000,
    startsAtLabel: 'Apr 27, 2026',
    endsAtLabel: 'May 25, 2026',
    status: 'ACTIVE',
  },
  {
    id: 'voucher-vip15',
    code: 'VIP15',
    type: 'PERCENT',
    valueLabel: '15%',
    minSpend: 80,
    used: 32,
    quota: 200,
    startsAtLabel: 'May 9, 2026',
    endsAtLabel: 'Jun 10, 2026',
    status: 'INACTIVE',
  },
]

export const vouchersDefaultProps = {
  title: 'Vouchers',
  description: 'Code-based discounts you can share or attach to campaigns',
  newVoucherHref: '#',
  vouchers: vouchersPageRows,
  columns: vouchersColumns,
  emptyMessage: 'No vouchers available',
} satisfies Required<VouchersProps>
