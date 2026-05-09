'use client';

import { useState } from 'react';
import { useCategories, useCreateCategory, useDeleteCategory, useUpdateCategory } from '../hooks/use-categories';
import { StatusBadge } from '@ecom/core-ui';
import type { CategoryNode } from '../api/categories.api';

export function CategoriesPage() {
  const { data: categories, isLoading } = useCategories();
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const createCategory = useCreateCategory();
  const deleteCategory = useDeleteCategory();
  const updateCategory = useUpdateCategory();

  const [formData, setFormData] = useState({ name: '', slug: '', parentId: '', description: '', isActive: true });

  const handleCreate = () => {
    createCategory.mutate({
      name: formData.name, slug: formData.slug,
      parentId: formData.parentId || undefined,
      description: formData.description || undefined,
      isActive: formData.isActive,
    }, {
      onSuccess: () => {
        setShowForm(false);
        setFormData({ name: '', slug: '', parentId: '', description: '', isActive: true });
      },
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Categories</h1>
          <p className="text-sm text-muted-foreground">Manage product category tree</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="rounded-md bg-primary px-4 py-2 text-sm text-primary-foreground hover:bg-primary/90"
        >
          Add Category
        </button>
      </div>

      {showForm && (
        <div className="rounded-xl border bg-card p-6 shadow-sm space-y-3">
          <h2 className="font-semibold">New Category</h2>
          <div className="grid gap-3 sm:grid-cols-2">
            <input placeholder="Name" value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value, slug: e.target.value.toLowerCase().replace(/\s+/g, '-') })}
              className="h-9 rounded-md border px-3 text-sm" />
            <input placeholder="Slug" value={formData.slug}
              onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
              className="h-9 rounded-md border px-3 text-sm" />
            <input placeholder="Parent ID (optional)" value={formData.parentId}
              onChange={(e) => setFormData({ ...formData, parentId: e.target.value })}
              className="h-9 rounded-md border px-3 text-sm" />
            <input placeholder="Description" value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="h-9 rounded-md border px-3 text-sm" />
          </div>
          <div className="flex gap-2">
            <button onClick={handleCreate} disabled={createCategory.isPending}
              className="rounded bg-primary px-4 py-1.5 text-sm text-primary-foreground hover:bg-primary/90 disabled:opacity-50">
              {createCategory.isPending ? 'Creating...' : 'Create'}
            </button>
            <button onClick={() => setShowForm(false)} className="rounded border px-4 py-1.5 text-sm hover:bg-muted">Cancel</button>
          </div>
        </div>
      )}

      <div className="rounded-xl border bg-card shadow-sm">
        {isLoading ? (
          <div className="p-6 space-y-3">{Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-8 animate-pulse rounded bg-muted" />
          ))}</div>
        ) : (
          <div className="divide-y">
            {categories?.map((cat) => (
              <CategoryTreeNode key={cat.id} node={cat} depth={0} selectedId={selectedId}
                onSelect={setSelectedId} onDelete={(id) => deleteCategory.mutate(id)}
                onToggleActive={(id, active) => updateCategory.mutate({ id, data: { isActive: !active } })} />
            ))}
            {categories?.length === 0 && (
              <p className="px-6 py-8 text-center text-muted-foreground">No categories yet</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function CategoryTreeNode({ node, depth, selectedId, onSelect, onDelete, onToggleActive }: {
  node: CategoryNode; depth: number; selectedId: string | null;
  onSelect: (id: string) => void;
  onDelete: (id: string) => void;
  onToggleActive: (id: string, active: boolean) => void;
}) {
  const [expanded, setExpanded] = useState(depth < 2);

  return (
    <div>
      <div
        className={`flex items-center gap-2 px-4 py-2.5 text-sm hover:bg-muted/50 cursor-pointer ${selectedId === node.id ? 'bg-muted' : ''}`}
        style={{ paddingLeft: `${16 + depth * 24}px` }}
        onClick={() => onSelect(node.id)}
      >
        {node.children.length > 0 && (
          <button onClick={(e) => { e.stopPropagation(); setExpanded(!expanded); }}
            className="text-muted-foreground hover:text-foreground">
            {expanded ? '▼' : '▶'}
          </button>
        )}
        <span className="font-medium">{node.name}</span>
        <span className="text-xs text-muted-foreground">({node._count.products})</span>
        <StatusBadge status={node.isActive ? 'ACTIVE' : 'INACTIVE'} />
        <div className="ml-auto flex gap-1">
          <button onClick={(e) => { e.stopPropagation(); onToggleActive(node.id, node.isActive); }}
            className="rounded px-2 py-0.5 text-xs text-muted-foreground hover:bg-muted">
            {node.isActive ? 'Deactivate' : 'Activate'}
          </button>
          <button onClick={(e) => { e.stopPropagation(); onDelete(node.id); }}
            className="rounded px-2 py-0.5 text-xs text-red-600 hover:bg-red-50">
            Delete
          </button>
        </div>
      </div>
      {expanded && node.children.map((child) => (
        <CategoryTreeNode key={child.id} node={child} depth={depth + 1}
          selectedId={selectedId} onSelect={onSelect} onDelete={onDelete} onToggleActive={onToggleActive} />
      ))}
    </div>
  );
}
