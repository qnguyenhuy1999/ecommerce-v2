import { Button, ConsolePageLayout } from '@ecom/core-ui'
import { Download, Plus, Upload } from 'lucide-react'
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
  searchPlaceholder = productsDefaultProps.searchPlaceholder,
  emptyMessage = productsDefaultProps.emptyMessage,
  filterProducts = filterProductsBySearchAndStatus,
}: ProductsProps) {
  return (
    <ConsolePageLayout
      title={title}
      description={description}
      actions={
        <>
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
        </>
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
        searchPlaceholder={searchPlaceholder}
        emptyMessage={emptyMessage}
        filterProducts={filterProducts}
      />
    </ConsolePageLayout>
  )
}
