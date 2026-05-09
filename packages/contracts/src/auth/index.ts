import { z } from 'zod';
import { UserRole, UserStatus } from '@ecom/constants';

export const UserRoleSchema = z.nativeEnum(UserRole);
export const UserStatusSchema = z.nativeEnum(UserStatus);

export const AuthPayloadSchema = z.object({
  userId: z.string().uuid(),
  role: UserRoleSchema,
  email: z.string().email(),
});

export type AuthPayload = z.infer<typeof AuthPayloadSchema>;
