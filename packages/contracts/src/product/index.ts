import { z } from 'zod';
import { ProductStatus } from '@ecom/constants';

export const ProductStatusSchema = z.nativeEnum(ProductStatus);

export const ProductSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1).max(255),
  description: z.string().optional(),
  price: z.number().positive(),
  status: ProductStatusSchema,
  stock: z.number().int().nonnegative(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export type Product = z.infer<typeof ProductSchema>;
