'use client';

import { useProduct, useApproveProduct, useRejectProduct, useHideProduct, useUnhideProduct } from '../hooks/use-products';
import { StatusBadge } from '@/components/data-table/data-table';

export function ProductDetailPage({ id }: { id: string }) {
  const { data: product, isLoading } = useProduct(id);
  const approve = useApproveProduct();
  const reject = useRejectProduct();
  const hide = useHideProduct();
  const unhide = useUnhideProduct();

  if (isLoading) {
    return <div className="space-y-4">{Array.from({ length: 4 }).map((_, i) => (
      <div key={i} className="h-20 animate-pulse rounded-xl bg-muted" />
    ))}</div>;
  }

  if (!product) return <p className="text-muted-foreground">Product not found</p>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">{product.name}</h1>
          <p className="text-sm text-muted-foreground">by {product.shop.name}</p>
        </div>
        <div className="flex items-center gap-2">
          <StatusBadge status={product.status} />
          {product.status === 'DRAFT' && (
            <>
              <button onClick={() => approve.mutate({ id })} className="rounded bg-green-600 px-3 py-1.5 text-sm text-white hover:bg-green-700">Approve</button>
              <button onClick={() => reject.mutate({ id })} className="rounded bg-red-600 px-3 py-1.5 text-sm text-white hover:bg-red-700">Reject</button>
            </>
          )}
          {product.status === 'PUBLISHED' && (
            <button onClick={() => hide.mutate(id)} className="rounded border px-3 py-1.5 text-sm hover:bg-muted">Hide</button>
          )}
          {product.status === 'ARCHIVED' && (
            <button onClick={() => unhide.mutate(id)} className="rounded border px-3 py-1.5 text-sm hover:bg-muted">Unhide</button>
          )}
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="rounded-xl border bg-card p-6 shadow-sm">
          <h2 className="mb-4 font-semibold">Product Info</h2>
          <dl className="space-y-2 text-sm">
            <div className="flex justify-between"><dt className="text-muted-foreground">SKU</dt><dd>{product.baseSku ?? '—'}</dd></div>
            <div className="flex justify-between"><dt className="text-muted-foreground">Price</dt><dd>{product.basePrice ? `$${Number(product.basePrice).toFixed(2)}` : '—'}</dd></div>
            <div className="flex justify-between"><dt className="text-muted-foreground">Stock</dt><dd>{product.baseStock}</dd></div>
            <div className="flex justify-between"><dt className="text-muted-foreground">Category</dt><dd>{product.category?.name ?? '—'}</dd></div>
            <div className="flex justify-between"><dt className="text-muted-foreground">Weight</dt><dd>{product.weight ? `${product.weight} kg` : '—'}</dd></div>
          </dl>
        </div>

        <div className="rounded-xl border bg-card p-6 shadow-sm">
          <h2 className="mb-4 font-semibold">Images</h2>
          {product.images.length > 0 ? (
            <div className="grid grid-cols-3 gap-2">
              {product.images.map((img, i) => (
                <div key={i} className="aspect-square overflow-hidden rounded-lg border bg-muted">
                  <img src={img.url} alt="" className="h-full w-full object-cover" />
                </div>
              ))}
            </div>
          ) : <p className="text-sm text-muted-foreground">No images</p>}
        </div>
      </div>

      {product.description && (
        <div className="rounded-xl border bg-card p-6 shadow-sm">
          <h2 className="mb-2 font-semibold">Description</h2>
          <p className="text-sm text-muted-foreground whitespace-pre-wrap">{product.description}</p>
        </div>
      )}

      {product.hasVariants && product.variants.length > 0 && (
        <div className="rounded-xl border bg-card shadow-sm">
          <div className="border-b px-6 py-4"><h2 className="font-semibold">Variants ({product.variants.length})</h2></div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-muted/50 text-left">
                  <th className="px-4 py-3 font-medium text-muted-foreground">Variant</th>
                  <th className="px-4 py-3 font-medium text-muted-foreground">SKU</th>
                  <th className="px-4 py-3 font-medium text-muted-foreground">Price</th>
                  <th className="px-4 py-3 font-medium text-muted-foreground">Stock</th>
                  <th className="px-4 py-3 font-medium text-muted-foreground">Active</th>
                </tr>
              </thead>
              <tbody>
                {product.variants.map((v) => (
                  <tr key={v.id} className="border-b">
                    <td className="px-4 py-3 font-medium">
                      {v.optionValues.map((ov) => `${ov.option.group.name}: ${ov.option.value}`).join(', ') || '—'}
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">{v.sku ?? '—'}</td>
                    <td className="px-4 py-3">${Number(v.price).toFixed(2)}</td>
                    <td className="px-4 py-3">{v.stock}</td>
                    <td className="px-4 py-3"><StatusBadge status={v.isActive ? 'ACTIVE' : 'INACTIVE'} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
