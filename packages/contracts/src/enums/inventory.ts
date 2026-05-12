// ─── Inventory Transaction Type ─────────────────────────────────
export const InventoryTransactionType = {
  STOCK_IN: 'STOCK_IN',
  STOCK_OUT: 'STOCK_OUT',
  RESERVATION: 'RESERVATION',
  RESERVATION_RELEASE: 'RESERVATION_RELEASE',
  ADJUSTMENT: 'ADJUSTMENT',
} as const

export type InventoryTransactionType =
  (typeof InventoryTransactionType)[keyof typeof InventoryTransactionType]

// ─── Inventory Transfer Status ──────────────────────────────────
export const InventoryTransferStatus = {
  PENDING: 'PENDING',
  IN_TRANSIT: 'IN_TRANSIT',
  COMPLETED: 'COMPLETED',
  CANCELLED: 'CANCELLED',
} as const

export type InventoryTransferStatus =
  (typeof InventoryTransferStatus)[keyof typeof InventoryTransferStatus]
