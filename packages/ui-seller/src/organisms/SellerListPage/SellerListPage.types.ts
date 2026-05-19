import type { DataTableProps } from '@ecom/core-ui'
import type { ConsolePageLayoutProps } from '@ecom/core-ui'

export type SellerListPageRootProps = ConsolePageLayoutProps

export interface SellerListPageFiltersProps {
  children: React.ReactNode
  className?: string
}

export interface SellerListPageSearchProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  className?: string
}

export interface SellerListPageStatusTabsProps {
  tabs: string[]
  value: string
  onChange: (tab: string) => void
  counts?: Record<string, number>
  className?: string
}

export type SellerListPageTableProps<T extends { id: string }> = DataTableProps<T>

export interface SellerListPageActionsProps {
  children: React.ReactNode
  className?: string
}

export interface SellerListPageHeaderProps {
  children: React.ReactNode
  className?: string
}
