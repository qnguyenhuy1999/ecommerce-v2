import { z } from 'zod';
import { OrderStatus, PaymentStatus } from '@ecom/constants';

export const OrderStatusSchema = z.nativeEnum(OrderStatus);
export const PaymentStatusSchema = z.nativeEnum(PaymentStatus);

export const OrderSchema = z.object({
  id: z.string().uuid(),
  userId: z.string().uuid(),
  status: OrderStatusSchema,
  totalAmount: z.number().nonnegative(),
  items: z.array(z.object({
    productId: z.string().uuid(),
    quantity: z.number().int().positive(),
    price: z.number().nonnegative(),
  })),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export type Order = z.infer<typeof OrderSchema>;
