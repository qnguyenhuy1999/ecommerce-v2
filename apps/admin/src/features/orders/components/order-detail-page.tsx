'use client'

import { useOrder, useForceCancelOrder, useForceCompleteOrder } from '../hooks/use-orders'
import { StatusBadge } from '@ecom/core-ui'

export function OrderDetailPage({ id }: { id: string }) {
  const { data: order, isLoading } = useOrder(id)
  const forceCancel = useForceCancelOrder()
  const forceComplete = useForceCompleteOrder()

  if (isLoading) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="bg-muted h-24 animate-pulse rounded-xl" />
        ))}
      </div>
    )
  }

  if (!order) return <p className="text-muted-foreground">Order not found</p>

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-mono text-2xl font-bold tracking-tight">{order.id.slice(0, 8)}...</h1>
          <p className="text-muted-foreground text-sm">
            {new Date(order.createdAt).toLocaleString()}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <StatusBadge status={order.status} />
          {!['CANCELLED', 'DELIVERED'].includes(order.status) && (
            <>
              <button
                onClick={() => forceCancel.mutate({ id })}
                className="rounded bg-red-600 px-3 py-1.5 text-sm text-white hover:bg-red-700"
              >
                Force Cancel
              </button>
              <button
                onClick={() => forceComplete.mutate(id)}
                className="rounded bg-green-600 px-3 py-1.5 text-sm text-white hover:bg-green-700"
              >
                Force Complete
              </button>
            </>
          )}
        </div>
      </div>

      <div className="bg-card rounded-xl border p-6 shadow-sm">
        <h2 className="mb-2 font-semibold">Summary</h2>
        <dl className="grid gap-2 text-sm sm:grid-cols-3">
          <div>
            <dt className="text-muted-foreground">Total</dt>
            <dd className="font-medium">${Number(order.totalAmount).toFixed(2)}</dd>
          </div>
          <div>
            <dt className="text-muted-foreground">Sellers</dt>
            <dd>{order.sellerOrders.length}</dd>
          </div>
          <div>
            <dt className="text-muted-foreground">Status</dt>
            <dd>{order.status}</dd>
          </div>
        </dl>
      </div>

      {order.sellerOrders.map((so) => (
        <div key={so.id} className="bg-card rounded-xl border shadow-sm">
          <div className="flex items-center justify-between border-b px-6 py-4">
            <div>
              <h3 className="font-semibold">{so.shop.name}</h3>
              <p className="text-muted-foreground text-xs">
                Subtotal: ${Number(so.subtotal).toFixed(2)}
              </p>
            </div>
            <StatusBadge status={so.status} />
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-muted/50 border-b text-left">
                  <th className="text-muted-foreground px-4 py-3 font-medium">Product</th>
                  <th className="text-muted-foreground px-4 py-3 font-medium">Qty</th>
                  <th className="text-muted-foreground px-4 py-3 font-medium">Price</th>
                  <th className="text-muted-foreground px-4 py-3 font-medium">Total</th>
                </tr>
              </thead>
              <tbody>
                {so.items.map((item) => (
                  <tr key={item.id} className="border-b">
                    <td className="px-4 py-3 font-medium">{item.productName}</td>
                    <td className="px-4 py-3">{item.quantity}</td>
                    <td className="px-4 py-3">${Number(item.unitPrice).toFixed(2)}</td>
                    <td className="px-4 py-3">${Number(item.totalPrice).toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {so.shipment && (
            <div className="border-t px-6 py-3 text-sm">
              <span className="text-muted-foreground">Shipping: </span>
              <StatusBadge status={so.shipment.status} />
              {so.shipment.trackingNumber && (
                <span className="ml-2 font-mono text-xs">{so.shipment.trackingNumber}</span>
              )}
            </div>
          )}
        </div>
      ))}
    </div>
  )
}
