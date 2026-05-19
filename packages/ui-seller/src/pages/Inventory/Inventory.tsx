import { Button, ConsolePageLayout } from '@ecom/core-ui'
import { inventoryDefaultProps } from './Inventory.fixtures'
import type { InventoryProps } from './Inventory.types'
import { InventoryClient } from './Inventory.client'
import { filterInventory as filterFn, inventoryColumns } from './Inventory.utils'

export function Inventory({
  title = inventoryDefaultProps.title,
  description = inventoryDefaultProps.description,
  exportHref = inventoryDefaultProps.exportHref,
  inventory = inventoryDefaultProps.inventory,
  columns = inventoryColumns,
  searchPlaceholder = inventoryDefaultProps.searchPlaceholder,
  emptyMessage = inventoryDefaultProps.emptyMessage,
  filterInventory = filterFn,
}: InventoryProps) {
  return (
    <ConsolePageLayout
      title={title}
      description={description}
      actions={
        <Button
          asChild
          size="sm"
          variant="outline"
          className="h-9 border-slate-200 bg-white text-sm font-medium"
        >
          <a href={exportHref}>Export</a>
        </Button>
      }
    >
      <InventoryClient
        inventory={inventory}
        columns={columns}
        searchPlaceholder={searchPlaceholder}
        emptyMessage={emptyMessage}
        filterInventory={filterInventory}
      />
    </ConsolePageLayout>
  )
}
