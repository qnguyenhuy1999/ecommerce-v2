'use client'

import {
  Button,
  ConsolePageLayout,
  Field,
  FieldContent,
  FieldLabel,
  Input,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@ecom/core-ui'
import { Sparkles, Ticket } from 'lucide-react'
import { useMemo, useState } from 'react'
import { SectionCard } from '../../atoms/SectionCard'
import type {
  VoucherDetailFormData,
  VoucherDetailProps,
  VoucherDetailType,
} from './VoucherDetail.types'

type VoucherDetailClientProps = Required<
  Pick<
    VoucherDetailProps,
    'title' | 'description' | 'breadcrumb' | 'cancelHref' | 'submitLabel' | 'initialData'
  >
> &
  Pick<VoucherDetailProps, 'onSubmit' | 'onCancel'>

const voucherTypeOptions: Array<{ value: VoucherDetailType; label: string }> = [
  { value: 'PERCENT', label: 'Percent off' },
  { value: 'AMOUNT', label: 'Amount off' },
  { value: 'FREESHIP', label: 'Free shipping' },
]

function normalizeVoucherCode(code: string) {
  return code
    .toUpperCase()
    .replace(/[^A-Z0-9-]/g, '')
    .slice(0, 16)
}

function generateVoucherCode() {
  const cryptoObj = globalThis.crypto
  const random = cryptoObj.getRandomValues(new Uint32Array(1))[0]

  if (random) {
    return `SHOP${random.toString(36).toUpperCase().slice(0, 6)}`
  }

  const array = new Uint8Array(6)
  return `SHOP${Array.from(array)
    .map((x) => (x % 36).toString(36).toUpperCase())
    .join('')}`
}

function formatDateLabel(value: string) {
  if (!value) {
    return 'No expiry'
  }

  const date = new Date(value)

  if (Number.isNaN(date.getTime())) {
    return 'No expiry'
  }

  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
  }).format(date)
}

function getPreviewHeadline(type: VoucherDetailType, value: string) {
  if (type === 'FREESHIP') {
    return 'Free shipping'
  }

  const amount = value.trim() || '0'
  return type === 'PERCENT' ? `${amount}% off` : `$${amount} off`
}

function getTypeValueInputLabel(type: VoucherDetailType) {
  switch (type) {
    case 'PERCENT':
      return 'Value *'
    case 'AMOUNT':
      return 'Amount off (USD) *'
    case 'FREESHIP':
      return 'Value'
  }
}

function VoucherPreview({ form }: { form: VoucherDetailFormData }) {
  const headline = getPreviewHeadline(form.type, form.value)
  const minSpendLabel = form.minSpend.trim()
    ? `Min spend $${form.minSpend.trim()}`
    : 'No minimum spend'
  const expiryLabel = `Exp ${formatDateLabel(form.endsAt)}`

  return (
    <SectionCard title="Live preview" className="rounded-[24px]">
      <article className="bg-card border-border overflow-hidden rounded-xl border shadow-xs">
        <div className="grid min-h-32 md:grid-cols-[6.25rem_minmax(0,1fr)]">
          <div className="bg-primary/10 text-primary flex flex-col items-center justify-center gap-2 border-b border-dashed px-4 py-6 text-center md:border-r md:border-b-0">
            <Ticket className="size-6" />
            <div className="text-sm font-semibold tracking-wide uppercase">Shop</div>
          </div>
          <div className="flex flex-col justify-center gap-2 px-5 py-4">
            <div className="text-foreground text-2xl font-semibold tracking-tight">{headline}</div>
            <div className="text-muted-foreground text-sm">{minSpendLabel}</div>
            <div className="flex flex-wrap items-center gap-2 text-sm">
              <span className="bg-muted text-foreground rounded-md px-2 py-1 font-mono text-xs font-semibold">
                {form.code || 'CODE'}
              </span>
              <span className="text-muted-foreground">{expiryLabel}</span>
            </div>
          </div>
        </div>
      </article>
    </SectionCard>
  )
}

interface VoucherFormSectionProps {
  form: VoucherDetailFormData
  cancelHref: string
  submitLabel: string
  onCancel?: () => void
  onGenerateCode: () => void
  onTypeChange: (value: VoucherDetailType) => void
  onFieldChange: <K extends keyof VoucherDetailFormData>(
    key: K,
    value: VoucherDetailFormData[K],
  ) => void
}

function VoucherIdentitySection({
  form,
  onGenerateCode,
  onTypeChange,
  onFieldChange,
}: Pick<VoucherFormSectionProps, 'form' | 'onGenerateCode' | 'onTypeChange' | 'onFieldChange'>) {
  return (
    <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_16rem]">
      <Field>
        <FieldLabel>Voucher code *</FieldLabel>
        <FieldContent>
          <div className="flex gap-3">
            <Input
              value={form.code}
              onChange={(event) => onFieldChange('code', normalizeVoucherCode(event.target.value))}
              placeholder="LUMEN10"
            />
            <Button type="button" variant="outline" onClick={onGenerateCode}>
              <Sparkles />
              Generate
            </Button>
          </div>
        </FieldContent>
      </Field>

      <Field>
        <FieldLabel>Type *</FieldLabel>
        <FieldContent>
          <Select
            value={form.type}
            onValueChange={(value) => onTypeChange(value as VoucherDetailType)}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select type" />
            </SelectTrigger>
            <SelectContent>
              {voucherTypeOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </FieldContent>
      </Field>
    </div>
  )
}

function VoucherPricingSection({
  form,
  onFieldChange,
}: Pick<VoucherFormSectionProps, 'form' | 'onFieldChange'>) {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      <Field>
        <FieldLabel>{getTypeValueInputLabel(form.type)}</FieldLabel>
        <FieldContent>
          <Input
            type="number"
            min="0"
            value={form.type === 'FREESHIP' ? '0' : form.value}
            disabled={form.type === 'FREESHIP'}
            onChange={(event) => onFieldChange('value', event.target.value)}
          />
        </FieldContent>
      </Field>

      <Field>
        <FieldLabel>Minimum spend (USD)</FieldLabel>
        <FieldContent>
          <Input
            type="number"
            min="0"
            value={form.minSpend}
            onChange={(event) => onFieldChange('minSpend', event.target.value)}
          />
        </FieldContent>
      </Field>
    </div>
  )
}

function VoucherLimitsSection({
  form,
  onFieldChange,
}: Pick<VoucherFormSectionProps, 'form' | 'onFieldChange'>) {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      <Field>
        <FieldLabel>Quota</FieldLabel>
        <FieldContent>
          <Input
            type="number"
            min="0"
            value={form.quota}
            onChange={(event) => onFieldChange('quota', event.target.value)}
          />
        </FieldContent>
      </Field>

      <Field>
        <FieldLabel>Per-buyer limit</FieldLabel>
        <FieldContent>
          <Input
            type="number"
            min="1"
            value={form.perBuyerLimit}
            onChange={(event) => onFieldChange('perBuyerLimit', event.target.value)}
          />
        </FieldContent>
      </Field>
    </div>
  )
}

function VoucherScheduleSection({
  form,
  onFieldChange,
}: Pick<VoucherFormSectionProps, 'form' | 'onFieldChange'>) {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      <Field>
        <FieldLabel>Starts at</FieldLabel>
        <FieldContent>
          <Input
            type="datetime-local"
            value={form.startsAt}
            onChange={(event) => onFieldChange('startsAt', event.target.value)}
          />
        </FieldContent>
      </Field>

      <Field>
        <FieldLabel>Ends at</FieldLabel>
        <FieldContent>
          <Input
            type="datetime-local"
            value={form.endsAt}
            onChange={(event) => onFieldChange('endsAt', event.target.value)}
          />
        </FieldContent>
      </Field>
    </div>
  )
}

function VoucherFormActions({
  cancelHref,
  submitLabel,
  onCancel,
}: Pick<VoucherFormSectionProps, 'cancelHref' | 'submitLabel' | 'onCancel'>) {
  return (
    <div className="flex justify-end gap-3 pt-2">
      <Button asChild type="button" variant="outline">
        <a href={cancelHref} onClick={onCancel}>
          Cancel
        </a>
      </Button>
      <Button type="submit">{submitLabel}</Button>
    </div>
  )
}

export function VoucherDetailClient({
  title,
  description,
  breadcrumb,
  cancelHref,
  submitLabel,
  initialData,
  onSubmit,
  onCancel,
}: VoucherDetailClientProps) {
  const [form, setForm] = useState(initialData)

  const preview = useMemo(() => <VoucherPreview form={form} />, [form])

  function updateForm<K extends keyof VoucherDetailFormData>(
    key: K,
    value: VoucherDetailFormData[K],
  ) {
    setForm((current) => ({ ...current, [key]: value }))
  }

  function handleGenerateCode() {
    updateForm('code', generateVoucherCode())
  }

  return (
    <ConsolePageLayout
      title={title}
      description={description}
      breadcrumb={breadcrumb}
      aside={preview}
      stickyAside={false}
      contentClassName="items-start xl:grid-cols-[minmax(0,1fr)_24rem]"
    >
      <form
        onSubmit={(event) => {
          event.preventDefault()
          onSubmit?.(form)
        }}
      >
        <SectionCard title="Details" className="rounded-[24px]">
          <div className="grid gap-4">
            <VoucherIdentitySection
              form={form}
              onGenerateCode={handleGenerateCode}
              onTypeChange={(value) => updateForm('type', value)}
              onFieldChange={updateForm}
            />
            <VoucherPricingSection form={form} onFieldChange={updateForm} />
            <VoucherLimitsSection form={form} onFieldChange={updateForm} />
            <VoucherScheduleSection form={form} onFieldChange={updateForm} />
            <VoucherFormActions
              cancelHref={cancelHref}
              submitLabel={submitLabel}
              onCancel={onCancel}
            />
          </div>
        </SectionCard>
      </form>
    </ConsolePageLayout>
  )
}
