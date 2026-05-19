'use client'

import {
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
  Textarea,
} from '@ecom/core-ui'
import { SectionCard } from '../../atoms/SectionCard'
import { useProductEditorBasicInfo } from './ProductDetail.context'

export function BasicInfoSection() {
  const { form, categories, brands, onNameChange, updateForm } = useProductEditorBasicInfo()

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
