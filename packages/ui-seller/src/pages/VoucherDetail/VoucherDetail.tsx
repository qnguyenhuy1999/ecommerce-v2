import { voucherDetailDefaultProps } from './VoucherDetail.fixtures'
import type { VoucherDetailProps } from './VoucherDetail.types'
import { VoucherDetailClient } from './VoucherDetail.client'

export function VoucherDetail({
  title = voucherDetailDefaultProps.title,
  description = voucherDetailDefaultProps.description,
  breadcrumb = voucherDetailDefaultProps.breadcrumb,
  cancelHref = voucherDetailDefaultProps.cancelHref,
  submitLabel = voucherDetailDefaultProps.submitLabel,
  initialData = voucherDetailDefaultProps.initialData,
  onSubmit,
  onCancel,
}: VoucherDetailProps) {
  const optionalProps = {
    ...(onSubmit ? { onSubmit } : {}),
    ...(onCancel ? { onCancel } : {}),
  }

  return (
    <VoucherDetailClient
      title={title}
      description={description}
      breadcrumb={breadcrumb}
      cancelHref={cancelHref}
      submitLabel={submitLabel}
      initialData={initialData}
      {...optionalProps}
    />
  )
}
