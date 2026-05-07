'use client';

import { useState, useCallback } from 'react';
import Link from 'next/link';
import { createColumnHelper } from '@tanstack/react-table';
import { DataTable, StatusBadge, TableToolbar, StatusTabs } from '@/components/data-table/data-table';
import { useOrders, useOrderStatusCounts } from '../hooks/use-orders';
import type { OrderListItem } from '../api/orders.api';

const col = createColumnHelper<OrderListItem>();

const columns = [
  col.accessor('id', {
    header: 'Order ID',
    cell: (info) => (
      <Link href={`/orders/${info.getValue()}`} className="font-medium hover:underline font-mono text-xs">
        {info.getValue().slice(0, 8)}...
      </Link>
    ),
  }),
  col.accessor('totalAmount', {
    header: 'Total',
    cell: (info) => `$${Number(info.getValue()).toFixed(2)}`,
  }),
  col.accessor('status', {
    header: 'Status',
    cell: (info) => <StatusBadge status={info.getValue()} />,
  }),
  col.accessor((row) => row.sellerOrders.length, { id: 'sellers', header: 'Sellers' }),
  col.accessor('createdAt', {
    header: 'Created',
    cell: (info) => new Date(info.getValue()).toLocaleDateString(),
  }),
];

const STATUS_TABS = ['ALL', 'PENDING', 'CONFIRMED', 'PACKING', 'SHIPPED', 'DELIVERED', 'CANCELLED'];

export function OrdersPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');

  const debounce = useCallback(() => {
    let timer: ReturnType<typeof setTimeout>;
    return (value: string) => {
      clearTimeout(timer);
      timer = setTimeout(() => { setDebouncedSearch(value); setPage(1); }, 300);
    };
  }, [])();

  const { data, isLoading } = useOrders({
    page, pageSize: 20,
    search: debouncedSearch || undefined,
    status: statusFilter === 'ALL' ? undefined : statusFilter,
  });
  const { data: counts } = useOrderStatusCounts();

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Orders</h1>
        <p className="text-sm text-muted-foreground">Manage marketplace orders</p>
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
            placeholder="Search orders..."
          />
        }
      />
    </div>
  );
}
