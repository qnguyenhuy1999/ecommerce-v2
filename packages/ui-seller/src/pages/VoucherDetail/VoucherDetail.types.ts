export type VoucherDetailType = 'PERCENT' | 'AMOUNT' | 'FREESHIP'

export interface VoucherDetailFormData {
  code: string
  type: VoucherDetailType
  value: string
  minSpend: string
  quota: string
  perBuyerLimit: string
  startsAt: string
  endsAt: string
}

export interface VoucherDetailProps {
  title?: string
  description?: string
  breadcrumb?: Array<{ label: string; href?: string }>
  cancelHref?: string
  submitLabel?: string
  initialData?: VoucherDetailFormData
  onSubmit?: (data: VoucherDetailFormData) => void
  onCancel?: () => void
}
