import type { DataTableColumn } from '@ecom/core-ui'
import { returnStatusTabs } from './ReturnsRefunds.fixtures'
import type {
  ReturnRow,
  ReturnsRefundsFilterParams,
  ReturnsRefundsStatus,
  ReturnsRefundsStatusTab,
} from './ReturnsRefunds.types'

const moneyFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  maximumFractionDigits: 2,
})

const STATUS_STYLES: Record<ReturnsRefundsStatus, string> = {
  OPEN: 'text-info',
  APPROVED: 'text-success',
  REFUNDED: 'text-warning',
  REJECTED: 'text-destructive',
}

const STATUS_DOT_STYLES: Record<ReturnsRefundsStatus, string> = {
  OPEN: 'bg-info',
  APPROVED: 'bg-success',
  REFUNDED: 'bg-warning',
  REJECTED: 'bg-destructive',
}

const STATUS_LABELS: Record<ReturnsRefundsStatusTab, string> = {
  ALL: 'All',
  OPEN: 'Open',
  APPROVED: 'Approved',
  REFUNDED: 'Refunded',
  REJECTED: 'Rejected',
}

export function getReturnStatusLabel(status: ReturnsRefundsStatusTab) {
  return STATUS_LABELS[status]
}

export function isReturnsRefundsStatusTab(value: string): value is ReturnsRefundsStatusTab {
  return returnStatusTabs.some((tab) => tab === value)
}

export function buildReturnStatusCounts(
  returns: ReturnRow[],
): Record<ReturnsRefundsStatusTab, number> {
  const counts: Record<ReturnsRefundsStatusTab, number> = {
    ALL: 0,
    OPEN: 0,
    APPROVED: 0,
    REFUNDED: 0,
    REJECTED: 0,
  }

  for (const item of returns) {
    counts.ALL += 1
    counts[item.status] += 1
  }

  return counts
}

export function filterReturnsBySearchAndStatus({
  returns,
  search,
  status,
}: ReturnsRefundsFilterParams): ReturnRow[] {
  const query = search.trim().toLowerCase()

  return returns.filter((item) => {
    const matchesStatus = status === 'ALL' || item.status === status
    const matchesSearch =
      query.length === 0 ||
      item.caseId.toLowerCase().includes(query) ||
      item.orderNumber.toLowerCase().includes(query) ||
      item.buyerName.toLowerCase().includes(query) ||
      item.reason.toLowerCase().includes(query)

    return matchesStatus && matchesSearch
  })
}

function ReturnStatusBadge({ status }: { status: ReturnsRefundsStatus }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 text-sm font-medium ${STATUS_STYLES[status]}`}
    >
      <span className={`size-2 rounded-full ${STATUS_DOT_STYLES[status]}`} />
      {STATUS_LABELS[status]}
    </span>
  )
}

/**
 * Creates Returns & Refunds table columns. The `onSelect` callback receives the
 * row when the case-ID cell is clicked, opening the detail sheet.
 */
export function createReturnsColumns(
  onSelect: (row: ReturnRow) => void,
): DataTableColumn<ReturnRow>[] {
  const caseColumn: DataTableColumn<ReturnRow> = {
    id: 'caseId',
    header: 'Case',
    cell: ({ row }) => (
      <button
        type="button"
        className="text-foreground hover:text-primary font-mono text-sm font-medium hover:underline"
        onClick={() => onSelect(row.original)}
      >
        {row.original.caseId}
      </button>
    ),
  }

  const orderColumn: DataTableColumn<ReturnRow> = {
    accessorKey: 'orderNumber',
    header: 'Order',
    cell: ({ row }) => (
      <span className="text-foreground font-semibold">{row.original.orderNumber}</span>
    ),
  }

  const buyerColumn: DataTableColumn<ReturnRow> = {
    accessorKey: 'buyerName',
    header: 'Buyer',
    cell: ({ row }) => <span className="text-primary font-medium">{row.original.buyerName}</span>,
  }

  const reasonColumn: DataTableColumn<ReturnRow> = {
    accessorKey: 'reason',
    header: 'Reason',
    cell: ({ row }) => (
      <button
        type="button"
        className="text-primary text-left text-sm hover:underline"
        onClick={() => onSelect(row.original)}
      >
        {row.original.reason}
      </button>
    ),
  }

  const amountColumn: DataTableColumn<ReturnRow> = {
    accessorKey: 'amount',
    header: 'Amount',
    cell: ({ row }) => (
      <span className="text-foreground font-semibold">
        {moneyFormatter.format(row.original.amount)}
      </span>
    ),
  }

  const statusColumn: DataTableColumn<ReturnRow> = {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }) => <ReturnStatusBadge status={row.original.status} />,
  }

  const openedColumn: DataTableColumn<ReturnRow> = {
    accessorKey: 'openedAtLabel',
    header: 'Opened',
    cell: ({ row }) => <span className="text-muted-foreground">{row.original.openedAtLabel}</span>,
  }

  return [
    caseColumn,
    orderColumn,
    buyerColumn,
    reasonColumn,
    amountColumn,
    statusColumn,
    openedColumn,
  ]
}
