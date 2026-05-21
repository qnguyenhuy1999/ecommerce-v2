export type OnboardingStepStatus = 'DONE' | 'IN_REVIEW' | 'PENDING'

export interface OnboardingStatusStep {
  id: string
  label: string
  status: OnboardingStepStatus
  statusLabel?: string
}

export interface OnboardingStatusProps {
  title?: string
  description?: string
  steps?: OnboardingStatusStep[]
  primaryActionLabel?: string
  primaryActionHref?: string
  onPrimaryAction?: () => void
}
