import type { ConsoleBreadcrumbItem } from '@ecom/core-ui'

export type OrderDetailStatus =
  | 'PENDING'
  | 'CONFIRMED'
  | 'PACKING'
  | 'SHIPPED'
  | 'DELIVERED'
  | 'CANCELLED'

export interface OrderDetailCustomer {
  name: string
  phone?: string
  address?: string
}

export interface OrderDetailItem {
  id: string
  image?: string
  productName: string
  productHref?: string
  variantLabel?: string
  sku?: string
  quantity: number
  unitPrice: number
  totalPrice: number
}

export interface OrderDetailShipment {
  status: string
  trackingNumber?: string
  providerName?: string
}

export interface OrderDetailAuditLog {
  id: string
  label: string
  timestamp: string
  note?: string
}

export interface OrderDetailRecord {
  id: string
  orderNumber: string
  status: OrderDetailStatus
  createdAt: string
  updatedAt?: string
  totalAmount: number
  subtotalAmount?: number
  shippingAmount?: number
  itemCount: number
  customer: OrderDetailCustomer
  items: OrderDetailItem[]
  shipment?: OrderDetailShipment
  auditLogs?: OrderDetailAuditLog[]
}

export interface OrderDetailStatusAction {
  id: string
  label: string
  nextStatus: OrderDetailStatus
}

export interface OrderDetailProps {
  title?: string
  description?: string
  breadcrumb?: ConsoleBreadcrumbItem[]
  backHref?: string
  order?: OrderDetailRecord | null
  loading?: boolean
  statusActions?: OrderDetailStatusAction[]
  emptyMessage?: string
  onStatusAction?: (nextStatus: OrderDetailStatus) => void | Promise<void>
  actionInFlight?: OrderDetailStatus | null
}
