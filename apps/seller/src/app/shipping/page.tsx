'use client'

import { useState, useEffect } from 'react'
import { DashboardLayout } from '../../components/dashboard-layout'
import { PageHeader } from '../../components/page-header'
import { api } from '../../lib/api'

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

export default function ShippingPage() {
  const [providers, setProviders] = useState<ShippingProvider[]>([])
  const [methods, setMethods] = useState<SellerMethod[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      try {
        const [providersRes, methodsRes] = await Promise.all([
          api<{ data: ShippingProvider[] }>('/shipping/providers'),
          api<{ data: SellerMethod[] }>('/shipping/methods'),
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
      const res = await api<{ data: SellerMethod }>(`/shipping/methods/${providerId}/toggle`, {
        method: 'POST',
        body: JSON.stringify({ isEnabled: enabled }),
      })
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
            <div key={i} className="h-20 bg-gray-200 rounded-lg" />
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
          <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
            <p className="text-gray-500">No shipping providers available</p>
          </div>
        ) : (
          providers.map((provider) => (
            <div key={provider.id} className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium text-gray-900">{provider.name}</h3>
                  <p className="text-sm text-gray-500">Code: {provider.code}</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isEnabled(provider.id)}
                    onChange={(e) => toggleProvider(provider.id, e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600" />
                </label>
              </div>
            </div>
          ))
        )}
      </div>
    </DashboardLayout>
  )
}
