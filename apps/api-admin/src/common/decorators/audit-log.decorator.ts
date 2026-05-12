import { SetMetadata } from '@nestjs/common'
import type { AuditActionType } from '@ecom/database'

export const AUDIT_LOG_KEY = 'audit_log'

export interface AuditLogMetadata {
  action: AuditActionType
  entityType: string
  entityIdParam?: string
  entityIdPath?: string
  metadataExtractor?: (result: unknown, body: unknown) => Record<string, unknown>
}

export const AuditLog = (
  action: AuditActionType,
  entityType: string,
  options?: {
    entityIdParam?: string
    entityIdPath?: string
    metadataExtractor?: (result: unknown, body: unknown) => Record<string, unknown>
  },
) => {
  const metadata: AuditLogMetadata = {
    action,
    entityType,
    ...(options?.entityIdParam !== undefined ? { entityIdParam: options.entityIdParam } : {}),
    ...(options?.entityIdPath !== undefined ? { entityIdPath: options.entityIdPath } : {}),
    ...(options?.metadataExtractor !== undefined
      ? { metadataExtractor: options.metadataExtractor }
      : {}),
  }
  return SetMetadata(AUDIT_LOG_KEY, metadata)
}
