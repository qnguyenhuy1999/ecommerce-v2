import type {
  ReturnRow,
  ReturnsRefundsProps,
  ReturnsRefundsStatusTab,
} from './ReturnsRefunds.types'
import { buildReturnStatusCounts, filterReturnsBySearchAndStatus } from './ReturnsRefunds.utils'

export const returnStatusTabs = [
  'ALL',
  'OPEN',
  'APPROVED',
  'REFUNDED',
  'REJECTED',
] as const satisfies readonly ReturnsRefundsStatusTab[]

export const returnsPageRows: ReturnRow[] = [
  {
    id: 'rc1',
    caseId: 'rc1',
    orderNumber: 'ORD-100341',
    buyerName: 'Priya R.',
    reason: 'Item not as described',
    amount: 89.9,
    status: 'OPEN',
    openedAtLabel: 'May 11, 2026',
    evidence: [
      'https://images.unsplash.com/photo-1503602642458-232111445657?auto=format&fit=crop&w=400&q=80',
      'https://images.unsplash.com/photo-1501854140801-50d01698950b?auto=format&fit=crop&w=400&q=80',
    ],
  },
  {
    id: 'rc2',
    caseId: 'rc2',
    orderNumber: 'ORD-100339',
    buyerName: 'Marco D.',
    reason: 'Damaged on arrival',
    amount: 142,
    status: 'APPROVED',
    openedAtLabel: 'May 10, 2026',
    evidence: [
      'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=400&q=80',
    ],
  },
  {
    id: 'rc3',
    caseId: 'rc3',
    orderNumber: 'ORD-100335',
    buyerName: 'Chloe N.',
    reason: 'Wrong size delivered',
    amount: 64.5,
    status: 'REFUNDED',
    openedAtLabel: 'May 8, 2026',
  },
  {
    id: 'rc4',
    caseId: 'rc4',
    orderNumber: 'ORD-100330',
    buyerName: 'Yuki I.',
    reason: 'No longer needed',
    amount: 24,
    status: 'REJECTED',
    openedAtLabel: 'May 6, 2026',
  },
  {
    id: 'rc5',
    caseId: 'rc5',
    orderNumber: 'ORD-100328',
    buyerName: 'Sam W.',
    reason: 'Defective unit',
    amount: 218,
    status: 'OPEN',
    openedAtLabel: 'May 10, 2026',
    evidence: [
      'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?auto=format&fit=crop&w=400&q=80',
    ],
  },
]

export const returnsDefaultProps = {
  title: 'Returns & refunds',
  description: 'Review cases and decide refund outcomes',
  returns: returnsPageRows,
  statusTabs: [...returnStatusTabs],
  status: 'ALL',
  defaultStatus: 'ALL',
  onStatusChange: () => {},
  statusCounts: buildReturnStatusCounts(returnsPageRows),
  searchPlaceholder: 'Search case, order, buyer...',
  emptyMessage: 'No return cases match the current filters',
  filterReturns: filterReturnsBySearchAndStatus,
  onApprove: () => {},
  onPartial: () => {},
  onReject: () => {},
} satisfies Required<ReturnsRefundsProps>
