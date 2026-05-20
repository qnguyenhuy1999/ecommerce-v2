import { Badge } from '@ecom/core-ui'
import type { DataTableColumn } from '@ecom/core-ui'
import type { VoucherRow, VoucherStatus, VoucherType } from './Vouchers.types'

const moneyFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  maximumFractionDigits: 0,
})

const VOUCHER_TYPE_LABELS: Record<VoucherType, string> = {
  AMOUNT: 'amount',
  PERCENT: 'percent',
  FREESHIP: 'freeship',
}

const VOUCHER_STATUS_LABELS: Record<VoucherStatus, string> = {
  ACTIVE: 'Active',
  INACTIVE: 'Inactive',
}

const VOUCHER_STATUS_CLASS_NAMES: Record<VoucherStatus, string> = {
  ACTIVE: 'bg-success/10 text-success',
  INACTIVE: 'bg-muted text-muted-foreground',
}

const VOUCHER_STATUS_DOT_CLASS_NAMES: Record<VoucherStatus, string> = {
  ACTIVE: 'bg-success',
  INACTIVE: 'bg-muted-foreground',
}

export function formatVoucherMinSpend(value: number) {
  return moneyFormatter.format(value)
}

export function formatVoucherWindow(voucher: VoucherRow) {
  return `${voucher.startsAtLabel} - ${voucher.endsAtLabel}`
}

export function VoucherTypeBadge({ type }: { type: VoucherType }) {
  return (
    <Badge variant="secondary" className="bg-muted text-muted-foreground rounded-full px-3">
      {VOUCHER_TYPE_LABELS[type]}
    </Badge>
  )
}

export function VoucherStatusBadge({ status }: { status: VoucherStatus }) {
  return (
    <Badge
      variant="secondary"
      className={`inline-flex rounded-full px-3 ${VOUCHER_STATUS_CLASS_NAMES[status]}`}
    >
      <span
        className={`mr-1.5 inline-block size-2 rounded-full ${VOUCHER_STATUS_DOT_CLASS_NAMES[status]}`}
      />
      {VOUCHER_STATUS_LABELS[status]}
    </Badge>
  )
}

const codeColumn: DataTableColumn<VoucherRow> = {
  accessorKey: 'code',
  header: 'Code',
  cell: ({ row }) => (
    <span className="text-foreground font-mono text-sm font-semibold uppercase">
      {row.original.code}
    </span>
  ),
}

const typeColumn: DataTableColumn<VoucherRow> = {
  accessorKey: 'type',
  header: 'Type',
  cell: ({ row }) => <VoucherTypeBadge type={row.original.type} />,
}

const valueColumn: DataTableColumn<VoucherRow> = {
  accessorKey: 'valueLabel',
  header: 'Value',
  cell: ({ row }) => (
    <span className="text-foreground font-semibold">{row.original.valueLabel}</span>
  ),
}

const minSpendColumn: DataTableColumn<VoucherRow> = {
  accessorKey: 'minSpend',
  header: 'Min Spend',
  cell: ({ row }) => (
    <span className="text-foreground font-medium">
      {formatVoucherMinSpend(row.original.minSpend)}
    </span>
  ),
}

const usageColumn: DataTableColumn<VoucherRow> = {
  id: 'usage',
  header: 'Used / Quota',
  cell: ({ row }) => (
    <span className="text-foreground font-medium tabular-nums">
      {row.original.used} / {row.original.quota}
    </span>
  ),
}

const windowColumn: DataTableColumn<VoucherRow> = {
  id: 'window',
  header: 'Window',
  cell: ({ row }) => (
    <span className="text-muted-foreground text-sm">{formatVoucherWindow(row.original)}</span>
  ),
}

const statusColumn: DataTableColumn<VoucherRow> = {
  accessorKey: 'status',
  header: 'Status',
  cell: ({ row }) => <VoucherStatusBadge status={row.original.status} />,
}

export const vouchersColumns: DataTableColumn<VoucherRow>[] = [
  codeColumn,
  typeColumn,
  valueColumn,
  minSpendColumn,
  usageColumn,
  windowColumn,
  statusColumn,
]
