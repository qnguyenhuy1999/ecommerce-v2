'use client'

import { useRefund, useApproveRefund, useRejectRefund } from '../hooks/use-refunds'
import { StatusBadge } from '@ecom/core-ui'

export function RefundDetailPage({ id }: { id: string }) {
  const { data: refund, isLoading } = useRefund(id)
  const approve = useApproveRefund()
  const reject = useRejectRefund()

  if (isLoading) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="bg-muted h-20 animate-pulse rounded-xl" />
        ))}
      </div>
    )
  }

  if (!refund) return <p className="text-muted-foreground">Refund not found</p>

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Refund Request</h1>
          <p className="text-muted-foreground font-mono text-sm">{refund.id.slice(0, 8)}...</p>
        </div>
        <div className="flex items-center gap-2">
          <StatusBadge status={refund.status} />
          {['REQUESTED', 'REVIEWING'].includes(refund.status) && (
            <>
              <button
                onClick={() => approve.mutate({ id })}
                className="rounded bg-green-600 px-3 py-1.5 text-sm text-white hover:bg-green-700"
              >
                Approve
              </button>
              <button
                onClick={() => reject.mutate({ id })}
                className="rounded bg-red-600 px-3 py-1.5 text-sm text-white hover:bg-red-700"
              >
                Reject
              </button>
            </>
          )}
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="bg-card rounded-xl border p-6 shadow-sm">
          <h2 className="mb-4 font-semibold">Details</h2>
          <dl className="space-y-2 text-sm">
            <div className="flex justify-between">
              <dt className="text-muted-foreground">Reason</dt>
              <dd>{refund.reason}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-muted-foreground">Amount</dt>
              <dd>{refund.refundAmount ? `$${Number(refund.refundAmount).toFixed(2)}` : '—'}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-muted-foreground">Method</dt>
              <dd>{refund.refundMethod ?? '—'}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-muted-foreground">Created</dt>
              <dd>{new Date(refund.createdAt).toLocaleString()}</dd>
            </div>
          </dl>
        </div>

        {refund.evidence.length > 0 && (
          <div className="bg-card rounded-xl border p-6 shadow-sm">
            <h2 className="mb-4 font-semibold">Evidence ({refund.evidence.length})</h2>
            <div className="grid grid-cols-2 gap-2">
              {refund.evidence.map((e) => (
                <div
                  key={e.id}
                  className="bg-muted aspect-square overflow-hidden rounded-lg border"
                >
                  <img src={e.url} alt={e.type} className="h-full w-full object-cover" />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {refund.timeline.length > 0 && (
        <div className="bg-card rounded-xl border p-6 shadow-sm">
          <h2 className="mb-4 font-semibold">Timeline</h2>
          <div className="space-y-3">
            {refund.timeline.map((entry) => (
              <div key={entry.id} className="flex items-start gap-3 text-sm">
                <div className="bg-primary mt-1 h-2 w-2 flex-shrink-0 rounded-full" />
                <div>
                  <p className="font-medium">
                    {entry.fromStatus} → {entry.toStatus}
                  </p>
                  {entry.note && <p className="text-muted-foreground">{entry.note}</p>}
                  <p className="text-muted-foreground text-xs">
                    {new Date(entry.createdAt).toLocaleString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
