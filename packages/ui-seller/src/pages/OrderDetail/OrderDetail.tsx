import { orderDetailDefaultProps } from './OrderDetail.fixtures'
import { OrderDetailClient } from './OrderDetail.client'
import type { OrderDetailProps } from './OrderDetail.types'

export function OrderDetail({
  title = orderDetailDefaultProps.title,
  description = orderDetailDefaultProps.description,
  breadcrumb = orderDetailDefaultProps.breadcrumb,
  backHref = orderDetailDefaultProps.backHref,
  order = orderDetailDefaultProps.order,
  loading = orderDetailDefaultProps.loading,
  statusActions = orderDetailDefaultProps.statusActions,
  emptyMessage = orderDetailDefaultProps.emptyMessage,
  onStatusAction,
  actionInFlight = orderDetailDefaultProps.actionInFlight,
}: OrderDetailProps) {
  const optionalProps = {
    ...(onStatusAction ? { onStatusAction } : {}),
  }

  return (
    <OrderDetailClient
      title={title}
      description={description}
      breadcrumb={breadcrumb}
      backHref={backHref}
      order={order ?? null}
      loading={loading}
      statusActions={statusActions ?? []}
      emptyMessage={emptyMessage}
      actionInFlight={actionInFlight ?? null}
      {...optionalProps}
    />
  )
}
