/**
 * Queue names used by the background job processor (apps/worker).
 * Centralised here so producers and consumers reference the same constants.
 */
export const QUEUES = {
  EMAIL: 'email',
  ORDER_PROCESSING: 'order-processing',
  INVENTORY_SYNC: 'inventory-sync',
  NOTIFICATION: 'notification',
  REPORT_GENERATION: 'report-generation',
  IMAGE_PROCESSING: 'image-processing',
  SEARCH_INDEX: 'search-index',
} as const

export type QueueName = (typeof QUEUES)[keyof typeof QUEUES]
