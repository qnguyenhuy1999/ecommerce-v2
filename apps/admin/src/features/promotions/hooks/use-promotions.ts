'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getVouchers, getVoucher, getVoucherStatusCounts, createVoucher, updateVoucher } from '../api/promotions.api';

export function useVouchers(params: { page?: number; pageSize?: number; status?: string; search?: string }) {
  return useQuery({
    queryKey: ['vouchers', params],
    queryFn: async () => { const res = await getVouchers(params); return res.data; },
  });
}

export function useVoucher(id: string) {
  return useQuery({
    queryKey: ['voucher', id],
    queryFn: async () => { const res = await getVoucher(id); return res.data; },
    enabled: !!id,
  });
}

export function useVoucherStatusCounts() {
  return useQuery({
    queryKey: ['voucher-status-counts'],
    queryFn: async () => { const res = await getVoucherStatusCounts(); return res.data; },
  });
}

function useInvalidateVouchers() {
  const qc = useQueryClient();
  return () => {
    qc.invalidateQueries({ queryKey: ['vouchers'] });
    qc.invalidateQueries({ queryKey: ['voucher'] });
    qc.invalidateQueries({ queryKey: ['voucher-status-counts'] });
  };
}

export function useCreateVoucher() {
  const invalidate = useInvalidateVouchers();
  return useMutation({ mutationFn: createVoucher, onSuccess: invalidate });
}

export function useUpdateVoucher() {
  const invalidate = useInvalidateVouchers();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Record<string, unknown> }) => updateVoucher(id, data),
    onSuccess: invalidate,
  });
}
