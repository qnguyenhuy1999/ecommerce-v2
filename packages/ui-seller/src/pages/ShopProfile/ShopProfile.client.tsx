'use client'

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
  Button,
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
  Textarea,
} from '@ecom/core-ui'
import { ImagePlus, Star } from 'lucide-react'
import { useState } from 'react'
import { SectionCard } from '../../atoms/SectionCard'
import {
  shopProfileCountryOptions,
  shopProfileResponseTargetOptions,
} from './ShopProfile.fixtures'
import type { ShopProfileFormData, ShopProfileProps } from './ShopProfile.types'

type ShopProfileClientProps = Required<
  Pick<
    ShopProfileProps,
    'title' | 'description' | 'breadcrumb' | 'submitLabel' | 'initialData'
  >
> &
  Pick<ShopProfileProps, 'countryOptions' | 'responseTargetOptions' | 'onSubmit' | 'onReplaceLogo' | 'onReplaceBanner'>

function getInitials(value: string) {
  return value
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? '')
    .join('')
}

function normalizeSlug(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
}

function LivePreview({ form }: { form: ShopProfileFormData }) {
  return (
    <SectionCard title="Live preview" className="rounded-[24px]">
      <article className="bg-card border-border overflow-hidden rounded-2xl border shadow-xs">
        <div className="aspect-[2.4/1] overflow-hidden">
          <img alt={`${form.shopName} banner`} className="size-full object-cover" src={form.bannerUrl} />
        </div>
        <div className="space-y-4 p-4">
          <div className="flex items-center gap-3">
            <Avatar className="size-14 rounded-full border bg-white">
              <AvatarImage alt={form.shopName} src={form.logoUrl} />
              <AvatarFallback>{getInitials(form.shopName)}</AvatarFallback>
            </Avatar>
            <div className="min-w-0">
              <div className="truncate text-lg font-semibold">{form.shopName || 'Shop name'}</div>
              <div className="text-muted-foreground flex items-center gap-1 text-sm">
                <Star className="size-3.5 fill-current" />
                <span>{form.ratingLabel}</span>
                <span>&middot;</span>
                <span>{form.followersLabel}</span>
              </div>
            </div>
          </div>
          <p className="text-muted-foreground text-sm">{form.tagline || 'Add a short shop tagline.'}</p>
        </div>
      </article>
    </SectionCard>
  )
}

function IdentitySection({
  form,
  previewUrl,
  onFieldChange,
  onReplaceLogo,
}: {
  form: ShopProfileFormData
  previewUrl: string
  onFieldChange: <K extends keyof ShopProfileFormData>(key: K, value: ShopProfileFormData[K]) => void
  onReplaceLogo?: () => void
}) {
  return (
    <SectionCard title="Identity" className="rounded-[24px]">
      <div className="space-y-5">
        <div className="flex flex-wrap items-center gap-4">
          <Avatar className="size-18 rounded-full">
            <AvatarImage alt={form.shopName} src={form.logoUrl} />
            <AvatarFallback>{getInitials(form.shopName)}</AvatarFallback>
          </Avatar>
          <Button type="button" variant="outline" onClick={onReplaceLogo}>
            <ImagePlus />
            Replace logo
          </Button>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <Field>
            <FieldLabel>Shop name *</FieldLabel>
            <FieldContent>
              <Input value={form.shopName} onChange={(event) => onFieldChange('shopName', event.target.value)} />
            </FieldContent>
          </Field>

          <Field>
            <FieldLabel>Slug</FieldLabel>
            <FieldContent>
              <Input value={form.slug} onChange={(event) => onFieldChange('slug', normalizeSlug(event.target.value))} />
            </FieldContent>
            <FieldDescription>{`${previewUrl.replace(/\/$/, '')}/${form.slug || 'your-shop'}`}</FieldDescription>
          </Field>
        </div>

        <Field>
          <FieldLabel>Tagline</FieldLabel>
          <FieldContent>
            <Input value={form.tagline} onChange={(event) => onFieldChange('tagline', event.target.value)} />
          </FieldContent>
        </Field>

        <Field>
          <FieldLabel>About</FieldLabel>
          <FieldContent>
            <Textarea rows={5} value={form.about} onChange={(event) => onFieldChange('about', event.target.value)} />
          </FieldContent>
        </Field>
      </div>
    </SectionCard>
  )
}

function BannerSection({
  bannerUrl,
  onReplaceBanner,
}: {
  bannerUrl: string
  onReplaceBanner?: () => void
}) {
  return (
    <SectionCard title="Banner" className="rounded-[24px]">
      <div className="space-y-4">
        <div className="bg-muted aspect-[2.9/1] overflow-hidden rounded-2xl">
          <img alt="Shop banner" className="size-full object-cover" src={bannerUrl} />
        </div>
        <Button type="button" variant="outline" onClick={onReplaceBanner}>
          <ImagePlus />
          Replace banner
        </Button>
      </div>
    </SectionCard>
  )
}

function ContactOperationsSection({
  form,
  countryOptions,
  responseTargetOptions,
  onFieldChange,
}: {
  form: ShopProfileFormData
  countryOptions: string[]
  responseTargetOptions: string[]
  onFieldChange: <K extends keyof ShopProfileFormData>(key: K, value: ShopProfileFormData[K]) => void
}) {
  return (
    <SectionCard title="Contact & operations" className="rounded-[24px]">
      <div className="grid gap-4 md:grid-cols-2">
        <Field>
          <FieldLabel>Support email</FieldLabel>
          <FieldContent>
            <Input value={form.supportEmail} onChange={(event) => onFieldChange('supportEmail', event.target.value)} />
          </FieldContent>
        </Field>

        <Field>
          <FieldLabel>Support phone</FieldLabel>
          <FieldContent>
            <Input value={form.supportPhone} onChange={(event) => onFieldChange('supportPhone', event.target.value)} />
          </FieldContent>
        </Field>

        <Field>
          <FieldLabel>Country</FieldLabel>
          <FieldContent>
            <Select value={form.country} onValueChange={(value) => onFieldChange('country', value)}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select country" />
              </SelectTrigger>
              <SelectContent>
                {countryOptions.map((option) => (
                  <SelectItem key={option} value={option}>
                    {option}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </FieldContent>
        </Field>

        <Field>
          <FieldLabel>Response target</FieldLabel>
          <FieldContent>
            <Select
              value={form.responseTarget}
              onValueChange={(value) => onFieldChange('responseTarget', value)}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select response target" />
              </SelectTrigger>
              <SelectContent>
                {responseTargetOptions.map((option) => (
                  <SelectItem key={option} value={option}>
                    {option}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </FieldContent>
        </Field>
      </div>
    </SectionCard>
  )
}

export function ShopProfileClient({
  title,
  description,
  breadcrumb,
  submitLabel,
  initialData,
  countryOptions = shopProfileCountryOptions,
  responseTargetOptions = shopProfileResponseTargetOptions,
  onSubmit,
  onReplaceLogo,
  onReplaceBanner,
}: ShopProfileClientProps) {
  const [form, setForm] = useState<ShopProfileFormData>(initialData)
  const identitySectionProps = {
    ...(onReplaceLogo !== undefined ? { onReplaceLogo } : {}),
  }
  const bannerSectionProps = {
    ...(onReplaceBanner !== undefined ? { onReplaceBanner } : {}),
  }

  function updateForm<K extends keyof ShopProfileFormData>(key: K, value: ShopProfileFormData[K]) {
    setForm((current) => {
      if (key === 'shopName' && current.slug === normalizeSlug(current.shopName)) {
        return {
          ...current,
          shopName: value as ShopProfileFormData['shopName'],
          slug: normalizeSlug(String(value)),
        }
      }

      return { ...current, [key]: value }
    })
  }

  return (
    <ConsolePageLayout
      title={title}
      description={description}
      breadcrumb={breadcrumb}
      actions={
        <Button type="button" onClick={() => onSubmit?.(form)}>
          {submitLabel}
        </Button>
      }
      aside={<LivePreview form={form} />}
      mainClassName="space-y-6"
    >
      <IdentitySection
        form={form}
        previewUrl={form.previewUrl}
        onFieldChange={updateForm}
        {...identitySectionProps}
      />
      <BannerSection bannerUrl={form.bannerUrl} {...bannerSectionProps} />
      <ContactOperationsSection
        form={form}
        countryOptions={countryOptions}
        responseTargetOptions={responseTargetOptions}
        onFieldChange={updateForm}
      />
    </ConsolePageLayout>
  )
}
