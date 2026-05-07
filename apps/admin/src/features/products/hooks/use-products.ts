'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getProducts, getProduct, getProductStatusCounts,
  approveProduct, rejectProduct, hideProduct, unhideProduct,
  bulkApproveProducts, bulkRejectProducts,
} from '../api/products.api';

export function useProducts(params: {
  page?: number; pageSize?: number; search?: string;
  status?: string; shopId?: string; categoryId?: string;
}) {
  return useQuery({
    queryKey: ['products', params],
    queryFn: async () => { const res = await getProducts(params); return res.data; },
  });
}

export function useProduct(id: string) {
  return useQuery({
    queryKey: ['product', id],
    queryFn: async () => { const res = await getProduct(id); return res.data; },
    enabled: !!id,
  });
}

export function useProductStatusCounts() {
  return useQuery({
    queryKey: ['product-status-counts'],
    queryFn: async () => { const res = await getProductStatusCounts(); return res.data; },
  });
}

function useInvalidateProducts() {
  const qc = useQueryClient();
  return () => {
    qc.invalidateQueries({ queryKey: ['products'] });
    qc.invalidateQueries({ queryKey: ['product'] });
    qc.invalidateQueries({ queryKey: ['product-status-counts'] });
  };
}

export function useApproveProduct() {
  const invalidate = useInvalidateProducts();
  return useMutation({
    mutationFn: ({ id, note }: { id: string; note?: string }) => approveProduct(id, note),
    onSuccess: invalidate,
  });
}

export function useRejectProduct() {
  const invalidate = useInvalidateProducts();
  return useMutation({
    mutationFn: ({ id, note }: { id: string; note?: string }) => rejectProduct(id, note),
    onSuccess: invalidate,
  });
}

export function useHideProduct() {
  const invalidate = useInvalidateProducts();
  return useMutation({ mutationFn: hideProduct, onSuccess: invalidate });
}

export function useUnhideProduct() {
  const invalidate = useInvalidateProducts();
  return useMutation({ mutationFn: unhideProduct, onSuccess: invalidate });
}

export function useBulkApproveProducts() {
  const invalidate = useInvalidateProducts();
  return useMutation({ mutationFn: bulkApproveProducts, onSuccess: invalidate });
}

export function useBulkRejectProducts() {
  const invalidate = useInvalidateProducts();
  return useMutation({ mutationFn: bulkRejectProducts, onSuccess: invalidate });
}
