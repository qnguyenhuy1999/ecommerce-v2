'use client'

import { useUser, useSuspendUser, useBanUser, useActivateUser } from '../hooks/use-users'
import { StatusBadge } from '@ecom/core-ui'

export function UserDetailPage({ id }: { id: string }) {
  const { data: user, isLoading } = useUser(id)
  const suspend = useSuspendUser()
  const ban = useBanUser()
  const activate = useActivateUser()

  if (isLoading) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="h-20 animate-pulse rounded-xl bg-muted" />
        ))}
      </div>
    )
  }

  if (!user) return <p className="text-muted-foreground">User not found</p>

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">{user.email}</h1>
          <p className="text-sm text-muted-foreground">
            {[user.firstName, user.lastName].filter(Boolean).join(' ') || 'No name'}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <StatusBadge status={user.status} />
          {user.status === 'ACTIVE' && (
            <>
              <button
                onClick={() => suspend.mutate({ id })}
                className="rounded border px-3 py-1.5 text-sm text-yellow-700 hover:bg-yellow-50"
              >
                Suspend
              </button>
              <button
                onClick={() => ban.mutate({ id })}
                className="rounded bg-red-600 px-3 py-1.5 text-sm text-white hover:bg-red-700"
              >
                Ban
              </button>
            </>
          )}
          {['SUSPENDED', 'BANNED'].includes(user.status) && (
            <button
              onClick={() => activate.mutate(id)}
              className="rounded bg-green-600 px-3 py-1.5 text-sm text-white hover:bg-green-700"
            >
              Activate
            </button>
          )}
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="rounded-xl border bg-card p-6 shadow-sm">
          <h2 className="mb-4 font-semibold">Profile</h2>
          <dl className="space-y-2 text-sm">
            <div className="flex justify-between">
              <dt className="text-muted-foreground">Email</dt>
              <dd>{user.email}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-muted-foreground">Phone</dt>
              <dd>{user.phone ?? '—'}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-muted-foreground">Verified</dt>
              <dd>{user.emailVerified ? 'Yes' : 'No'}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-muted-foreground">Joined</dt>
              <dd>{new Date(user.createdAt).toLocaleDateString()}</dd>
            </div>
          </dl>
        </div>

        <div className="rounded-xl border bg-card p-6 shadow-sm">
          <h2 className="mb-4 font-semibold">Sessions ({user.sessions.length})</h2>
          {user.sessions.length > 0 ? (
            <div className="space-y-2">
              {user.sessions.map((s) => (
                <div key={s.id} className="rounded border p-2 text-xs">
                  <p className="truncate">{s.userAgent ?? 'Unknown device'}</p>
                  <p className="text-muted-foreground">
                    {s.ipAddress ?? '—'} · {new Date(s.createdAt).toLocaleDateString()}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">No active sessions</p>
          )}
        </div>
      </div>
    </div>
  )
}
