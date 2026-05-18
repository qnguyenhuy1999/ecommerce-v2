import type {
  ProductDetailFormData,
  ProductDetailOptionGroup,
  ProductDetailValidationItem,
  ProductDetailVariantSeed,
} from './ProductDetail.types'

export type VariantDraft = {
  sku: string
  price: string
  stock: string
}

export type VariantRow = {
  key: string
  values: string[]
  draft: VariantDraft
}

export function slugify(value: string) {
  const normalized = value.toLowerCase().trim()
  const tokens: string[] = []
  let current = ''

  for (const char of normalized) {
    const isAlphaNumeric =
      (char >= 'a' && char <= 'z') || (char >= '0' && char <= '9')

    if (isAlphaNumeric) {
      current += char
      continue
    }

    if (current) {
      tokens.push(current)
      current = ''
    }
  }

  if (current) {
    tokens.push(current)
  }

  return tokens.join('-')
}

export function buildVariantKey(values: string[]) {
  return values.join('||')
}

export function buildDefaultSku(values: string[]) {
  return `SKU-${values.map((value) => slugify(value).toUpperCase()).join('-')}`
}

export function buildVariantCombinations(groups: ProductDetailOptionGroup[]) {
  const populatedGroups = groups.filter((group) => group.name.trim() && group.values.length > 0)

  if (populatedGroups.length === 0) {
    return []
  }

  return populatedGroups.reduce<string[][]>(
    (combinations, group) => {
      if (combinations.length === 0) {
        return group.values.map((value) => [value])
      }

      return combinations.flatMap((combination) =>
        group.values.map((value) => [...combination, value]),
      )
    },
    [],
  )
}

export function buildVariantRows(
  groups: ProductDetailOptionGroup[],
  drafts: Record<string, VariantDraft>,
) {
  return buildVariantCombinations(groups).map<VariantRow>((values) => {
    const key = buildVariantKey(values)
    const draft = drafts[key] ?? {
      sku: buildDefaultSku(values),
      price: '',
      stock: '',
    }

    return { key, values, draft }
  })
}

export function createVariantDraftMap(seeds: ProductDetailVariantSeed[]) {
  return seeds.reduce<Record<string, VariantDraft>>((accumulator, seed) => {
    accumulator[seed.key] = {
      sku: seed.sku,
      price: seed.price,
      stock: seed.stock,
    }
    return accumulator
  }, {})
}

export function buildValidationItems(
  validationItems: ProductDetailValidationItem[],
  form: ProductDetailFormData,
  variantRows: VariantRow[],
) {
  return validationItems.map((item) => {
    if (item.id === 'core') {
      return {
        ...item,
        complete:
          form.name.trim().length > 0 &&
          form.category.trim().length > 0 &&
          variantRows.some((row) => row.draft.price.trim().length > 0),
      }
    }

    if (item.id === 'media') {
      return { ...item, complete: form.media.length > 0 }
    }

    if (item.id === 'seo') {
      return { ...item, complete: form.metaTitle.trim().length > 0 }
    }

    return item
  })
}

export function cloneOptionGroups(groups: ProductDetailOptionGroup[]) {
  return groups.map((group) => ({ ...group, values: [...group.values] }))
}
