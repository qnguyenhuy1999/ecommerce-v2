import type { VoucherDetailProps } from './VoucherDetail.types'

export const voucherDetailDefaultProps = {
  title: 'New voucher',
  description: 'Configure code-based discounts for your store and preview the buyer-facing card.',
  breadcrumb: [{ label: 'Seller', href: '#' }, { label: 'Vouchers', href: '#' }, { label: 'New' }],
  cancelHref: '/vouchers',
  submitLabel: 'Create voucher',
  initialData: {
    code: 'LUMEN10',
    type: 'PERCENT',
    value: '10',
    minSpend: '50',
    quota: '500',
    perBuyerLimit: '1',
    startsAt: '2026-05-20T09:00',
    endsAt: '2026-06-30T23:59',
  },
} satisfies Required<Omit<VoucherDetailProps, 'onSubmit' | 'onCancel'>>
