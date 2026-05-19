'use client'

import { Field, FieldContent, FieldDescription, FieldLabel, Input, Textarea } from '@ecom/core-ui'
import { SectionCard } from '../../atoms/SectionCard'
import { useProductEditorSeo } from './ProductDetail.context'

export function SeoSection() {
  const { form, onSlugChange, updateForm } = useProductEditorSeo()

  return (
    <SectionCard title="SEO">
      <div className="grid gap-4">
        <div className="grid gap-4 md:grid-cols-2">
          <Field>
            <FieldLabel>URL slug</FieldLabel>
            <FieldContent>
              <Input value={form.slug} onChange={(event) => onSlugChange(event.target.value)} />
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
