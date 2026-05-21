import type {
  FinanceEntryKind,
  FinanceLedgerEntry,
  FinanceProps,
  FinanceTab,
} from './Finance.types'

export const financeTabs = [
  'TRANSACTIONS',
  'PAYOUTS',
  'FEES_AND_TAXES',
  'BANK',
] as const satisfies readonly FinanceTab[]

export const financeLedgerEntries: FinanceLedgerEntry[] = [
  {
    id: 'finance-ord-100340',
    dateLabel: 'May 11, 2026',
    kind: 'SALE',
    reference: 'ORD-100340',
    amount: 40,
    tab: 'TRANSACTIONS',
  },
  {
    id: 'finance-ord-100341',
    dateLabel: 'May 11, 2026',
    kind: 'SALE',
    reference: 'ORD-100341',
    amount: 57,
    tab: 'TRANSACTIONS',
  },
  {
    id: 'finance-ord-100342',
    dateLabel: 'May 10, 2026',
    kind: 'SALE',
    reference: 'ORD-100342',
    amount: 74,
    tab: 'TRANSACTIONS',
  },
  {
    id: 'finance-fee-100343',
    dateLabel: 'May 10, 2026',
    kind: 'FEE',
    reference: 'ORD-100343',
    amount: -5,
    tab: 'FEES_AND_TAXES',
  },
  {
    id: 'finance-refund-100344',
    dateLabel: 'May 10, 2026',
    kind: 'REFUND',
    reference: 'ORD-100344',
    amount: -24,
    tab: 'TRANSACTIONS',
  },
  {
    id: 'finance-ord-100345',
    dateLabel: 'May 9, 2026',
    kind: 'SALE',
    reference: 'ORD-100345',
    amount: 125,
    tab: 'TRANSACTIONS',
  },
  {
    id: 'finance-payout-1006',
    dateLabel: 'May 9, 2026',
    kind: 'PAYOUT',
    reference: 'PO-1006',
    amount: -1000,
    tab: 'PAYOUTS',
  },
  {
    id: 'finance-ord-100347',
    dateLabel: 'May 9, 2026',
    kind: 'SALE',
    reference: 'ORD-100347',
    amount: 159,
    tab: 'TRANSACTIONS',
  },
  {
    id: 'finance-ord-100348',
    dateLabel: 'May 9, 2026',
    kind: 'SALE',
    reference: 'ORD-100348',
    amount: 176,
    tab: 'TRANSACTIONS',
  },
  {
    id: 'finance-ord-100349',
    dateLabel: 'May 8, 2026',
    kind: 'SALE',
    reference: 'ORD-100349',
    amount: 193,
    tab: 'TRANSACTIONS',
  },
  {
    id: 'finance-fee-processing',
    dateLabel: 'May 8, 2026',
    kind: 'FEE',
    reference: 'PROCESSING-FEE',
    amount: -18,
    tab: 'FEES_AND_TAXES',
  },
  {
    id: 'finance-bank-8842',
    dateLabel: 'May 7, 2026',
    kind: 'BANK_TRANSFER',
    reference: 'Citibank •••• 8842',
    amount: 0,
    tab: 'BANK',
  },
]

export const financeKindLabels: Record<FinanceEntryKind, string> = {
  SALE: 'sale',
  FEE: 'fee',
  REFUND: 'refund',
  PAYOUT: 'payout',
  BANK_TRANSFER: 'bank transfer',
}

export const financeDefaultProps: Required<
  Pick<
    FinanceProps,
    | 'title'
    | 'description'
    | 'walletBalanceLabel'
    | 'walletBalance'
    | 'balanceMetrics'
    | 'withdrawHref'
    | 'statementHref'
    | 'tabs'
    | 'defaultTab'
    | 'entries'
    | 'emptyMessage'
  >
> &
  Pick<FinanceProps, 'tab'> = {
  title: 'Finance & wallet',
  description: 'Payouts, fees and ledger',
  walletBalanceLabel: 'Wallet balance',
  walletBalance: 6240,
  balanceMetrics: [
    { label: 'Available', amount: 4820, tone: 'success' },
    { label: 'Pending', amount: 1240, tone: 'info' },
    { label: 'On hold', amount: 180, tone: 'warning' },
  ],
  withdrawHref: '#',
  statementHref: '#',
  tabs: [...financeTabs],
  defaultTab: 'TRANSACTIONS',
  entries: financeLedgerEntries,
  emptyMessage: 'No ledger entries yet.',
}
