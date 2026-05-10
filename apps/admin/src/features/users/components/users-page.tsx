'use client';

import { useState, useCallback, useRef } from 'react';
import Link from 'next/link';
import { createColumnHelper } from '@tanstack/react-table';
import { UserStatus } from '@ecom/contracts';
import { PAGINATION_DEFAULTS } from '@ecom/shared/constants';
import { DataTable, StatusBadge, TableToolbar, StatusTabs } from '@ecom/core-ui';
import { useUsers, useUserStatusCounts } from '../hooks/use-users';
import type { UserListItem } from '../api/users.api';

const col = createColumnHelper<UserListItem>();

const columns = [
  col.accessor('email', {
    header: 'Email',
    cell: (info) => (
      <Link href={`/buyers/${info.row.original.id}`} className="font-medium hover:underline">
        {info.getValue()}
      </Link>
    ),
  }),
  col.accessor((row) => [row.firstName, row.lastName].filter(Boolean).join(' ') || '—', { id: 'name', header: 'Name' }),
  col.accessor('phone', {
    header: 'Phone',
    cell: (info) => info.getValue() ?? '—',
  }),
  col.accessor('emailVerified', {
    header: 'Verified',
    cell: (info) => info.getValue() ? 'Yes' : 'No',
  }),
  col.accessor('status', {
    header: 'Status',
    cell: (info) => <StatusBadge status={info.getValue()} />,
  }),
  col.accessor('createdAt', {
    header: 'Joined',
    cell: (info) => new Date(info.getValue()).toLocaleDateString(),
  }),
];

const STATUS_TABS: string[] = ['ALL', UserStatus.ACTIVE, UserStatus.SUSPENDED, UserStatus.BANNED];

export function UsersPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');

  const timerRef = useRef<ReturnType<typeof setTimeout>>(undefined);
  const debounce = useCallback((value: string) => {
    clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => { setDebouncedSearch(value); setPage(1); }, 300);
  }, []);

  const { data, isLoading } = useUsers({
    page, pageSize: PAGINATION_DEFAULTS.PAGE_SIZE,
    search: debouncedSearch || undefined,
    status: statusFilter === 'ALL' ? undefined : statusFilter,
  });
  const { data: counts } = useUserStatusCounts();

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Buyers</h1>
        <p className="text-sm text-muted-foreground">Manage platform users</p>
      </div>

      <StatusTabs tabs={STATUS_TABS} value={statusFilter} onChange={(t) => { setStatusFilter(t); setPage(1); }} counts={counts} />

      <DataTable
        columns={columns}
        data={data?.items ?? []}
        meta={data?.meta}
        loading={isLoading}
        onPageChange={setPage}
        toolbar={
          <TableToolbar
            search={search}
            onSearchChange={(v) => { setSearch(v); debounce(v); }}
            placeholder="Search users..."
          />
        }
      />
    </div>
  );
}
