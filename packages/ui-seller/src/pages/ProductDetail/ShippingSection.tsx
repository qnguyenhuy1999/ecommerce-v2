'use client'

import { Checkbox, Field, FieldContent, FieldLabel, Input } from '@ecom/core-ui'
import { SectionCard } from '../../atoms/SectionCard'
import { useProductEditorShipping } from './ProductDetail.context'

export function ShippingSection() {
  const { form, updateDimension, onShippingMethodChange } = useProductEditorShipping()

  return (
    <SectionCard title="Shipping">
      <div className="space-y-4">
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <Field>
            <FieldLabel>Weight (kg)</FieldLabel>
            <FieldContent>
              <Input
                value={form.weightKg}
                onChange={(event) => updateDimension('weightKg', event.target.value)}
              />
            </FieldContent>
          </Field>
          <Field>
            <FieldLabel>Length (cm)</FieldLabel>
            <FieldContent>
              <Input
                value={form.lengthCm}
                onChange={(event) => updateDimension('lengthCm', event.target.value)}
              />
            </FieldContent>
          </Field>
          <Field>
            <FieldLabel>Width (cm)</FieldLabel>
            <FieldContent>
              <Input
                value={form.widthCm}
                onChange={(event) => updateDimension('widthCm', event.target.value)}
              />
            </FieldContent>
          </Field>
          <Field>
            <FieldLabel>Height (cm)</FieldLabel>
            <FieldContent>
              <Input
                value={form.heightCm}
                onChange={(event) => updateDimension('heightCm', event.target.value)}
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
                onCheckedChange={(checked) => onShippingMethodChange(method.id, checked === true)}
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
