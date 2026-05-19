'use client'

import { DataTable, TableToolbar, Toggle, Button } from '@ecom/core-ui'
import { useState } from 'react'
import { ChevronDown } from 'lucide-react'
import { inventoryDefaultProps } from './Inventory.fixtures'
import type { InventoryRow, InventoryProps } from './Inventory.types'
import { filterInventory, inventoryColumns } from './Inventory.utils'

interface InventoryClientProps {
  inventory: InventoryRow[]
  columns?: InventoryProps['columns']
  searchPlaceholder?: InventoryProps['searchPlaceholder']
  emptyMessage?: InventoryProps['emptyMessage']
  filterInventory?: InventoryProps['filterInventory']
}

export function InventoryClient({
  inventory,
  columns = inventoryColumns,
  searchPlaceholder = inventoryDefaultProps.searchPlaceholder,
  emptyMessage = inventoryDefaultProps.emptyMessage,
  filterInventory: filterFn = filterInventory,
}: InventoryClientProps) {
  const [search, setSearch] = useState('')
  const [lowStockOnly, setLowStockOnly] = useState(false)

  const filteredInventory = filterFn({ inventory, search, lowStockOnly })

  return (
    <DataTable
      columns={columns}
      data={filteredInventory}
      enableRowSelection
      toolbar={
        <TableToolbar search={search} onSearchChange={setSearch} placeholder={searchPlaceholder}>
          <div className="flex items-center gap-2">
            <Toggle
              pressed={lowStockOnly}
              onPressedChange={setLowStockOnly}
              aria-label="Toggle low stock only"
              className="border-input data-[state=on]:bg-muted data-[state=on]:text-foreground h-9 border px-3 text-sm font-medium"
            >
              Low stock only
            </Toggle>
            <Button
              variant="outline"
              size="sm"
              className="border-input h-9 gap-1 text-sm font-medium"
            >
              All warehouses <ChevronDown className="text-muted-foreground h-4 w-4" />
            </Button>
          </div>
        </TableToolbar>
      }
      emptyMessage={emptyMessage}
    />
  )
}
