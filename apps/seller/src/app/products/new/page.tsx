/* eslint-disable max-lines-per-function */
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { DashboardLayout } from '../../../components/dashboard-layout'
import { PageHeader } from '../../../components/page-header'
import { api, ApiError } from '../../../lib/api'
import type { SellerPaths } from '@ecom/contracts/generated'

type CreateProductResponse =
  SellerPaths['/products']['post']['responses']['201']['content']['application/json']

type CreateProductPayload = {
  name: string
  description?: string
  basePrice?: number
  baseSku?: string
  baseStock: number
  weight?: number
  status: string
}

export default function NewProductPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [basePrice, setBasePrice] = useState('')
  const [baseSku, setBaseSku] = useState('')
  const [baseStock, setBaseStock] = useState('')
  const [weight, setWeight] = useState('')
  const [status, setStatus] = useState('DRAFT')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const payload: CreateProductPayload = {
        name,
        ...(description ? { description } : {}),
        ...(basePrice ? { basePrice: parseFloat(basePrice) } : {}),
        ...(baseSku ? { baseSku } : {}),
        baseStock: baseStock ? parseInt(baseStock, 10) : 0,
        ...(weight ? { weight: parseFloat(weight) } : {}),
        status,
      }

      await api<CreateProductResponse>('/products', {
        method: 'POST',
        body: JSON.stringify(payload),
      })
      router.push('/products')
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Failed to create product')
    } finally {
      setLoading(false)
    }
  }

  return (
    <DashboardLayout>
      <PageHeader title="New Product" description="Add a new product to your catalog" />

      <div className="max-w-2xl">
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>
          )}

          <div className="space-y-4 rounded-lg border border-gray-200 bg-white p-6">
            <h2 className="text-lg font-semibold text-gray-900">Basic Information</h2>

            <div>
              <label htmlFor="name" className="mb-1 block text-sm font-medium text-gray-700">
                Product Name *
              </label>
              <input
                id="name"
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
                placeholder="Product name"
              />
            </div>

            <div>
              <label htmlFor="description" className="mb-1 block text-sm font-medium text-gray-700">
                Description
              </label>
              <textarea
                id="description"
                rows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full resize-none rounded-lg border border-gray-300 px-3 py-2 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
                placeholder="Product description"
              />
            </div>
          </div>

          <div className="space-y-4 rounded-lg border border-gray-200 bg-white p-6">
            <h2 className="text-lg font-semibold text-gray-900">Pricing & Inventory</h2>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor="basePrice" className="mb-1 block text-sm font-medium text-gray-700">
                  Price
                </label>
                <input
                  id="basePrice"
                  type="number"
                  step="0.01"
                  min="0"
                  value={basePrice}
                  onChange={(e) => setBasePrice(e.target.value)}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
                  placeholder="0.00"
                />
              </div>

              <div>
                <label htmlFor="baseSku" className="mb-1 block text-sm font-medium text-gray-700">
                  SKU
                </label>
                <input
                  id="baseSku"
                  type="text"
                  value={baseSku}
                  onChange={(e) => setBaseSku(e.target.value)}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
                  placeholder="SKU-001"
                />
              </div>

              <div>
                <label htmlFor="baseStock" className="mb-1 block text-sm font-medium text-gray-700">
                  Stock
                </label>
                <input
                  id="baseStock"
                  type="number"
                  min="0"
                  value={baseStock}
                  onChange={(e) => setBaseStock(e.target.value)}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
                  placeholder="0"
                />
              </div>

              <div>
                <label htmlFor="weight" className="mb-1 block text-sm font-medium text-gray-700">
                  Weight (g)
                </label>
                <input
                  id="weight"
                  type="number"
                  step="0.01"
                  min="0"
                  value={weight}
                  onChange={(e) => setWeight(e.target.value)}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
                  placeholder="0"
                />
              </div>
            </div>
          </div>

          <div className="space-y-4 rounded-lg border border-gray-200 bg-white p-6">
            <h2 className="text-lg font-semibold text-gray-900">Publishing</h2>
            <div>
              <label htmlFor="status" className="mb-1 block text-sm font-medium text-gray-700">
                Status
              </label>
              <select
                id="status"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="DRAFT">Draft</option>
                <option value="PUBLISHED">Published</option>
              </select>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="submit"
              disabled={loading}
              className="rounded-lg bg-blue-600 px-6 py-2 font-medium text-white transition-colors hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? 'Creating...' : 'Create Product'}
            </button>
            <button
              type="button"
              onClick={() => router.push('/products')}
              className="rounded-lg border border-gray-300 px-6 py-2 font-medium text-gray-700 transition-colors hover:bg-gray-50"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  )
}
