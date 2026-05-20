import type { FinanceEntryKind, FinanceLedgerEntry, FinanceTab } from './Finance.types'

const currencyFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  maximumFractionDigits: 0,
})

export function formatFinanceAmount(amount: number) {
  return currencyFormatter.format(Math.abs(amount))
}

export function formatSignedFinanceAmount(amount: number) {
  if (amount === 0) {
    return '$0'
  }

  const prefix = amount > 0 ? '+' : '-'
  return `${prefix}${formatFinanceAmount(amount)}`
}

export function getFinanceAmountTone(amount: number) {
  if (amount > 0) return 'text-success'
  if (amount < 0) return 'text-destructive'
  return 'text-muted-foreground'
}

export function getFinanceMetricTone(tone: 'success' | 'info' | 'warning' | 'default' = 'default') {
  switch (tone) {
    case 'success':
      return 'text-success'
    case 'info':
      return 'text-primary'
    case 'warning':
      return 'text-foreground'
    default:
      return 'text-foreground'
  }
}

export function getFinanceTabLabel(tab: FinanceTab) {
  switch (tab) {
    case 'TRANSACTIONS':
      return 'Transactions'
    case 'PAYOUTS':
      return 'Payouts'
    case 'FEES_AND_TAXES':
      return 'Fees & taxes'
    case 'BANK':
      return 'Bank'
  }
}

export function getFinanceKindLabel(kind: FinanceEntryKind) {
  switch (kind) {
    case 'SALE':
      return 'sale'
    case 'FEE':
      return 'fee'
    case 'REFUND':
      return 'refund'
    case 'PAYOUT':
      return 'payout'
    case 'BANK_TRANSFER':
      return 'bank transfer'
  }
}

export function getFinanceKindBadgeClass(kind: FinanceEntryKind) {
  switch (kind) {
    case 'SALE':
      return 'bg-secondary text-foreground'
    case 'FEE':
      return 'bg-muted text-muted-foreground'
    case 'REFUND':
      return 'bg-muted text-foreground'
    case 'PAYOUT':
      return 'bg-primary-soft text-primary-deep'
    case 'BANK_TRANSFER':
      return 'bg-secondary text-muted-foreground'
  }
}

export function filterFinanceEntriesByTab(entries: FinanceLedgerEntry[], tab: FinanceTab) {
  switch (tab) {
    case 'TRANSACTIONS':
      return entries.filter((entry) => entry.tab === 'TRANSACTIONS')
    case 'PAYOUTS':
      return entries.filter((entry) => entry.tab === 'PAYOUTS')
    case 'FEES_AND_TAXES':
      return entries.filter((entry) => entry.tab === 'FEES_AND_TAXES')
    case 'BANK':
      return entries.filter((entry) => entry.tab === 'BANK')
  }
}
