import { Button } from '@ecom/core-ui'
import { Download, Plus, Upload } from 'lucide-react'
import { SellerListPage } from '../../organisms/SellerListPage'
import { productsDefaultProps } from './Products.fixtures'
import type { ProductsProps } from './Products.types'
import { ProductsClient } from './Products.client'
import { filterProductsBySearchAndStatus, productsColumns } from './Products.utils'

export function Products({
  title = productsDefaultProps.title,
  description = productsDefaultProps.description,
  importHref = productsDefaultProps.importHref,
  exportHref = productsDefaultProps.exportHref,
  newProductHref = productsDefaultProps.newProductHref,
  products = productsDefaultProps.products,
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
}: ProductsProps) {
  return (
    <SellerListPage
      title={title}
      description={description}
      actions={
        <SellerListPage.Actions>
          <Button asChild size="sm" variant="outline">
            <a href={importHref}>
              <Upload />
              Import
            </a>
          </Button>
          <Button asChild size="sm" variant="outline">
            <a href={exportHref}>
              <Download />
              Export
            </a>
          </Button>
          <Button asChild size="sm">
            <a href={newProductHref}>
              <Plus />
              New product
            </a>
          </Button>
        </SellerListPage.Actions>
      }
    >
      <ProductsClient
        products={products}
        columns={columns}
        statusTabs={statusTabs}
        status={status}
        defaultStatus={defaultStatus}
        onStatusChange={onStatusChange}
        statusCounts={statusCounts}
        search={search}
        onSearchChange={onSearchChange}
        searchPlaceholder={searchPlaceholder}
        emptyMessage={emptyMessage}
        filterProducts={filterProducts}
      />
    </SellerListPage>
  )
}
