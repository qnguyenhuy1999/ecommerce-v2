import type { DataTableProps } from '@ecom/core-ui'
import type { ReactNode } from 'react'
import { returnStatusTabs } from './ReturnsRefunds.fixtures'
import type {
  ReturnRow,
  ReturnsRefundsFilterParams,
  ReturnsRefundsStatus,
  ReturnsRefundsStatusTab,
} from './ReturnsRefunds.types'

interface RowCellContext {
  row: {
    original: ReturnRow
  }
}

interface DisplayColumn {
  id: string
  header: string
  cell: (context: RowCellContext) => ReactNode
}

interface AccessorColumn {
  accessorKey: keyof ReturnRow
  header: string
  cell?: (context: RowCellContext) => ReactNode
}

type ReturnsColumn = DisplayColumn | AccessorColumn

const moneyFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  maximumFractionDigits: 2,
})

const STATUS_STYLES: Record<ReturnsRefundsStatus, string> = {
  OPEN: 'text-sky-600',
  APPROVED: 'text-emerald-600',
  REFUNDED: 'text-orange-600',
  REJECTED: 'text-rose-600',
}

const STATUS_DOT_STYLES: Record<ReturnsRefundsStatus, string> = {
  OPEN: 'bg-sky-500',
  APPROVED: 'bg-emerald-500',
  REFUNDED: 'bg-orange-500',
  REJECTED: 'bg-rose-500',
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
): DataTableProps<ReturnRow>['columns'] {
  const caseColumn: DisplayColumn = {
    id: 'caseId',
    header: 'Case',
    cell: ({ row }) => (
      <button
        type="button"
        className="font-mono text-sm font-medium text-slate-700 hover:text-orange-600 hover:underline"
        onClick={() => onSelect(row.original)}
      >
        {row.original.caseId}
      </button>
    ),
  }

  const orderColumn: AccessorColumn = {
    accessorKey: 'orderNumber',
    header: 'Order',
    cell: ({ row }) => (
      <span className="font-semibold text-slate-950">{row.original.orderNumber}</span>
    ),
  }

  const buyerColumn: AccessorColumn = {
    accessorKey: 'buyerName',
    header: 'Buyer',
    cell: ({ row }) => <span className="font-medium text-sky-600">{row.original.buyerName}</span>,
  }

  const reasonColumn: AccessorColumn = {
    accessorKey: 'reason',
    header: 'Reason',
    cell: ({ row }) => (
      <button
        type="button"
        className="text-left text-sm text-sky-500 hover:underline"
        onClick={() => onSelect(row.original)}
      >
        {row.original.reason}
      </button>
    ),
  }

  const amountColumn: AccessorColumn = {
    accessorKey: 'amount',
    header: 'Amount',
    cell: ({ row }) => (
      <span className="font-semibold text-slate-950">
        {moneyFormatter.format(row.original.amount)}
      </span>
    ),
  }

  const statusColumn: AccessorColumn = {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }) => <ReturnStatusBadge status={row.original.status} />,
  }

  const openedColumn: AccessorColumn = {
    accessorKey: 'openedAtLabel',
    header: 'Opened',
    cell: ({ row }) => <span className="text-slate-600">{row.original.openedAtLabel}</span>,
  }

  const columnsDefinition: ReturnsColumn[] = [
    caseColumn,
    orderColumn,
    buyerColumn,
    reasonColumn,
    amountColumn,
    statusColumn,
    openedColumn,
  ]

  return columnsDefinition as unknown as DataTableProps<ReturnRow>['columns']
}
