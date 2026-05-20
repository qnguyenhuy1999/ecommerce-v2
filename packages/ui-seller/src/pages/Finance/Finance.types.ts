export type FinanceTab = 'TRANSACTIONS' | 'PAYOUTS' | 'FEES_AND_TAXES' | 'BANK'

export type FinanceEntryKind = 'SALE' | 'FEE' | 'REFUND' | 'PAYOUT' | 'BANK_TRANSFER'

export interface FinanceBalanceMetric {
  label: string
  amount: number
  tone?: 'success' | 'info' | 'warning' | 'default'
}

export interface FinanceLedgerEntry {
  id: string
  dateLabel: string
  kind: FinanceEntryKind
  reference: string
  amount: number
  tab: FinanceTab
}

export interface FinanceProps {
  title?: string
  description?: string
  walletBalanceLabel?: string
  walletBalance?: number
  balanceMetrics?: FinanceBalanceMetric[]
  withdrawHref?: string
  statementHref?: string
  tabs?: FinanceTab[]
  tab?: FinanceTab
  defaultTab?: FinanceTab
  onTabChange?: (tab: FinanceTab) => void
  entries?: FinanceLedgerEntry[]
  emptyMessage?: string
}
