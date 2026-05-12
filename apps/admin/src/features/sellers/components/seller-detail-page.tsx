'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { UserStatus } from '@ecom/contracts'
import {
  useSellerDetail,
  useApproveSeller,
  useRejectSeller,
  useSuspendSeller,
} from '../hooks/use-sellers'

export function SellerDetailPage({ id }: { id: string }) {
  const { data: seller, isLoading } = useSellerDetail(id)
  const approve = useApproveSeller()
  const reject = useRejectSeller()
  const suspend = useSuspendSeller()
  const [reason, setReason] = useState('')

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="bg-muted h-8 w-48 animate-pulse rounded" />
        <div className="bg-muted h-64 animate-pulse rounded-xl" />
      </div>
    )
  }

  if (!seller) {
    return <p className="text-muted-foreground">Seller not found</p>
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Link href="/sellers" className="hover:bg-muted rounded-md p-1">
          <ArrowLeft className="size-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold">{seller.shopName}</h1>
          <p className="text-muted-foreground text-sm">{seller.user?.email ?? '—'}</p>
        </div>
        <StatusBadge status={seller.status} />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="bg-card rounded-xl border p-6 shadow-sm">
          <h2 className="mb-4 font-semibold">Store Information</h2>
          <dl className="space-y-3 text-sm">
            <Row label="Shop Name" value={seller.shopName} />
            <Row label="Description" value={seller.shopDescription ?? 'N/A'} />
            <Row label="Phone" value={seller.phone ?? 'N/A'} />
            <Row label="Address" value={seller.address ?? 'N/A'} />
            <Row label="Created" value={new Date(seller.createdAt).toLocaleString()} />
          </dl>
        </div>

        <div className="bg-card rounded-xl border p-6 shadow-sm">
          <h2 className="mb-4 font-semibold">Owner Information</h2>
          <dl className="space-y-3 text-sm">
            <Row label="Email" value={seller.user?.email ?? '—'} />
            <Row label="User Status" value={seller.user?.status ?? '—'} />
            <Row
              label="Registered"
              value={seller.user?.createdAt ? new Date(seller.user.createdAt).toLocaleString() : '—'}
            />
          </dl>
        </div>
      </div>

      {seller.verifications.length > 0 && (
        <div className="bg-card rounded-xl border p-6 shadow-sm">
          <h2 className="mb-4 font-semibold">Verification Documents</h2>
          <div className="space-y-3">
            {seller.verifications.map((v) => (
              <div key={v.id} className="flex items-center justify-between rounded-lg border p-3">
                <div>
                  <p className="text-sm font-medium">{v.documentType}</p>
                  <p className="text-muted-foreground text-xs">
                    Submitted {new Date(v.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <StatusBadge status={v.status} />
              </div>
            ))}
          </div>
        </div>
      )}

      {(seller.status === UserStatus.ACTIVE || seller.status === 'PENDING') && (
        <div className="bg-card rounded-xl border p-6 shadow-sm">
          <h2 className="mb-4 font-semibold">Actions</h2>
          <div className="space-y-3">
            <textarea
              placeholder="Reason / note (optional)"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              rows={2}
              className="border-input bg-background placeholder:text-muted-foreground focus-visible:ring-ring flex w-full rounded-md border px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-1"
            />
            <div className="flex flex-wrap gap-2">
              {seller.status === 'PENDING' && (
                <>
                  <button
                    onClick={() => approve.mutate(seller.id)}
                    disabled={approve.isPending}
                    className="rounded-md bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700 disabled:opacity-50"
                  >
                    {approve.isPending ? 'Approving...' : 'Approve'}
                  </button>
                  <button
                    onClick={() => reject.mutate({ id: seller.id, reason })}
                    disabled={reject.isPending}
                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90 rounded-md px-4 py-2 text-sm font-medium disabled:opacity-50"
                  >
                    {reject.isPending ? 'Rejecting...' : 'Reject'}
                  </button>
                </>
              )}
              {seller.status === UserStatus.ACTIVE && (
                <button
                  onClick={() => suspend.mutate({ id: seller.id, reason })}
                  disabled={suspend.isPending}
                  className="rounded-md bg-orange-600 px-4 py-2 text-sm font-medium text-white hover:bg-orange-700 disabled:opacity-50"
                >
                  {suspend.isPending ? 'Suspending...' : 'Suspend'}
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between">
      <dt className="text-muted-foreground">{label}</dt>
      <dd className="font-medium">{value}</dd>
    </div>
  )
}

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    ACTIVE: 'bg-green-100 text-green-700',
    PENDING: 'bg-yellow-100 text-yellow-700',
    APPROVED: 'bg-green-100 text-green-700',
    SUSPENDED: 'bg-red-100 text-red-700',
    REJECTED: 'bg-gray-100 text-gray-700',
    RESUBMITTED: 'bg-blue-100 text-blue-700',
  }
  return (
    <span
      className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${styles[status] ?? 'bg-gray-100 text-gray-700'}`}
    >
      {status}
    </span>
  )
}
