'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  getCategories,
  getCategory,
  createCategory,
  updateCategory,
  deleteCategory,
} from '../api/categories.api'

export function useCategories(parentId?: string) {
  return useQuery({
    queryKey: ['categories', parentId],
    queryFn: async () => {
      const res = await getCategories(parentId)
      return res.data
    },
  })
}

export function useCategory(id: string) {
  return useQuery({
    queryKey: ['category', id],
    queryFn: async () => {
      const res = await getCategory(id)
      return res.data
    },
    enabled: !!id,
  })
}

function useInvalidateCategories() {
  const qc = useQueryClient()
  return () => {
    void qc.invalidateQueries({ queryKey: ['categories'] })
    void qc.invalidateQueries({ queryKey: ['category'] })
  }
}

export function useCreateCategory() {
  const invalidate = useInvalidateCategories()
  return useMutation({ mutationFn: createCategory, onSuccess: invalidate })
}

export function useUpdateCategory() {
  const invalidate = useInvalidateCategories()
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Record<string, unknown> }) =>
      updateCategory(id, data),
    onSuccess: invalidate,
  })
}

export function useDeleteCategory() {
  const invalidate = useInvalidateCategories()
  return useMutation({ mutationFn: deleteCategory, onSuccess: invalidate })
}
