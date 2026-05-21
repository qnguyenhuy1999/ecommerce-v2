'use client'

import { Badge, Button } from '@ecom/core-ui'
import { Download, WalletCards } from 'lucide-react'
import { useControllableState } from '../../hooks'
import { SectionCard } from '../../atoms/SectionCard'
import { cn } from '../../lib/utils'
import type { FinanceProps, FinanceTab } from './Finance.types'
import {
  filterFinanceEntriesByTab,
  formatFinanceAmount,
  formatSignedFinanceAmount,
  getFinanceAmountTone,
  getFinanceKindBadgeClass,
  getFinanceKindLabel,
  getFinanceMetricTone,
  getFinanceTabLabel,
} from './Finance.utils'

type FinanceClientProps = Required<
  Pick<
    FinanceProps,
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
  Pick<FinanceProps, 'tab' | 'onTabChange'>

const FINANCE_TABLE_HEADERS = ['Date', 'Kind', 'Reference', 'Amount'] as const

type FinanceEntriesTableProps = Required<Pick<FinanceProps, 'entries' | 'emptyMessage'>>

function FinanceEntriesTable({ entries, emptyMessage }: FinanceEntriesTableProps) {
  return (
    <div className="relative w-full overflow-x-auto">
      <table className="w-full caption-bottom text-sm">
        <thead className="bg-muted/50 [&_tr]:border-b">
          <tr className="border-secondary border-b transition-colors hover:bg-transparent">
            {FINANCE_TABLE_HEADERS.map((header, index) => (
              <th
                key={header}
                className={cn(
                  'text-foreground px-4 py-3 text-xs font-semibold tracking-wide uppercase',
                  index === FINANCE_TABLE_HEADERS.length - 1 ? 'text-right' : 'text-left',
                )}
              >
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="[&_tr:last-child]:border-0">
          {entries.length > 0 ? (
            entries.map((entry) => (
              <tr
                key={entry.id}
                className="border-secondary hover:bg-muted/50 border-b transition-colors"
              >
                <td className="px-4 py-3 text-sm whitespace-nowrap">{entry.dateLabel}</td>
                <td className="px-4 py-3 whitespace-nowrap">
                  <Badge
                    variant="secondary"
                    size="sm"
                    className={cn(
                      'border-0 font-normal capitalize',
                      getFinanceKindBadgeClass(entry.kind),
                    )}
                  >
                    {getFinanceKindLabel(entry.kind)}
                  </Badge>
                </td>
                <td className="px-4 py-3 text-sm font-medium whitespace-nowrap">
                  {entry.reference}
                </td>
                <td
                  className={cn(
                    'px-4 py-3 text-right text-sm font-semibold whitespace-nowrap',
                    getFinanceAmountTone(entry.amount),
                  )}
                >
                  {formatSignedFinanceAmount(entry.amount)}
                </td>
              </tr>
            ))
          ) : (
            <tr className="border-secondary border-b">
              <td colSpan={4} className="text-muted-foreground px-4 py-8 text-center text-sm">
                {emptyMessage}
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  )
}

export function FinanceClient({
  walletBalanceLabel,
  walletBalance,
  balanceMetrics,
  withdrawHref,
  statementHref,
  tabs,
  tab,
  defaultTab,
  onTabChange,
  entries,
  emptyMessage,
}: FinanceClientProps) {
  const [currentTab, setCurrentTab] = useControllableState<FinanceTab>({
    defaultValue: defaultTab,
    ...(tab !== undefined ? { value: tab } : {}),
    ...(onTabChange !== undefined ? { onChange: onTabChange } : {}),
  })

  const visibleEntries = filterFinanceEntriesByTab(entries, currentTab)

  return (
    <div className="space-y-4">
      <section className="surface-card grid gap-4 rounded-[28px] p-5 xl:grid-cols-[minmax(0,1fr)_auto] xl:items-center">
        <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_auto] xl:items-center">
          <div className="flex items-center gap-4">
            <div className="bg-primary-soft text-primary flex size-14 shrink-0 items-center justify-center rounded-full">
              <WalletCards className="size-6" />
            </div>
            <div>
              <p className="text-muted-foreground text-xs font-semibold tracking-[0.16em] uppercase">
                {walletBalanceLabel}
              </p>
              <p className="text-foreground text-4xl font-semibold tracking-tight">
                {formatFinanceAmount(walletBalance)}
              </p>
            </div>
          </div>

          <div className="grid gap-3 md:grid-cols-3">
            {balanceMetrics.map((metric) => (
              <div
                key={metric.label}
                className="bg-background border-border min-w-44 rounded-2xl border px-4 py-3"
              >
                <p className="text-muted-foreground text-sm">{metric.label}</p>
                <p
                  className={cn(
                    'mt-1 text-2xl font-semibold tracking-tight',
                    getFinanceMetricTone(metric.tone),
                  )}
                >
                  {formatFinanceAmount(metric.amount)}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-start xl:justify-end">
          <Button asChild size="lg" className="rounded-2xl px-6 font-semibold">
            <a href={withdrawHref}>Withdraw</a>
          </Button>
        </div>
      </section>

      <SectionCard
        className="rounded-[28px] p-0"
        padded={false}
        action={
          <Button asChild variant="outline" className="rounded-2xl">
            <a href={statementHref}>
              <Download className="size-4" />
              Statement
            </a>
          </Button>
        }
      >
        <div className="border-border flex flex-wrap gap-2 border-b px-3 py-2.5">
          {tabs.map((item) => {
            const isActive = item === currentTab

            return (
              <button
                key={item}
                type="button"
                onClick={() => setCurrentTab(item)}
                className={cn(
                  'inline-flex h-10 items-center rounded-2xl px-4 text-sm font-medium transition-colors',
                  isActive ? 'bg-primary-soft text-primary-deep' : 'text-foreground hover:bg-muted',
                )}
              >
                {getFinanceTabLabel(item)}
              </button>
            )
          })}
        </div>

        <FinanceEntriesTable entries={visibleEntries} emptyMessage={emptyMessage} />
      </SectionCard>
    </div>
  )
}
