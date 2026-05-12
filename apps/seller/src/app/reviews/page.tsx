/* eslint-disable max-lines-per-function */
'use client'

import { useState, useEffect } from 'react'
import { Search, Star, MessageSquare } from 'lucide-react'
import { DashboardLayout } from '../../components/dashboard-layout'
import { PageHeader } from '../../components/page-header'
import { DataTable } from '@ecom/core-ui'
import { StatusBadge } from '../../components/status-badge'
import { StatCard } from '@ecom/core-ui'
import { api } from '../../lib/api'

interface Review {
  id: string
  rating: number
  title: string | null
  comment: string | null
  status: string
  createdAt: string
  replies: { id: string; message: string }[]
  _count: { reports: number }
}

interface ReviewsResponse {
  data: Review[]
  meta: { page: number; limit: number; total: number; totalPages: number }
}

interface ReviewAnalytics {
  totalReviews: number
  averageRating: number
  ratingDistribution: { rating: number; count: number }[]
}

export default function ReviewsPage() {
  const [reviews, setReviews] = useState<Review[]>([])
  const [analytics, setAnalytics] = useState<ReviewAnalytics | null>(null)
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [ratingFilter, setRatingFilter] = useState('')
  const [replyFilter, setReplyFilter] = useState('')
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [replyingTo, setReplyingTo] = useState<string | null>(null)
  const [replyText, setReplyText] = useState('')
  const [refreshKey, setRefreshKey] = useState(0)

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      try {
        const [reviewsRes, analyticsRes] = await Promise.all([
          api<ReviewsResponse>('/reviews', {
            params: {
              page,
              limit: 20,
              search: search || undefined,
              rating: ratingFilter || undefined,
              replyFilter: replyFilter || undefined,
            },
          }),
          api<ReviewAnalytics>('/reviews/analytics'),
        ])
        setReviews(reviewsRes.data)
        setTotalPages(reviewsRes.meta.totalPages)
        setAnalytics(analyticsRes)
      } catch {
        /* empty */
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [page, search, ratingFilter, replyFilter, refreshKey])

  const handleReply = async (reviewId: string) => {
    if (!replyText.trim()) return
    try {
      await api(`/reviews/${reviewId}/reply`, {
        method: 'POST',
        body: JSON.stringify({ message: replyText }),
      })
      setReplyingTo(null)
      setReplyText('')
      setRefreshKey((k) => k + 1)
    } catch {
      /* empty */
    }
  }

  const renderStars = (rating: number) => (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((i) => (
        <Star
          key={i}
          className={`h-4 w-4 ${i <= rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
        />
      ))}
    </div>
  )

  const columns = [
    {
      key: 'rating',
      header: 'Rating',
      render: (row: Review) => renderStars(row.rating),
    },
    {
      key: 'comment',
      header: 'Review',
      render: (row: Review) => (
        <div className="max-w-md">
          {row.title && <div className="text-sm font-medium">{row.title}</div>}
          <div className="truncate text-sm text-gray-600">{row.comment ?? '—'}</div>
        </div>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      render: (row: Review) => <StatusBadge status={row.status} />,
    },
    {
      key: 'replies',
      header: 'Reply',
      render: (row: Review) =>
        row.replies.length > 0 ? (
          <span className="text-sm text-green-600">Replied</span>
        ) : (
          <button
            onClick={() => setReplyingTo(row.id)}
            className="text-sm text-blue-600 hover:underline"
          >
            Reply
          </button>
        ),
    },
    {
      key: 'createdAt',
      header: 'Date',
      render: (row: Review) => new Date(row.createdAt).toLocaleDateString(),
    },
  ]

  return (
    <DashboardLayout>
      <PageHeader title="Reviews" description="Manage product reviews and ratings" />

      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard title="Total Reviews" value={analytics?.totalReviews ?? 0} icon={MessageSquare} />
        <StatCard
          title="Average Rating"
          value={(analytics?.averageRating ?? 0).toFixed(1)}
          icon={Star}
        />
        <div className="rounded-lg border border-gray-200 bg-white p-6">
          <p className="mb-2 text-sm font-medium text-gray-500">Rating Distribution</p>
          <div className="space-y-1">
            {[5, 4, 3, 2, 1].map((r) => {
              const count = analytics?.ratingDistribution.find((d) => d.rating === r)?.count ?? 0
              const total = analytics?.totalReviews ?? 1
              return (
                <div key={r} className="flex items-center gap-2 text-xs">
                  <span className="w-3">{r}</span>
                  <div className="h-2 flex-1 overflow-hidden rounded bg-gray-100">
                    <div
                      className="h-full rounded bg-yellow-400"
                      style={{ width: `${(count / total) * 100}%` }}
                    />
                  </div>
                  <span className="w-8 text-right text-gray-500">{count}</span>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      <div className="mb-4 flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search reviews..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value)
              setPage(1)
            }}
            className="w-full rounded-lg border border-gray-300 py-2 pl-10 pr-4 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <select
          value={ratingFilter}
          onChange={(e) => {
            setRatingFilter(e.target.value)
            setPage(1)
          }}
          className="rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">All Ratings</option>
          {[5, 4, 3, 2, 1].map((r) => (
            <option key={r} value={r}>
              {r} Stars
            </option>
          ))}
        </select>
        <select
          value={replyFilter}
          onChange={(e) => {
            setReplyFilter(e.target.value)
            setPage(1)
          }}
          className="rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">All Reviews</option>
          <option value="hasReply">With Reply</option>
          <option value="noReply">Without Reply</option>
        </select>
      </div>

      {replyingTo && (
        <div className="mb-4 rounded-lg border border-blue-200 bg-blue-50 p-4">
          <div className="flex gap-3">
            <textarea
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              placeholder="Write your reply..."
              className="flex-1 resize-none rounded-lg border border-gray-300 px-3 py-2 text-sm"
              rows={2}
            />
            <div className="flex flex-col gap-2">
              <button
                onClick={() => handleReply(replyingTo)}
                className="rounded bg-blue-600 px-4 py-1 text-sm text-white hover:bg-blue-700"
              >
                Send
              </button>
              <button
                onClick={() => {
                  setReplyingTo(null)
                  setReplyText('')
                }}
                className="rounded border border-gray-300 px-4 py-1 text-sm hover:bg-gray-50"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      <DataTable columns={columns} data={reviews} loading={loading} emptyMessage="No reviews yet" />

      {totalPages > 1 && (
        <div className="mt-4 flex items-center justify-center gap-2">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="rounded border border-gray-300 px-3 py-1 text-sm disabled:opacity-50"
          >
            Previous
          </button>
          <span className="text-sm text-gray-600">
            Page {page} of {totalPages}
          </span>
          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="rounded border border-gray-300 px-3 py-1 text-sm disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}
    </DashboardLayout>
  )
}
