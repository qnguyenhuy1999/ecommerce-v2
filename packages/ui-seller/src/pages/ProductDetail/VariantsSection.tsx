'use client'

import { Button, Input } from '@ecom/core-ui'
import { Plus, X } from 'lucide-react'
import { SectionCard } from '../../atoms/SectionCard'
import { useProductEditorVariants } from './ProductDetail.context'
import type { ProductDetailOptionGroup } from './ProductDetail.types'
import type { VariantDraft, VariantRow } from './ProductDetail.utils'

function VariantOptionGroupEditor({
  group,
  draftValue,
  setDraftValue,
  handleOptionGroupChange,
  handleRemoveOptionGroup,
  handleAddOptionValue,
  handleRemoveOptionValue,
}: {
  group: ProductDetailOptionGroup
  draftValue: string
  setDraftValue: (groupId: string, value: string) => void
  handleOptionGroupChange: (groupId: string, nextGroup: ProductDetailOptionGroup) => void
  handleRemoveOptionGroup: (groupId: string) => void
  handleAddOptionValue: (groupId: string) => void
  handleRemoveOptionValue: (groupId: string, value: string) => void
}) {
  return (
    <div className="bg-muted/45 space-y-3 rounded-2xl border px-3 py-3">
      <div className="flex items-start gap-3">
        <Input
          value={group.name}
          onChange={(event) =>
            handleOptionGroupChange(group.id, { ...group, name: event.target.value })
          }
          className="bg-background max-w-56"
        />
        <button
          type="button"
          onClick={() => handleRemoveOptionGroup(group.id)}
          className="text-muted-foreground hover:text-foreground ml-auto rounded-full p-2 transition-colors"
          aria-label={`Remove ${group.name || 'option group'}`}
        >
          <X className="size-4" />
        </button>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        {group.values.map((value) => (
          <button
            key={value}
            type="button"
            onClick={() => handleRemoveOptionValue(group.id, value)}
            className="bg-background hover:border-foreground/20 inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-sm transition-colors"
          >
            {value}
            <X className="text-muted-foreground size-3.5" />
          </button>
        ))}

        <div className="flex items-center gap-2">
          <Input
            value={draftValue}
            onChange={(event) => setDraftValue(group.id, event.target.value)}
            onKeyDown={(event) => {
              if (event.key === 'Enter') {
                event.preventDefault()
                handleAddOptionValue(group.id)
              }
            }}
            placeholder="Add value"
            className="bg-background h-9 w-32"
          />
          <Button
            type="button"
            size="sm"
            variant="outline"
            onClick={() => handleAddOptionValue(group.id)}
          >
            <Plus />
            Add
          </Button>
        </div>
      </div>
    </div>
  )
}

function VariantRowsTable({
  optionGroups,
  variantRows,
  handleVariantDraftChange,
}: {
  optionGroups: ProductDetailOptionGroup[]
  variantRows: VariantRow[]
  handleVariantDraftChange: (key: string, field: keyof VariantDraft, value: string) => void
}) {
  const populatedGroups = optionGroups.filter(
    (group) => group.name.trim() && group.values.length > 0,
  )
  const columnCount = Math.max(3, populatedGroups.length + 3)

  return (
    <div className="overflow-hidden rounded-2xl border">
      <div className="overflow-x-auto">
        <table className="w-full min-w-180 text-sm">
          <thead className="bg-muted/60 text-left uppercase">
            <tr>
              {populatedGroups.map((group) => (
                <th key={group.id} className="px-4 py-3 text-xs font-semibold tracking-wide">
                  {group.name}
                </th>
              ))}
              <th className="px-4 py-3 text-xs font-semibold tracking-wide">SKU</th>
              <th className="px-4 py-3 text-xs font-semibold tracking-wide">Price</th>
              <th className="px-4 py-3 text-xs font-semibold tracking-wide">Stock</th>
            </tr>
          </thead>
          <tbody>
            {variantRows.length === 0 ? (
              <tr>
                <td colSpan={columnCount} className="text-muted-foreground px-4 py-6 text-center">
                  Add at least one option group with values to generate variants.
                </td>
              </tr>
            ) : (
              variantRows.map((row) => (
                <tr key={row.key} className="border-t">
                  {row.values.map((value, index) => (
                    <td key={`${row.key}-${index}`} className="px-4 py-3 font-medium">
                      {value}
                    </td>
                  ))}
                  <td className="px-4 py-3">
                    <Input
                      value={row.draft.sku}
                      onChange={(event) =>
                        handleVariantDraftChange(row.key, 'sku', event.target.value)
                      }
                    />
                  </td>
                  <td className="px-4 py-3">
                    <Input
                      value={row.draft.price}
                      onChange={(event) =>
                        handleVariantDraftChange(row.key, 'price', event.target.value)
                      }
                      inputMode="decimal"
                    />
                  </td>
                  <td className="px-4 py-3">
                    <Input
                      value={row.draft.stock}
                      onChange={(event) =>
                        handleVariantDraftChange(row.key, 'stock', event.target.value)
                      }
                      inputMode="numeric"
                    />
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export function VariantsSection() {
  const {
    optionGroups,
    variantRows,
    draftValueInputs,
    setDraftValueInputs,
    handleOptionGroupChange,
    handleRemoveOptionGroup,
    handleAddOptionGroup,
    handleAddOptionValue,
    handleRemoveOptionValue,
    handleVariantDraftChange,
  } = useProductEditorVariants()

  return (
    <SectionCard title="Variants" subtitle="Define options to auto-generate SKU rows below.">
      <div className="space-y-4">
        {optionGroups.map((group) => (
          <VariantOptionGroupEditor
            key={group.id}
            group={group}
            draftValue={draftValueInputs[group.id] ?? ''}
            setDraftValue={setDraftValueInputs}
            handleOptionGroupChange={handleOptionGroupChange}
            handleRemoveOptionGroup={handleRemoveOptionGroup}
            handleAddOptionValue={handleAddOptionValue}
            handleRemoveOptionValue={handleRemoveOptionValue}
          />
        ))}

        <Button type="button" variant="outline" onClick={handleAddOptionGroup}>
          <Plus />
          Add option group
        </Button>

        <VariantRowsTable
          optionGroups={optionGroups}
          variantRows={variantRows}
          handleVariantDraftChange={handleVariantDraftChange}
        />
      </div>
    </SectionCard>
  )
}
