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
              className="h-9 border border-slate-200 px-3 text-sm font-medium data-[state=on]:bg-slate-100 data-[state=on]:text-slate-900"
            >
              Low stock only
            </Toggle>
            <Button
              variant="outline"
              size="sm"
              className="h-9 gap-1 border-slate-200 text-sm font-medium"
            >
              All warehouses <ChevronDown className="h-4 w-4 text-slate-500" />
            </Button>
          </div>
        </TableToolbar>
      }
      emptyMessage={emptyMessage}
    />
  )
}
