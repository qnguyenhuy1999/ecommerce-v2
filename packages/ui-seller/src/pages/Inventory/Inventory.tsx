import { Button } from '@ecom/core-ui'
import { SellerListPage } from '../../organisms/SellerListPage'
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
    <SellerListPage
      title={title}
      description={description}
      actions={
        <SellerListPage.Actions>
          <Button
            asChild
            size="sm"
            variant="outline"
            className="bg-background border-input h-9 text-sm font-medium"
          >
            <a href={exportHref}>Export</a>
          </Button>
        </SellerListPage.Actions>
      }
    >
      <InventoryClient
        inventory={inventory}
        columns={columns}
        searchPlaceholder={searchPlaceholder}
        emptyMessage={emptyMessage}
        filterInventory={filterInventory}
      />
    </SellerListPage>
  )
}
