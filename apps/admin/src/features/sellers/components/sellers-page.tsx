/* eslint-disable max-lines-per-function */
'use client'

import { useState, useCallback } from 'react'
import Link from 'next/link'
import { SellerStatus } from '@ecom/contracts'
import { PAGINATION_DEFAULTS } from '@ecom/shared/pagination/core'
import { useSellers, useSellerStatusCounts } from '../hooks/use-sellers'

type SellerStatusFilter = (typeof SellerStatus)[keyof typeof SellerStatus] | 'ALL'

const STATUS_TABS: SellerStatusFilter[] = ['ALL', ...Object.values(SellerStatus)]

function isSellerStatusFilter(value: string): value is SellerStatusFilter {
  return value === 'ALL' || Object.values(SellerStatus).some((status) => status === value)
}

function getSellerEmail(seller: unknown): string | null {
  if (!seller || typeof seller !== 'object' || !('user' in seller)) return null

  const user = seller.user
  if (!user || typeof user !== 'object' || !('email' in user)) return null

  return typeof user.email === 'string' ? user.email : null
}

export function SellersPage() {
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')
  const [debouncedSearch, setDebouncedSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<SellerStatusFilter>('ALL')

  const debounceTimeout = useCallback(() => {
    let timer: ReturnType<typeof setTimeout>
    return (value: string) => {
      clearTimeout(timer)
      timer = setTimeout(() => {
        setDebouncedSearch(value)
        setPage(1)
      }, 300)
    }
  }, [])()

  const { data, isLoading } = useSellers({
    page,
    limit: PAGINATION_DEFAULTS.PAGE_SIZE,
    ...(debouncedSearch ? { search: debouncedSearch } : {}),
    ...(statusFilter !== 'ALL' ? { status: statusFilter } : {}),
  })

  const { data: counts } = useSellerStatusCounts()

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Sellers</h1>
          <p className="text-muted-foreground text-sm">Manage marketplace sellers</p>
        </div>
      </div>

      <div className="flex flex-wrap gap-1 border-b">
        {STATUS_TABS.map((tab) => (
          <button
            key={tab}
            onClick={() => {
              if (isSellerStatusFilter(tab)) {
                setStatusFilter(tab)
                setPage(1)
              }
            }}
            className={`px-3 py-2 text-sm font-medium transition-colors ${
              statusFilter === tab
                ? 'border-primary text-primary border-b-2'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            {tab}
            {counts && tab !== 'ALL' && counts[tab] != null && (
              <span className="text-muted-foreground ml-1.5 text-xs">({counts[tab]})</span>
            )}
          </button>
        ))}
      </div>

      <div>
        <input
          type="text"
          placeholder="Search by shop name or email..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value)
            debounceTimeout(e.target.value)
          }}
          className="border-input bg-background placeholder:text-muted-foreground focus-visible:ring-ring flex h-9 w-full max-w-sm rounded-md border px-3 py-1 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1"
        />
      </div>

      <div className="bg-card rounded-xl border shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-muted/50 border-b text-left">
                <th className="text-muted-foreground sticky top-0 px-4 py-3 font-medium">
                  Shop Name
                </th>
                <th className="text-muted-foreground sticky top-0 px-4 py-3 font-medium">
                  Owner Email
                </th>
                <th className="text-muted-foreground sticky top-0 px-4 py-3 font-medium">Status</th>
                <th className="text-muted-foreground sticky top-0 px-4 py-3 font-medium">
                  Created
                </th>
                <th className="text-muted-foreground sticky top-0 px-4 py-3 font-medium">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {isLoading
                ? Array.from({ length: 10 }).map((_, i) => (
                    <tr key={i} className="border-b">
                      {Array.from({ length: 5 }).map((_, j) => (
                        <td key={j} className="px-4 py-3">
                          <div className="bg-muted h-4 w-20 animate-pulse rounded" />
                        </td>
                      ))}
                    </tr>
                  ))
                : data?.items.map((seller) => (
                    <tr key={seller.id} className="hover:bg-muted/50 border-b">
                      <td className="px-4 py-3 font-medium">{seller.shopName}</td>
                      <td className="text-muted-foreground px-4 py-3">{getSellerEmail(seller) ?? '—'}</td>
                      <td className="px-4 py-3">
                        <StatusBadge status={seller.status} />
                      </td>
                      <td className="text-muted-foreground px-4 py-3">
                        {new Date(seller.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-4 py-3">
                        <Link
                          href={`/sellers/${seller.id}`}
                          className="text-primary text-sm font-medium hover:underline"
                        >
                          View
                        </Link>
                      </td>
                    </tr>
                  ))}
              {!isLoading && !data?.items.length && (
                <tr>
                  <td colSpan={5} className="text-muted-foreground px-4 py-8 text-center">
                    No sellers found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {data && data.meta.totalPages > 1 && (
          <div className="flex items-center justify-between border-t px-4 py-3">
            <span className="text-muted-foreground text-sm">
              Page {data.meta.page} of {data.meta.totalPages} ({data.meta.total} total)
            </span>
            <div className="flex gap-2">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page <= 1}
                className="rounded-md border px-3 py-1 text-sm disabled:opacity-50"
              >
                Previous
              </button>
              <button
                onClick={() => setPage((p) => p + 1)}
                disabled={page >= data.meta.totalPages}
                className="rounded-md border px-3 py-1 text-sm disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    ACTIVE: 'bg-green-100 text-green-700',
    PENDING: 'bg-yellow-100 text-yellow-700',
    SUSPENDED: 'bg-red-100 text-red-700',
    REJECTED: 'bg-gray-100 text-gray-700',
    BANNED: 'bg-red-200 text-red-800',
  }
  return (
    <span
      className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${styles[status] ?? 'bg-gray-100 text-gray-700'}`}
    >
      {status}
    </span>
  )
}
