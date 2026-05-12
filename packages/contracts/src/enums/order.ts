// ─── Order Status ───────────────────────────────────────────────
export const OrderStatus = {
  PENDING: 'PENDING',
  CONFIRMED: 'CONFIRMED',
  PACKING: 'PACKING',
  SHIPPED: 'SHIPPED',
  DELIVERED: 'DELIVERED',
  CANCELLED: 'CANCELLED',
} as const

export type OrderStatus = (typeof OrderStatus)[keyof typeof OrderStatus]

// ─── Payment Status ─────────────────────────────────────────────
export const PaymentStatus = {
  PENDING: 'PENDING',
  PAID: 'PAID',
  FAILED: 'FAILED',
  REFUNDED: 'REFUNDED',
} as const

export type PaymentStatus = (typeof PaymentStatus)[keyof typeof PaymentStatus]

// ─── Refund Status ──────────────────────────────────────────────
export const RefundStatus = {
  PENDING: 'PENDING',
  APPROVED: 'APPROVED',
  REJECTED: 'REJECTED',
  COMPLETED: 'COMPLETED',
} as const

export type RefundStatus = (typeof RefundStatus)[keyof typeof RefundStatus]

// ─── Return Status ──────────────────────────────────────────────
export const ReturnStatus = {
  REQUESTED: 'REQUESTED',
  REVIEWING: 'REVIEWING',
  APPROVED: 'APPROVED',
  REJECTED: 'REJECTED',
  RETURN_SHIPPING: 'RETURN_SHIPPING',
  RECEIVED: 'RECEIVED',
  REFUNDED: 'REFUNDED',
  CLOSED: 'CLOSED',
} as const

export type ReturnStatus = (typeof ReturnStatus)[keyof typeof ReturnStatus]

// ─── Return Reason ──────────────────────────────────────────────
export const ReturnReason = {
  DEFECTIVE: 'DEFECTIVE',
  WRONG_ITEM: 'WRONG_ITEM',
  NOT_AS_DESCRIBED: 'NOT_AS_DESCRIBED',
  CHANGED_MIND: 'CHANGED_MIND',
  DAMAGED_IN_SHIPPING: 'DAMAGED_IN_SHIPPING',
  OTHER: 'OTHER',
} as const

export type ReturnReason = (typeof ReturnReason)[keyof typeof ReturnReason]

// ─── Refund Method ──────────────────────────────────────────────
export const RefundMethod = {
  ORIGINAL_PAYMENT: 'ORIGINAL_PAYMENT',
  STORE_CREDIT: 'STORE_CREDIT',
  BANK_TRANSFER: 'BANK_TRANSFER',
} as const

export type RefundMethod = (typeof RefundMethod)[keyof typeof RefundMethod]

// ─── Shipment Status ────────────────────────────────────────────
export const ShipmentStatus = {
  PENDING: 'PENDING',
  PICKED_UP: 'PICKED_UP',
  IN_TRANSIT: 'IN_TRANSIT',
  DELIVERED: 'DELIVERED',
  FAILED: 'FAILED',
} as const

export type ShipmentStatus = (typeof ShipmentStatus)[keyof typeof ShipmentStatus]
