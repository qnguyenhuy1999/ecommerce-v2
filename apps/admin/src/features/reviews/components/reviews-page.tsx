'use client';

import { useState } from 'react';
import { createColumnHelper } from '@tanstack/react-table';
import { ReviewStatus, PAGINATION_DEFAULTS } from '@ecom/constants';
import { DataTable, StatusBadge, StatusTabs } from '@/components/data-table/data-table';
import { useReviews, useReviewStatusCounts, useApproveReview, useHideReview, useRejectReview } from '../hooks/use-reviews';
import type { ReviewListItem } from '../api/reviews.api';

const col = createColumnHelper<ReviewListItem>();

const columns = [
  col.accessor('rating', {
    header: 'Rating',
    cell: (info) => <span className="font-medium">{'★'.repeat(info.getValue())}{'☆'.repeat(5 - info.getValue())}</span>,
  }),
  col.accessor('comment', {
    header: 'Comment',
    cell: (info) => <span className="line-clamp-2 max-w-xs text-sm">{info.getValue() ?? '—'}</span>,
  }),
  col.accessor('_count.reports', { header: 'Reports' }),
  col.accessor('status', { header: 'Status', cell: (info) => <StatusBadge status={info.getValue()} /> }),
  col.accessor('createdAt', {
    header: 'Created',
    cell: (info) => new Date(info.getValue()).toLocaleDateString(),
  }),
  col.display({
    id: 'actions',
    header: 'Actions',
    cell: function ActionCell({ row }) {
      const approve = useApproveReview();
      const hide = useHideReview();
      const reject = useRejectReview();
      const review = row.original;
      return (
        <div className="flex gap-1">
          {review.status === ReviewStatus.PENDING && (
            <button onClick={() => approve.mutate(review.id)}
              className="rounded bg-green-600 px-2 py-0.5 text-xs text-white hover:bg-green-700">Approve</button>
          )}
          {[ReviewStatus.PENDING, ReviewStatus.APPROVED].includes(review.status as ReviewStatus) && (
            <button onClick={() => hide.mutate(review.id)}
              className="rounded border px-2 py-0.5 text-xs hover:bg-muted">Hide</button>
          )}
          {review.status === ReviewStatus.PENDING && (
            <button onClick={() => reject.mutate(review.id)}
              className="rounded bg-red-600 px-2 py-0.5 text-xs text-white hover:bg-red-700">Reject</button>
          )}
        </div>
      );
    },
  }),
];

const STATUS_TABS: string[] = ['ALL', ...(Object.values(ReviewStatus) as string[])];

export function ReviewsPage() {
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState('ALL');

  const { data, isLoading } = useReviews({
    page, pageSize: PAGINATION_DEFAULTS.PAGE_SIZE,
    status: statusFilter === 'ALL' ? undefined : statusFilter,
  });
  const { data: counts } = useReviewStatusCounts();

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Reviews</h1>
        <p className="text-sm text-muted-foreground">Moderate user reviews & reports</p>
      </div>

      <StatusTabs tabs={STATUS_TABS} value={statusFilter} onChange={(t) => { setStatusFilter(t); setPage(1); }} counts={counts} />

      <DataTable columns={columns} data={data?.items ?? []} meta={data?.meta} loading={isLoading} onPageChange={setPage} />
    </div>
  );
}
