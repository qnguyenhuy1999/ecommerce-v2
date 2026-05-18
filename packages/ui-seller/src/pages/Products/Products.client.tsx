'use client'

import { DataTable, StatusTabs, TableToolbar } from '@ecom/core-ui'
import { useState } from 'react'
import { productsDefaultProps } from './Products.fixtures'
import type { ProductRow, ProductsProps, ProductsStatusTab } from './Products.types'
import {
  buildProductStatusCounts,
  filterProductsBySearchAndStatus,
  isProductsStatusTab,
  productsColumns,
} from './Products.utils'

interface ProductsClientProps {
  products: ProductRow[]
  columns?: ProductsProps['columns']
  statusTabs?: ProductsProps['statusTabs']
  status?: ProductsProps['status']
  defaultStatus?: ProductsProps['defaultStatus']
  onStatusChange?: ProductsProps['onStatusChange']
  statusCounts?: ProductsProps['statusCounts']
  searchPlaceholder?: ProductsProps['searchPlaceholder']
  emptyMessage?: ProductsProps['emptyMessage']
  filterProducts?: ProductsProps['filterProducts']
}

export function ProductsClient({
  products,
  columns = productsColumns,
  statusTabs = productsDefaultProps.statusTabs,
  status,
  defaultStatus = productsDefaultProps.defaultStatus,
  onStatusChange,
  statusCounts,
  searchPlaceholder = productsDefaultProps.searchPlaceholder,
  emptyMessage = productsDefaultProps.emptyMessage,
  filterProducts = filterProductsBySearchAndStatus,
}: ProductsClientProps) {
  const [search, setSearch] = useState('')
  const [internalStatus, setInternalStatus] = useState<ProductsStatusTab>(defaultStatus)

  const currentStatus = status ?? internalStatus

  const counts = statusCounts ?? buildProductStatusCounts(products)
  const filteredProducts = filterProducts({ products, search, status: currentStatus })

  return (
    <DataTable
      columns={columns}
      data={filteredProducts}
      enableRowSelection
      toolbar={
        <TableToolbar search={search} onSearchChange={setSearch} placeholder={searchPlaceholder}>
          <StatusTabs
            tabs={statusTabs}
            value={currentStatus}
            onChange={(tab) => {
              if (isProductsStatusTab(tab)) {
                if (status === undefined) {
                  setInternalStatus(tab)
                }

                onStatusChange?.(tab)
              }
            }}
            counts={counts}
          />
        </TableToolbar>
      }
      emptyMessage={emptyMessage}
    />
  )
}
