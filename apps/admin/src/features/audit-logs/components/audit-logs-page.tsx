'use client'

import { useState } from 'react'
import { PAGINATION_DEFAULTS } from '@ecom/shared/pagination/core'
import { useAuditLogs } from '../hooks/use-audit-logs'

export function AuditLogsPage() {
  const [page, setPage] = useState(1)
  const { data, isLoading } = useAuditLogs({ page, limit: PAGINATION_DEFAULTS.PAGE_SIZE })

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Audit Logs</h1>
        <p className="text-muted-foreground text-sm">Track all admin actions</p>
      </div>

      <div className="bg-card rounded-xl border shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-muted/50 border-b text-left">
                <th className="text-muted-foreground px-4 py-3 font-medium">Action</th>
                <th className="text-muted-foreground px-4 py-3 font-medium">Admin</th>
                <th className="text-muted-foreground px-4 py-3 font-medium">Entity</th>
                <th className="text-muted-foreground px-4 py-3 font-medium">IP Address</th>
                <th className="text-muted-foreground px-4 py-3 font-medium">Date</th>
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
                : data?.items.map((log) => (
                    <tr key={log.id} className="hover:bg-muted/50 border-b">
                      <td className="px-4 py-3">
                        <span className="bg-muted rounded px-1.5 py-0.5 font-mono text-xs">
                          {log.action}
                        </span>
                      </td>
                      <td className="text-muted-foreground px-4 py-3">
                        {log.admin ? `${log.admin.firstName} ${log.admin.lastName}` : 'System'}
                      </td>
                      <td className="text-muted-foreground px-4 py-3">
                        {log.entityType
                          ? `${log.entityType} ${log.entityId?.slice(0, 8) ?? ''}`
                          : '—'}
                      </td>
                      <td className="text-muted-foreground px-4 py-3 font-mono text-xs">
                        {log.ipAddress ?? '—'}
                      </td>
                      <td className="text-muted-foreground px-4 py-3">
                        {new Date(log.createdAt).toLocaleString()}
                      </td>
                    </tr>
                  ))}
              {!isLoading && !data?.items.length && (
                <tr>
                  <td colSpan={5} className="text-muted-foreground px-4 py-8 text-center">
                    No audit logs yet
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {data && data.meta.totalPages > 1 && (
          <div className="flex items-center justify-between border-t px-4 py-3">
            <span className="text-muted-foreground text-sm">
              Page {data.meta.page} of {data.meta.totalPages}
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
