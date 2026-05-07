'use client';

import { useState, useCallback } from 'react';
import Link from 'next/link';
import { useSellers, useSellerStatusCounts } from '../hooks/use-sellers';

const STATUS_TABS = ['ALL', 'PENDING', 'ACTIVE', 'SUSPENDED', 'REJECTED', 'BANNED'] as const;

export function SellersPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');

  const debounceTimeout = useCallback(() => {
    let timer: ReturnType<typeof setTimeout>;
    return (value: string) => {
      clearTimeout(timer);
      timer = setTimeout(() => {
        setDebouncedSearch(value);
        setPage(1);
      }, 300);
    };
  }, [])();

  const { data, isLoading } = useSellers({
    page,
    pageSize: 20,
    search: debouncedSearch || undefined,
    status: statusFilter === 'ALL' ? undefined : statusFilter,
  });

  const { data: counts } = useSellerStatusCounts();

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Sellers</h1>
          <p className="text-sm text-muted-foreground">
            Manage marketplace sellers
          </p>
        </div>
      </div>

      <div className="flex flex-wrap gap-1 border-b">
        {STATUS_TABS.map((tab) => (
          <button
            key={tab}
            onClick={() => {
              setStatusFilter(tab);
              setPage(1);
            }}
            className={`px-3 py-2 text-sm font-medium transition-colors ${
              statusFilter === tab
                ? 'border-b-2 border-primary text-primary'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            {tab}
            {counts && tab !== 'ALL' && counts[tab] != null && (
              <span className="ml-1.5 text-xs text-muted-foreground">
                ({counts[tab]})
              </span>
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
            setSearch(e.target.value);
            debounceTimeout(e.target.value);
          }}
          className="flex h-9 w-full max-w-sm rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
        />
      </div>

      <div className="rounded-xl border bg-card shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b bg-muted/50 text-left">
                <th className="sticky top-0 px-4 py-3 font-medium text-muted-foreground">
                  Shop Name
                </th>
                <th className="sticky top-0 px-4 py-3 font-medium text-muted-foreground">
                  Owner Email
                </th>
                <th className="sticky top-0 px-4 py-3 font-medium text-muted-foreground">
                  Status
                </th>
                <th className="sticky top-0 px-4 py-3 font-medium text-muted-foreground">
                  Created
                </th>
                <th className="sticky top-0 px-4 py-3 font-medium text-muted-foreground">
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
                          <div className="h-4 w-20 animate-pulse rounded bg-muted" />
                        </td>
                      ))}
                    </tr>
                  ))
                : data?.items.map((seller) => (
                    <tr
                      key={seller.id}
                      className="border-b hover:bg-muted/50"
                    >
                      <td className="px-4 py-3 font-medium">
                        {seller.shopName}
                      </td>
                      <td className="px-4 py-3 text-muted-foreground">
                        {seller.user.email}
                      </td>
                      <td className="px-4 py-3">
                        <StatusBadge status={seller.status} />
                      </td>
                      <td className="px-4 py-3 text-muted-foreground">
                        {new Date(seller.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-4 py-3">
                        <Link
                          href={`/sellers/${seller.id}`}
                          className="text-sm font-medium text-primary hover:underline"
                        >
                          View
                        </Link>
                      </td>
                    </tr>
                  ))}
              {!isLoading && !data?.items.length && (
                <tr>
                  <td
                    colSpan={5}
                    className="px-4 py-8 text-center text-muted-foreground"
                  >
                    No sellers found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {data && data.meta.totalPages > 1 && (
          <div className="flex items-center justify-between border-t px-4 py-3">
            <span className="text-sm text-muted-foreground">
              Page {data.meta.page} of {data.meta.totalPages} ({data.meta.total}{' '}
              total)
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
  );
}

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    ACTIVE: 'bg-green-100 text-green-700',
    PENDING: 'bg-yellow-100 text-yellow-700',
    SUSPENDED: 'bg-red-100 text-red-700',
    REJECTED: 'bg-gray-100 text-gray-700',
    BANNED: 'bg-red-200 text-red-800',
  };
  return (
    <span
      className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${styles[status] ?? 'bg-gray-100 text-gray-700'}`}
    >
      {status}
    </span>
  );
}
