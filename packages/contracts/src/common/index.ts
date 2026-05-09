import { z } from 'zod';
import { PAGINATION_DEFAULTS } from '@ecom/constants';

export const PaginationQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(PAGINATION_DEFAULTS.MAX_PAGE_SIZE).default(PAGINATION_DEFAULTS.PAGE_SIZE),
});

export type PaginationQuery = z.infer<typeof PaginationQuerySchema>;

export const BaseResponseSchema = <T extends z.ZodTypeAny>(dataSchema: T) => z.object({
  success: z.boolean(),
  data: dataSchema,
  message: z.string().optional(),
  error: z.string().optional(),
});
