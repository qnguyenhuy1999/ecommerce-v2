'use client'

import { useState } from 'react'
import {
  Button,
  Checkbox,
  ConsolePageLayout,
  Field,
  FieldContent,
  FieldDescription,
  FieldLabel,
  Input,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  StatusBadge,
  Textarea,
} from '@ecom/core-ui'
import { Eye, FileText, Plus, Send, X } from 'lucide-react'
import { ProductMediaUpload } from '../../molecules/ProductMediaUpload'
import { SectionCard } from '../../atoms/SectionCard'
import { cn } from '../../lib/utils'
import type {
  ProductDetailFormData,
  ProductDetailOptionGroup,
  ProductDetailProps,
  ProductDetailValidationItem,
  ProductDetailVisibilityOption,
} from './ProductDetail.types'
import {
  buildValidationItems,
  buildVariantRows,
  cloneOptionGroups,
  createVariantDraftMap,
  slugify,
  type VariantDraft,
  type VariantRow,
} from './ProductDetail.utils'

type ProductDetailClientProps = Required<ProductDetailProps>

function cloneVisibilityOptions(options: ProductDetailVisibilityOption[]) {
  return options.map((option) => ({ ...option }))
}

interface ProductSidebarProps {
  form: ProductDetailFormData
  statuses: ProductDetailClientProps['statuses']
  lastSavedLabel: string
  validationItems: ProductDetailValidationItem[]
  updateForm: <K extends keyof ProductDetailFormData>(
    key: K,
    value: ProductDetailFormData[K],
  ) => void
}

function ProductSidebar({
  form,
  statuses,
  lastSavedLabel,
  validationItems,
  updateForm,
}: ProductSidebarProps) {
  const validationCompleteCount = validationItems.filter((item) => item.complete).length

  return (
    <div className="space-y-4">
      <SectionCard title="Status">
        <div className="space-y-4">
          <StatusBadge status={form.status} />
          <Select
            value={form.status}
            onValueChange={(value) =>
              updateForm('status', value as ProductDetailFormData['status'])
            }
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent>
              {statuses.map((status) => (
                <SelectItem key={status} value={status}>
                  {status.replace(/_/g, ' ')}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <p className="text-muted-foreground text-sm">{lastSavedLabel}</p>
        </div>
      </SectionCard>

      <SectionCard title="Visibility">
        <div className="space-y-3">
          {form.visibility.map((option) => (
            <label key={option.id} className="flex items-center justify-between gap-3 text-sm">
              <span>{option.label}</span>
              <Checkbox
                checked={option.checked}
                onCheckedChange={(checked) =>
                  updateForm(
                    'visibility',
                    form.visibility.map((item) =>
                      item.id === option.id ? { ...item, checked: checked === true } : item,
                    ),
                  )
                }
                aria-label={option.label}
              />
            </label>
          ))}
        </div>
      </SectionCard>

      <SectionCard title="Validation summary">
        <div className="space-y-2 text-sm">
          {validationItems.map((item) => (
            <div
              key={item.id}
              className={cn(
                'flex items-start gap-2',
                item.complete ? 'text-success' : 'text-muted-foreground',
              )}
            >
              <span className="mt-0.5 text-xs">{item.complete ? '✓' : '·'}</span>
              <span>{item.label}</span>
            </div>
          ))}
          <p className="text-muted-foreground pt-2 text-xs">
            {validationCompleteCount} of {validationItems.length} checks completed
          </p>
        </div>
      </SectionCard>
    </div>
  )
}

interface BasicInfoSectionProps {
  form: ProductDetailFormData
  categories: ProductDetailClientProps['categories']
  brands: ProductDetailClientProps['brands']
  onNameChange: (value: string) => void
  updateForm: <K extends keyof ProductDetailFormData>(
    key: K,
    value: ProductDetailFormData[K],
  ) => void
}

function BasicInfoSection({
  form,
  categories,
  brands,
  onNameChange,
  updateForm,
}: BasicInfoSectionProps) {
  return (
    <SectionCard title="Basic info">
      <div className="grid gap-4">
        <Field>
          <FieldLabel>Product name *</FieldLabel>
          <FieldContent>
            <Input value={form.name} onChange={(event) => onNameChange(event.target.value)} />
          </FieldContent>
        </Field>

        <div className="grid gap-4 md:grid-cols-2">
          <Field>
            <FieldLabel>Category *</FieldLabel>
            <FieldContent>
              <Select
                value={form.category}
                onValueChange={(value) => updateForm('category', value)}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </FieldContent>
          </Field>

          <Field>
            <FieldLabel>Brand</FieldLabel>
            <FieldContent>
              <Select value={form.brand} onValueChange={(value) => updateForm('brand', value)}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select brand" />
                </SelectTrigger>
                <SelectContent>
                  {brands.map((brand) => (
                    <SelectItem key={brand} value={brand}>
                      {brand}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </FieldContent>
          </Field>
        </div>

        <Field>
          <FieldLabel>Short description</FieldLabel>
          <FieldContent>
            <Input
              value={form.shortDescription}
              onChange={(event) => updateForm('shortDescription', event.target.value)}
            />
          </FieldContent>
          <FieldDescription>Shown on product cards (up to 120 chars)</FieldDescription>
        </Field>

        <Field>
          <FieldLabel>Full description</FieldLabel>
          <FieldContent>
            <Textarea
              rows={5}
              value={form.fullDescription}
              onChange={(event) => updateForm('fullDescription', event.target.value)}
            />
          </FieldContent>
        </Field>
      </div>
    </SectionCard>
  )
}

interface VariantsSectionProps {
  optionGroups: ProductDetailOptionGroup[]
  variantRows: VariantRow[]
  draftValueInputs: Record<string, string>
  setDraftValueInputs: React.Dispatch<React.SetStateAction<Record<string, string>>>
  handleOptionGroupChange: (groupId: string, nextGroup: ProductDetailOptionGroup) => void
  handleRemoveOptionGroup: (groupId: string) => void
  handleAddOptionGroup: () => void
  handleAddOptionValue: (groupId: string) => void
  handleRemoveOptionValue: (groupId: string, value: string) => void
  handleVariantDraftChange: (key: string, field: keyof VariantDraft, value: string) => void
}

interface VariantOptionGroupEditorProps {
  group: ProductDetailOptionGroup
  draftValue: string
  setDraftValue: (groupId: string, value: string) => void
  handleOptionGroupChange: (groupId: string, nextGroup: ProductDetailOptionGroup) => void
  handleRemoveOptionGroup: (groupId: string) => void
  handleAddOptionValue: (groupId: string) => void
  handleRemoveOptionValue: (groupId: string, value: string) => void
}

function VariantOptionGroupEditor({
  group,
  draftValue,
  setDraftValue,
  handleOptionGroupChange,
  handleRemoveOptionGroup,
  handleAddOptionValue,
  handleRemoveOptionValue,
}: VariantOptionGroupEditorProps) {
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

interface VariantRowsTableProps {
  populatedGroups: ProductDetailOptionGroup[]
  variantRows: VariantRow[]
  handleVariantDraftChange: (key: string, field: keyof VariantDraft, value: string) => void
}

function VariantRowsTable({
  populatedGroups,
  variantRows,
  handleVariantDraftChange,
}: VariantRowsTableProps) {
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

function VariantsSection({
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
}: VariantsSectionProps) {
  const populatedGroups = optionGroups.filter(
    (group) => group.name.trim() && group.values.length > 0,
  )

  return (
    <SectionCard title="Variants" subtitle="Define options to auto-generate SKU rows below.">
      <div className="space-y-4">
        {optionGroups.map((group) => (
          <VariantOptionGroupEditor
            key={group.id}
            group={group}
            draftValue={draftValueInputs[group.id] ?? ''}
            setDraftValue={(groupId, value) =>
              setDraftValueInputs((current) => ({
                ...current,
                [groupId]: value,
              }))
            }
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
          populatedGroups={populatedGroups}
          variantRows={variantRows}
          handleVariantDraftChange={handleVariantDraftChange}
        />
      </div>
    </SectionCard>
  )
}

interface ShippingSectionProps {
  form: ProductDetailFormData
  updateForm: <K extends keyof ProductDetailFormData>(
    key: K,
    value: ProductDetailFormData[K],
  ) => void
}

function ShippingSection({ form, updateForm }: ShippingSectionProps) {
  return (
    <SectionCard title="Shipping">
      <div className="space-y-4">
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <Field>
            <FieldLabel>Weight (kg)</FieldLabel>
            <FieldContent>
              <Input
                value={form.weightKg}
                onChange={(event) => updateForm('weightKg', event.target.value)}
              />
            </FieldContent>
          </Field>
          <Field>
            <FieldLabel>Length (cm)</FieldLabel>
            <FieldContent>
              <Input
                value={form.lengthCm}
                onChange={(event) => updateForm('lengthCm', event.target.value)}
              />
            </FieldContent>
          </Field>
          <Field>
            <FieldLabel>Width (cm)</FieldLabel>
            <FieldContent>
              <Input
                value={form.widthCm}
                onChange={(event) => updateForm('widthCm', event.target.value)}
              />
            </FieldContent>
          </Field>
          <Field>
            <FieldLabel>Height (cm)</FieldLabel>
            <FieldContent>
              <Input
                value={form.heightCm}
                onChange={(event) => updateForm('heightCm', event.target.value)}
              />
            </FieldContent>
          </Field>
        </div>

        <div className="space-y-2">
          {form.shippingMethods.map((method) => (
            <label
              key={method.id}
              className="bg-muted/45 flex items-center gap-3 rounded-2xl border px-4 py-3 text-sm"
            >
              <Checkbox
                checked={method.checked}
                onCheckedChange={(checked) =>
                  updateForm(
                    'shippingMethods',
                    form.shippingMethods.map((item) =>
                      item.id === method.id ? { ...item, checked: checked === true } : item,
                    ),
                  )
                }
                aria-label={method.label}
              />
              <span>{method.label}</span>
            </label>
          ))}
        </div>
      </div>
    </SectionCard>
  )
}

interface SeoSectionProps {
  form: ProductDetailFormData
  setSlugTouched: React.Dispatch<React.SetStateAction<boolean>>
  updateForm: <K extends keyof ProductDetailFormData>(
    key: K,
    value: ProductDetailFormData[K],
  ) => void
}

function SeoSection({ form, setSlugTouched, updateForm }: SeoSectionProps) {
  return (
    <SectionCard title="SEO">
      <div className="grid gap-4">
        <div className="grid gap-4 md:grid-cols-2">
          <Field>
            <FieldLabel>URL slug</FieldLabel>
            <FieldContent>
              <Input
                value={form.slug}
                onChange={(event) => {
                  setSlugTouched(true)
                  updateForm('slug', slugify(event.target.value))
                }}
              />
            </FieldContent>
            <FieldDescription>halomarket.co/p/...</FieldDescription>
          </Field>
          <Field>
            <FieldLabel>Meta title</FieldLabel>
            <FieldContent>
              <Input
                placeholder="Up to 60 chars"
                value={form.metaTitle}
                onChange={(event) => updateForm('metaTitle', event.target.value)}
              />
            </FieldContent>
          </Field>
        </div>

        <Field>
          <FieldLabel>Meta description</FieldLabel>
          <FieldContent>
            <Textarea
              rows={5}
              placeholder="Up to 160 chars"
              value={form.metaDescription}
              onChange={(event) => updateForm('metaDescription', event.target.value)}
            />
          </FieldContent>
          <FieldDescription>Up to 160 chars</FieldDescription>
        </Field>
      </div>
    </SectionCard>
  )
}

function useProductDetailForm(initialData: ProductDetailFormData) {
  const [form, setForm] = useState<ProductDetailFormData>({
    ...initialData,
    media: [...initialData.media],
    optionGroups: cloneOptionGroups(initialData.optionGroups),
    shippingMethods: initialData.shippingMethods.map((method) => ({ ...method })),
    visibility: cloneVisibilityOptions(initialData.visibility),
    validationItems: initialData.validationItems.map((item) => ({ ...item })),
  })
  const [variantDrafts, setVariantDrafts] = useState<Record<string, VariantDraft>>(
    createVariantDraftMap(initialData.variantSeeds),
  )
  const [draftValueInputs, setDraftValueInputs] = useState<Record<string, string>>({})
  const [slugTouched, setSlugTouched] = useState(false)

  const variantRows = buildVariantRows(form.optionGroups, variantDrafts)
  const validationItems = buildValidationItems(form.validationItems, form, variantRows)

  function updateForm<K extends keyof ProductDetailFormData>(
    key: K,
    value: ProductDetailFormData[K],
  ) {
    setForm((current) => ({ ...current, [key]: value }))
  }

  function handleNameChange(value: string) {
    setForm((current) => ({
      ...current,
      name: value,
      slug: slugTouched ? current.slug : slugify(value),
    }))
  }

  function handleMediaAdd(files: FileList) {
    const nextItems = Array.from(files).map((file, index) => ({
      id: `${file.name}-${index}-${Date.now()}`,
      url: URL.createObjectURL(file),
      alt: file.name,
    }))

    setForm((current) => ({ ...current, media: [...current.media, ...nextItems] }))
  }

  function handleMediaRemove(id: string) {
    setForm((current) => ({
      ...current,
      media: current.media.filter((item) => item.id !== id),
    }))
  }

  function handleOptionGroupChange(groupId: string, nextGroup: ProductDetailOptionGroup) {
    setForm((current) => ({
      ...current,
      optionGroups: current.optionGroups.map((group) => (group.id === groupId ? nextGroup : group)),
    }))
  }

  function handleRemoveOptionGroup(groupId: string) {
    setForm((current) => ({
      ...current,
      optionGroups: current.optionGroups.filter((group) => group.id !== groupId),
    }))
  }

  function handleAddOptionGroup() {
    const nextIndex = form.optionGroups.length + 1
    updateForm('optionGroups', [
      ...form.optionGroups,
      { id: `group-${nextIndex}`, name: `Option ${nextIndex}`, values: [] },
    ])
  }

  function handleAddOptionValue(groupId: string) {
    const draftValue = draftValueInputs[groupId]?.trim()

    if (!draftValue) {
      return
    }

    const group = form.optionGroups.find((item) => item.id === groupId)
    if (!group || group.values.includes(draftValue)) {
      return
    }

    handleOptionGroupChange(groupId, {
      ...group,
      values: [...group.values, draftValue],
    })
    setDraftValueInputs((current) => ({ ...current, [groupId]: '' }))
  }

  function handleRemoveOptionValue(groupId: string, value: string) {
    const group = form.optionGroups.find((item) => item.id === groupId)
    if (!group) {
      return
    }

    handleOptionGroupChange(groupId, {
      ...group,
      values: group.values.filter((item) => item !== value),
    })
  }

  function handleVariantDraftChange(key: string, field: keyof VariantDraft, value: string) {
    setVariantDrafts((current) => ({
      ...current,
      [key]: {
        sku: current[key]?.sku ?? '',
        price: current[key]?.price ?? '',
        stock: current[key]?.stock ?? '',
        [field]: value,
      },
    }))
  }

  return {
    form,
    variantRows,
    validationItems,
    draftValueInputs,
    setDraftValueInputs,
    setSlugTouched,
    updateForm,
    handleNameChange,
    handleMediaAdd,
    handleMediaRemove,
    handleOptionGroupChange,
    handleRemoveOptionGroup,
    handleAddOptionGroup,
    handleAddOptionValue,
    handleRemoveOptionValue,
    handleVariantDraftChange,
  }
}

export function ProductDetailClient({
  title,
  breadcrumb,
  previewHref,
  saveDraftHref,
  publishHref,
  lastSavedLabel,
  categories,
  brands,
  statuses,
  initialData,
}: ProductDetailClientProps) {
  const {
    form,
    variantRows,
    validationItems,
    draftValueInputs,
    setDraftValueInputs,
    setSlugTouched,
    updateForm,
    handleNameChange,
    handleMediaAdd,
    handleMediaRemove,
    handleOptionGroupChange,
    handleRemoveOptionGroup,
    handleAddOptionGroup,
    handleAddOptionValue,
    handleRemoveOptionValue,
    handleVariantDraftChange,
  } = useProductDetailForm(initialData)

  return (
    <ConsolePageLayout
      title={title}
      breadcrumb={breadcrumb}
      actions={
        <>
          <Button asChild size="sm" variant="outline">
            <a href={previewHref}>
              <Eye />
              Preview
            </a>
          </Button>
          <Button asChild size="sm" variant="outline">
            <a href={saveDraftHref}>
              <FileText />
              Save draft
            </a>
          </Button>
          <Button asChild size="sm">
            <a href={publishHref}>
              <Send />
              Publish
            </a>
          </Button>
        </>
      }
      mainClassName="space-y-5"
      aside={
        <ProductSidebar
          form={form}
          statuses={statuses}
          lastSavedLabel={lastSavedLabel}
          validationItems={validationItems}
          updateForm={updateForm}
        />
      }
    >
      <BasicInfoSection
        form={form}
        categories={categories}
        brands={brands}
        onNameChange={handleNameChange}
        updateForm={updateForm}
      />

      <SectionCard title="Media" subtitle="Up to 8 images. First image is the main thumbnail.">
        <ProductMediaUpload
          className="border-0 bg-transparent p-0"
          items={form.media}
          maxItems={8}
          onAdd={handleMediaAdd}
          onRemove={handleMediaRemove}
        />
      </SectionCard>

      <VariantsSection
        optionGroups={form.optionGroups}
        variantRows={variantRows}
        draftValueInputs={draftValueInputs}
        setDraftValueInputs={setDraftValueInputs}
        handleOptionGroupChange={handleOptionGroupChange}
        handleRemoveOptionGroup={handleRemoveOptionGroup}
        handleAddOptionGroup={handleAddOptionGroup}
        handleAddOptionValue={handleAddOptionValue}
        handleRemoveOptionValue={handleRemoveOptionValue}
        handleVariantDraftChange={handleVariantDraftChange}
      />

      <ShippingSection form={form} updateForm={updateForm} />
      <SeoSection form={form} setSlugTouched={setSlugTouched} updateForm={updateForm} />
    </ConsolePageLayout>
  )
}
