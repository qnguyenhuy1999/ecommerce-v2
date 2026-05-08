import { SetMetadata } from '@nestjs/common'
import type { AuditActionType } from '@ecom/database'

export const AUDIT_LOG_KEY = 'audit_log'

export interface AuditLogMetadata {
  action: AuditActionType | string
  entityType: string
  entityIdParam?: string
  entityIdPath?: string
  metadataExtractor?: (result: unknown, body: unknown) => Record<string, unknown>
}

export const AuditLog = (
  action: AuditActionType | string,
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
    entityIdParam: options?.entityIdParam,
    entityIdPath: options?.entityIdPath,
    metadataExtractor: options?.metadataExtractor,
  }
  return SetMetadata(AUDIT_LOG_KEY, metadata)
}
