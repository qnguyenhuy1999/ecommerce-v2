'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getReviews, getReviewStatusCounts, approveReview, hideReview, rejectReview } from '../api/reviews.api';

export function useReviews(params: { page?: number; pageSize?: number; status?: string }) {
  return useQuery({
    queryKey: ['reviews', params],
    queryFn: async () => { const res = await getReviews(params); return res.data; },
  });
}

export function useReviewStatusCounts() {
  return useQuery({
    queryKey: ['review-status-counts'],
    queryFn: async () => { const res = await getReviewStatusCounts(); return res.data; },
  });
}

function useInvalidateReviews() {
  const qc = useQueryClient();
  return () => {
    qc.invalidateQueries({ queryKey: ['reviews'] });
    qc.invalidateQueries({ queryKey: ['review-status-counts'] });
  };
}

export function useApproveReview() {
  const invalidate = useInvalidateReviews();
  return useMutation({ mutationFn: approveReview, onSuccess: invalidate });
}

export function useHideReview() {
  const invalidate = useInvalidateReviews();
  return useMutation({ mutationFn: hideReview, onSuccess: invalidate });
}

export function useRejectReview() {
  const invalidate = useInvalidateReviews();
  return useMutation({ mutationFn: rejectReview, onSuccess: invalidate });
}
