import { SetMetadata } from '@nestjs/common'
import type { AdminPermission } from '@ecom/database'

export const PERMISSIONS_KEY = 'permissions'
export const Permissions = (...permissions: (AdminPermission | keyof typeof AdminPermission)[]) =>
  SetMetadata(PERMISSIONS_KEY, permissions)
