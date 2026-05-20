import { shopProfileDefaultProps } from './ShopProfile.fixtures'
import { ShopProfileClient } from './ShopProfile.client'
import type { ShopProfileProps } from './ShopProfile.types'

export function ShopProfile({
  title = shopProfileDefaultProps.title,
  description = shopProfileDefaultProps.description,
  breadcrumb = shopProfileDefaultProps.breadcrumb,
  submitLabel = shopProfileDefaultProps.submitLabel,
  initialData = shopProfileDefaultProps.initialData,
  countryOptions = shopProfileDefaultProps.countryOptions,
  responseTargetOptions = shopProfileDefaultProps.responseTargetOptions,
  onSubmit,
  onReplaceLogo,
  onReplaceBanner,
}: ShopProfileProps) {
  const optionalProps = {
    ...(onSubmit ? { onSubmit } : {}),
    ...(onReplaceLogo ? { onReplaceLogo } : {}),
    ...(onReplaceBanner ? { onReplaceBanner } : {}),
  }

  return (
    <ShopProfileClient
      title={title}
      description={description}
      breadcrumb={breadcrumb}
      submitLabel={submitLabel}
      initialData={initialData}
      countryOptions={countryOptions}
      responseTargetOptions={responseTargetOptions}
      {...optionalProps}
    />
  )
}
