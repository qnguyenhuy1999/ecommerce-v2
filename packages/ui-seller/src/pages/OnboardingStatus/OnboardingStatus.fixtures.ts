import type { OnboardingStatusProps } from './OnboardingStatus.types'

export const onboardingStatusDefaultSteps: NonNullable<OnboardingStatusProps['steps']> = [
  { id: 'account', label: 'Account', status: 'DONE', statusLabel: 'Done' },
  { id: 'shop-details', label: 'Shop details', status: 'DONE', statusLabel: 'Done' },
  { id: 'kyc-documents', label: 'KYC documents', status: 'DONE', statusLabel: 'Done' },
  {
    id: 'bank-verification',
    label: 'Bank verification',
    status: 'IN_REVIEW',
    statusLabel: 'In review',
  },
]

export const onboardingStatusDefaultProps = {
  title: 'Under review',
  description:
    "Most applications are reviewed within 2 business days. We'll email you once a decision is made.",
  steps: onboardingStatusDefaultSteps,
  primaryActionLabel: 'Back to storefront',
  primaryActionHref: '/',
} satisfies Required<Omit<OnboardingStatusProps, 'onPrimaryAction'>>
