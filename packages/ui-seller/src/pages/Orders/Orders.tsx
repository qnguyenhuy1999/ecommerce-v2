import { SellerListPage } from '../../organisms/SellerListPage'
import { ordersDefaultProps } from './Orders.fixtures'
import type { OrdersProps } from './Orders.types'
import { OrdersClient } from './Orders.client'
import { filterOrdersBySearchAndStatus, ordersColumns } from './Orders.utils'

export function Orders({
  title = ordersDefaultProps.title,
  description = ordersDefaultProps.description,
  exportHref = ordersDefaultProps.exportHref,
  dateRangeLabel = ordersDefaultProps.dateRangeLabel,
  loading = ordersDefaultProps.loading,
  orders = ordersDefaultProps.orders,
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
  meta,
  onPageChange,
  filterOrders = filterOrdersBySearchAndStatus,
}: OrdersProps) {
  const optionalProps = {
    ...(meta ? { meta } : {}),
    ...(onPageChange ? { onPageChange } : {}),
  }

  return (
    <SellerListPage title={title} description={description}>
      <OrdersClient
        loading={loading}
        orders={orders}
        columns={columns}
        statusTabs={statusTabs}
        status={status}
        defaultStatus={defaultStatus}
        onStatusChange={onStatusChange}
        statusCounts={statusCounts}
        search={search}
        onSearchChange={onSearchChange}
        searchPlaceholder={searchPlaceholder}
        emptyMessage={emptyMessage}
        filterOrders={filterOrders}
        exportHref={exportHref}
        dateRangeLabel={dateRangeLabel}
        {...optionalProps}
      />
    </SellerListPage>
  )
}
