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
  }, [page, search, ratingFilter, replyFilter])

  const handleReply = async (reviewId: string) => {
    if (!replyText.trim()) return
    try {
      await api(`/reviews/${reviewId}/reply`, {
        method: 'POST',
        body: JSON.stringify({ message: replyText }),
      })
      setReplyingTo(null)
      setReplyText('')
      setPage(page)
    } catch {
      /* empty */
    }
  }

  const renderStars = (rating: number) => (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((i) => (
        <Star
          key={i}
          className={`h-4 w-4 ${i <= rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`}
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
          {row.title && <div className="font-medium text-sm">{row.title}</div>}
          <div className="text-sm text-gray-600 truncate">{row.comment ?? '—'}</div>
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
          <span className="text-green-600 text-sm">Replied</span>
        ) : (
          <button
            onClick={() => setReplyingTo(row.id)}
            className="text-blue-600 text-sm hover:underline"
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

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <StatCard title="Total Reviews" value={analytics?.totalReviews ?? 0} icon={MessageSquare} />
        <StatCard
          title="Average Rating"
          value={(analytics?.averageRating ?? 0).toFixed(1)}
          icon={Star}
        />
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <p className="text-sm font-medium text-gray-500 mb-2">Rating Distribution</p>
          <div className="space-y-1">
            {[5, 4, 3, 2, 1].map((r) => {
              const count = analytics?.ratingDistribution.find((d) => d.rating === r)?.count ?? 0
              const total = analytics?.totalReviews ?? 1
              return (
                <div key={r} className="flex items-center gap-2 text-xs">
                  <span className="w-3">{r}</span>
                  <div className="flex-1 h-2 bg-gray-100 rounded overflow-hidden">
                    <div
                      className="h-full bg-yellow-400 rounded"
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

      <div className="flex flex-col sm:flex-row gap-3 mb-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search reviews..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value)
              setPage(1)
            }}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm"
          />
        </div>
        <select
          value={ratingFilter}
          onChange={(e) => {
            setRatingFilter(e.target.value)
            setPage(1)
          }}
          className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm"
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
          className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm"
        >
          <option value="">All Reviews</option>
          <option value="hasReply">With Reply</option>
          <option value="noReply">Without Reply</option>
        </select>
      </div>

      {replyingTo && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
          <div className="flex gap-3">
            <textarea
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              placeholder="Write your reply..."
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm resize-none"
              rows={2}
            />
            <div className="flex flex-col gap-2">
              <button
                onClick={() => handleReply(replyingTo)}
                className="px-4 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700"
              >
                Send
              </button>
              <button
                onClick={() => {
                  setReplyingTo(null)
                  setReplyText('')
                }}
                className="px-4 py-1 border border-gray-300 rounded text-sm hover:bg-gray-50"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      <DataTable columns={columns} data={reviews} loading={loading} emptyMessage="No reviews yet" />

      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-4">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="px-3 py-1 border border-gray-300 rounded text-sm disabled:opacity-50"
          >
            Previous
          </button>
          <span className="text-sm text-gray-600">
            Page {page} of {totalPages}
          </span>
          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="px-3 py-1 border border-gray-300 rounded text-sm disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}
    </DashboardLayout>
  )
}
