'use client'

import { startTransition, useDeferredValue, useMemo } from 'react'
import { useControllableState } from '../../hooks'
import { SellerListPage } from '../../organisms/SellerListPage'
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
  search?: ProductsProps['search']
  onSearchChange?: ProductsProps['onSearchChange']
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
  search,
  onSearchChange,
  searchPlaceholder = productsDefaultProps.searchPlaceholder,
  emptyMessage = productsDefaultProps.emptyMessage,
  filterProducts = filterProductsBySearchAndStatus,
}: ProductsClientProps) {
  const [currentSearch, setCurrentSearch] = useControllableState({
    defaultValue: search ?? '',
    ...(search !== undefined ? { value: search } : {}),
    ...(onSearchChange !== undefined ? { onChange: onSearchChange } : {}),
  })
  const [currentStatus, setCurrentStatus] = useControllableState<ProductsStatusTab>({
    defaultValue: defaultStatus,
    ...(status !== undefined ? { value: status } : {}),
    ...(onStatusChange !== undefined ? { onChange: onStatusChange } : {}),
  })
  const deferredSearch = useDeferredValue(currentSearch)

  const counts = useMemo(
    () => statusCounts ?? buildProductStatusCounts(products),
    [products, statusCounts],
  )
  const filteredProducts = useMemo(
    () => filterProducts({ products, search: deferredSearch, status: currentStatus }),
    [currentStatus, deferredSearch, filterProducts, products],
  )

  return (
    <SellerListPage.Table
      columns={columns}
      data={filteredProducts}
      enableRowSelection
      toolbar={
        <SellerListPage.Filters>
          <SellerListPage.Search
            value={currentSearch}
            onChange={(value) => {
              startTransition(() => {
                setCurrentSearch(value)
              })
            }}
            placeholder={searchPlaceholder}
          />
          <SellerListPage.StatusTabs
            tabs={statusTabs}
            value={currentStatus}
            onChange={(tab) => {
              if (isProductsStatusTab(tab)) {
                startTransition(() => {
                  setCurrentStatus(tab)
                })
              }
            }}
            counts={counts}
          />
        </SellerListPage.Filters>
      }
      emptyMessage={emptyMessage}
    />
  )
}
