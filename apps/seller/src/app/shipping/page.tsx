'use client'

import { useState, useEffect } from 'react'
import { DashboardLayout } from '../../components/dashboard-layout'
import { PageHeader } from '../../components/page-header'
import { api } from '../../lib/api'
import type { SellerPaths } from '@ecom/contracts/generated'

interface ShippingProvider {
  id: string
  name: string
  code: string
  isActive: boolean
}

interface SellerMethod {
  id: string
  providerId: string
  isEnabled: boolean
  provider: ShippingProvider
}

type ShippingProvidersResponse =
  SellerPaths['/shipping/providers']['get']['responses']['200']['content']['application/json'] & {
    data: ShippingProvider[]
  }
type ShippingMethodsResponse =
  SellerPaths['/shipping/methods']['get']['responses']['200']['content']['application/json'] & {
    data: SellerMethod[]
  }
type ToggleShippingMethodResponse =
  SellerPaths['/shipping/methods/{providerId}/toggle']['post']['responses']['200']['content']['application/json'] & {
    data: SellerMethod
  }

export default function ShippingPage() {
  const [providers, setProviders] = useState<ShippingProvider[]>([])
  const [methods, setMethods] = useState<SellerMethod[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      try {
        const [providersRes, methodsRes] = await Promise.all([
          api<ShippingProvidersResponse>('/shipping/providers'),
          api<ShippingMethodsResponse>('/shipping/methods'),
        ])
        setProviders(providersRes.data)
        setMethods(methodsRes.data)
      } catch {
        /* empty */
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  const isEnabled = (providerId: string) => {
    return methods.some((m) => m.providerId === providerId && m.isEnabled)
  }

  const toggleProvider = async (providerId: string, enabled: boolean) => {
    try {
      const res = await api<ToggleShippingMethodResponse>(
        `/shipping/methods/${providerId}/toggle`,
        {
          method: 'POST',
          body: JSON.stringify({ isEnabled: enabled }),
        },
      )
      setMethods((prev) => {
        const idx = prev.findIndex((m) => m.providerId === providerId)
        if (idx >= 0) {
          const updated = [...prev]
          updated[idx] = res.data
          return updated
        }
        return [...prev, res.data]
      })
    } catch {
      /* empty */
    }
  }

  if (loading) {
    return (
      <DashboardLayout>
        <PageHeader title="Shipping" description="Manage shipping providers" />
        <div className="animate-pulse space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-20 rounded-lg bg-gray-200" />
          ))}
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <PageHeader title="Shipping" description="Manage your shipping providers and methods" />

      <div className="space-y-4">
        {providers.length === 0 ? (
          <div className="rounded-lg border border-gray-200 bg-white p-12 text-center">
            <p className="text-gray-500">No shipping providers available</p>
          </div>
        ) : (
          providers.map((provider) => (
            <div key={provider.id} className="rounded-lg border border-gray-200 bg-white p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium text-gray-900">{provider.name}</h3>
                  <p className="text-sm text-gray-500">Code: {provider.code}</p>
                </div>
                <label className="relative inline-flex cursor-pointer items-center">
                  <input
                    type="checkbox"
                    checked={isEnabled(provider.id)}
                    onChange={(e) => toggleProvider(provider.id, e.target.checked)}
                    className="peer sr-only"
                  />
                  <div className="peer h-6 w-11 rounded-full bg-gray-200 after:absolute after:start-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-blue-600 peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rtl:peer-checked:after:-translate-x-full" />
                </label>
              </div>
            </div>
          ))
        )}
      </div>
    </DashboardLayout>
  )
}
