'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getRefunds, getRefund, getRefundStatusCounts, approveRefund, rejectRefund } from '../api/refunds.api';

export function useRefunds(params: { page?: number; pageSize?: number; status?: string }) {
  return useQuery({
    queryKey: ['refunds', params],
    queryFn: async () => { const res = await getRefunds(params); return res.data; },
  });
}

export function useRefund(id: string) {
  return useQuery({
    queryKey: ['refund', id],
    queryFn: async () => { const res = await getRefund(id); return res.data; },
    enabled: !!id,
  });
}

export function useRefundStatusCounts() {
  return useQuery({
    queryKey: ['refund-status-counts'],
    queryFn: async () => { const res = await getRefundStatusCounts(); return res.data; },
  });
}

function useInvalidateRefunds() {
  const qc = useQueryClient();
  return () => {
    qc.invalidateQueries({ queryKey: ['refunds'] });
    qc.invalidateQueries({ queryKey: ['refund'] });
    qc.invalidateQueries({ queryKey: ['refund-status-counts'] });
  };
}

export function useApproveRefund() {
  const invalidate = useInvalidateRefunds();
  return useMutation({
    mutationFn: ({ id, note }: { id: string; note?: string }) => approveRefund(id, note),
    onSuccess: invalidate,
  });
}

export function useRejectRefund() {
  const invalidate = useInvalidateRefunds();
  return useMutation({
    mutationFn: ({ id, note }: { id: string; note?: string }) => rejectRefund(id, note),
    onSuccess: invalidate,
  });
}
