'use client'

import { Button, DataTable, StatusTabs, TableToolbar } from '@ecom/core-ui'
import type { DataTableProps } from '@ecom/core-ui'
import { ChevronDown, Download } from 'lucide-react'
import { useState } from 'react'
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
  const [internalSearch, setInternalSearch] = useState(search ?? '')
  const [internalStatus, setInternalStatus] = useState<OrdersStatusTab>(defaultStatus)

  const currentSearch = search ?? internalSearch
  const currentStatus = status ?? internalStatus
  const counts = statusCounts ?? buildOrderStatusCounts(orders)
  const filteredOrders = filterOrders({ orders, search: currentSearch, status: currentStatus })
  const tableProps: DataTableProps<OrderRow> = {
    columns,
    data: filteredOrders,
    loading,
    enableRowSelection: true,
  }

  if (meta !== undefined) {
    tableProps.meta = meta
  }

  if (onPageChange !== undefined) {
    tableProps.onPageChange = onPageChange
  }

  return (
    <DataTable
      {...tableProps}
      toolbar={
        <TableToolbar
          search={currentSearch}
          onSearchChange={(value) => {
            if (search === undefined) {
              setInternalSearch(value)
            }

            onSearchChange?.(value)
          }}
          placeholder={searchPlaceholder}
        >
          <div className="flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
            <StatusTabs
              tabs={statusTabs}
              value={currentStatus}
              onChange={(tab) => {
                if (isOrdersStatusTab(tab)) {
                  if (status === undefined) {
                    setInternalStatus(tab)
                  }

                  onStatusChange?.(tab)
                }
              }}
              counts={counts}
            />

            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                className="h-10 rounded-2xl border-slate-200 bg-white text-sm font-medium"
              >
                {dateRangeLabel}
                <ChevronDown className="size-4 text-slate-500" />
              </Button>
              <Button
                asChild
                variant="outline"
                size="sm"
                className="h-10 rounded-2xl border-slate-200 bg-white text-sm font-medium"
              >
                <a href={exportHref}>
                  <Download className="size-4" />
                  Export
                </a>
              </Button>
            </div>
          </div>
        </TableToolbar>
      }
      emptyMessage={
        currentSearch || currentStatus !== 'ALL'
          ? `No ${getOrdersStatusLabel(currentStatus).toLowerCase()} orders found.`
          : emptyMessage
      }
    />
  )
}
