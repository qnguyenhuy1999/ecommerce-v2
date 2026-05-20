'use client'

import { Button } from '@ecom/core-ui'
import { ChevronDown, Download } from 'lucide-react'
import { startTransition, useDeferredValue, useMemo } from 'react'
import { useControllableState } from '../../hooks'
import { SellerListPage } from '../../organisms/SellerListPage'
import { ordersDefaultProps } from './Orders.fixtures'
import type { OrderRow, OrdersProps, OrdersStatusTab } from './Orders.types'
import {
  buildOrderStatusCounts,
  filterOrdersBySearchAndStatus,
  getOrdersStatusLabel,
  isOrdersStatusTab,
  ordersColumns,
} from './Orders.utils'

interface OrdersClientProps {
  orders: OrderRow[]
  columns?: OrdersProps['columns']
  statusTabs?: OrdersProps['statusTabs']
  status?: OrdersProps['status']
  defaultStatus?: OrdersProps['defaultStatus']
  onStatusChange?: OrdersProps['onStatusChange']
  statusCounts?: OrdersProps['statusCounts']
  search?: OrdersProps['search']
  onSearchChange?: OrdersProps['onSearchChange']
  searchPlaceholder?: OrdersProps['searchPlaceholder']
  emptyMessage?: OrdersProps['emptyMessage']
  filterOrders?: OrdersProps['filterOrders']
  exportHref?: OrdersProps['exportHref']
  dateRangeLabel?: OrdersProps['dateRangeLabel']
  loading?: OrdersProps['loading']
  meta?: OrdersProps['meta']
  onPageChange?: OrdersProps['onPageChange']
}

export function OrdersClient({
  orders,
  columns = ordersColumns,
  statusTabs = ordersDefaultProps.statusTabs,
  status,
  defaultStatus = ordersDefaultProps.defaultStatus,
  onStatusChange,
  statusCounts,
  search,
  onSearchChange,
  searchPlaceholder = ordersDefaultProps.searchPlaceholder,
  emptyMessage = ordersDefaultProps.emptyMessage,
  filterOrders = filterOrdersBySearchAndStatus,
  exportHref = ordersDefaultProps.exportHref,
  dateRangeLabel = ordersDefaultProps.dateRangeLabel,
  loading = ordersDefaultProps.loading,
  meta,
  onPageChange,
}: OrdersClientProps) {
  const [currentSearch, setCurrentSearch] = useControllableState({
    defaultValue: search ?? '',
    ...(search !== undefined ? { value: search } : {}),
    ...(onSearchChange !== undefined ? { onChange: onSearchChange } : {}),
  })
  const [currentStatus, setCurrentStatus] = useControllableState<OrdersStatusTab>({
    defaultValue: defaultStatus,
    ...(status !== undefined ? { value: status } : {}),
    ...(onStatusChange !== undefined ? { onChange: onStatusChange } : {}),
  })
  const deferredSearch = useDeferredValue(currentSearch)

  const counts = useMemo(
    () => statusCounts ?? buildOrderStatusCounts(orders),
    [orders, statusCounts],
  )
  const filteredOrders = useMemo(
    () => filterOrders({ orders, search: deferredSearch, status: currentStatus }),
    [currentStatus, deferredSearch, filterOrders, orders],
  )

  return (
    <SellerListPage.Table
      columns={columns}
      data={filteredOrders}
      loading={loading}
      enableRowSelection
      {...(meta !== undefined ? { meta } : {})}
      {...(onPageChange !== undefined ? { onPageChange } : {})}
      toolbar={
        <SellerListPage.Filters>
          <SellerListPage.Search
            value={currentSearch}
            onChange={(value) => {
              startTransition(() => {
                setCurrentSearch(value)
              })
            }}
            placeholder={searchPlaceholder}
          />
          <div className="flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
            <SellerListPage.StatusTabs
              tabs={statusTabs}
              value={currentStatus}
              onChange={(tab) => {
                if (isOrdersStatusTab(tab)) {
                  startTransition(() => {
                    setCurrentStatus(tab)
                  })
                }
              }}
              counts={counts}
            />

            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                className="bg-background border-input h-10 rounded-2xl text-sm font-medium"
              >
                {dateRangeLabel}
                <ChevronDown className="text-muted-foreground size-4" />
              </Button>
              <Button
                asChild
                variant="outline"
                size="sm"
                className="bg-background border-input h-10 rounded-2xl text-sm font-medium"
              >
                <a href={exportHref}>
                  <Download className="size-4" />
                  Export
                </a>
              </Button>
            </div>
          </div>
        </SellerListPage.Filters>
      }
      emptyMessage={
        currentSearch || currentStatus !== 'ALL'
          ? `No ${getOrdersStatusLabel(currentStatus).toLowerCase()} orders found.`
          : emptyMessage
      }
    />
  )
}
