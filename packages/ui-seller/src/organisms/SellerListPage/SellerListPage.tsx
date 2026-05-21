'use client'

import { ConsolePageLayout, DataTable, Input } from '@ecom/core-ui'
import { cn } from '@ecom/shared/utils'
import { Search } from 'lucide-react'
import { formatStatusLabel } from '../../utils'
import type {
  SellerListPageActionsProps,
  SellerListPageFiltersProps,
  SellerListPageHeaderProps,
  SellerListPageRootProps,
  SellerListPageSearchProps,
  SellerListPageStatusTabsProps,
  SellerListPageTableProps,
} from './SellerListPage.types'

function Root({ children, ...props }: SellerListPageRootProps) {
  return <ConsolePageLayout {...props}>{children}</ConsolePageLayout>
}

function Header({ children, className }: SellerListPageHeaderProps) {
  return <div className={cn('space-y-4', className)}>{children}</div>
}

function Actions({ children, className }: SellerListPageActionsProps) {
  return <div className={cn('flex flex-wrap items-center gap-3', className)}>{children}</div>
}

function Filters({ children, className }: SellerListPageFiltersProps) {
  return (
    <div className={cn('flex flex-col gap-3 lg:flex-row lg:items-center', className)}>
      {children}
    </div>
  )
}

function SearchField({
  value,
  onChange,
  placeholder = 'Search...',
  className,
}: SellerListPageSearchProps) {
  return (
    <div className={cn('relative w-full max-w-sm', className)}>
      <Search className="text-muted-foreground pointer-events-none absolute top-1/2 left-4 h-4 w-4 -translate-y-1/2" />
      <Input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="bg-background border-input placeholder:text-muted-foreground h-10 rounded-2xl pl-10 text-sm shadow-none focus-visible:ring-0"
      />
    </div>
  )
}

function StatusTabs({ tabs, value, onChange, counts, className }: SellerListPageStatusTabsProps) {
  return (
    <div className={cn('flex flex-wrap items-center gap-1.5', className)}>
      {tabs.map((tab) => {
        const isActive = value === tab

        return (
          <button
            key={tab}
            type="button"
            onClick={() => onChange(tab)}
            className={cn(
              'inline-flex h-10 items-center gap-2 rounded-2xl px-4 text-sm font-medium transition-colors',
              isActive
                ? 'bg-primary-soft text-primary-deep'
                : 'text-foreground hover:bg-muted hover:text-foreground',
            )}
          >
            <span>{formatStatusLabel(tab)}</span>
            {counts && counts[tab] != null ? (
              <span
                className={cn(
                  'inline-flex min-w-5 items-center justify-center rounded-full px-1.5 py-0.5 text-xs leading-none',
                  isActive
                    ? 'bg-background/80 text-primary-deep'
                    : 'bg-muted text-muted-foreground',
                )}
              >
                {counts[tab]}
              </span>
            ) : null}
          </button>
        )
      })}
    </div>
  )
}

function Table<T extends { id: string }>(props: SellerListPageTableProps<T>) {
  return <DataTable {...props} />
}

type SellerListPageComponent = typeof Root & {
  Header: typeof Header
  Actions: typeof Actions
  Filters: typeof Filters
  Search: typeof SearchField
  StatusTabs: typeof StatusTabs
  Table: typeof Table
}

export const SellerListPage: SellerListPageComponent = Object.assign(Root, {
  Header,
  Actions,
  Filters,
  Search: SearchField,
  StatusTabs,
  Table,
})
