import { apiFetch } from '@/lib/api';

export interface CategoryNode {
  id: string; name: string; slug: string; parentId: string | null;
  sortOrder: number; isActive: boolean; description: string | null;
  icon: string | null; banner: string | null;
  children: CategoryNode[];
  _count: { products: number };
}

export interface CategoryDetail extends CategoryNode {
  parent: { id: string; name: string } | null;
  categoryAttributes: { categoryId: string; groupId: string; isRequired: boolean; isFilterable: boolean }[];
}

export async function getCategories(parentId?: string) {
  const query = parentId ? `?parentId=${parentId}` : '';
  return apiFetch<{ success: boolean; data: CategoryNode[] }>(`/admin/categories${query}`);
}

export async function getCategory(id: string) {
  return apiFetch<{ success: boolean; data: CategoryDetail }>(`/admin/categories/${id}`);
}

export async function createCategory(data: Record<string, unknown>) {
  return apiFetch<{ success: boolean; data: CategoryNode }>('/admin/categories', {
    method: 'POST', body: JSON.stringify(data),
  });
}

export async function updateCategory(id: string, data: Record<string, unknown>) {
  return apiFetch<{ success: boolean; data: CategoryNode }>(`/admin/categories/${id}`, {
    method: 'PUT', body: JSON.stringify(data),
  });
}

export async function deleteCategory(id: string) {
  return apiFetch<{ success: boolean }>(`/admin/categories/${id}`, { method: 'DELETE' });
}

export async function reorderCategories(items: { id: string; sortOrder: number }[]) {
  return apiFetch<{ success: boolean }>('/admin/categories/reorder', {
    method: 'POST', body: JSON.stringify({ items }),
  });
}
