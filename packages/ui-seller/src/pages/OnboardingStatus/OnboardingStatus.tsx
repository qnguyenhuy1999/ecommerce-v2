import { OnboardingStatusClient } from './OnboardingStatus.client'
import { onboardingStatusDefaultProps } from './OnboardingStatus.fixtures'
import type { OnboardingStatusProps } from './OnboardingStatus.types'

export function OnboardingStatus({
  title = onboardingStatusDefaultProps.title,
  description = onboardingStatusDefaultProps.description,
  steps = onboardingStatusDefaultProps.steps,
  primaryActionLabel = onboardingStatusDefaultProps.primaryActionLabel,
  primaryActionHref = onboardingStatusDefaultProps.primaryActionHref,
  onPrimaryAction,
}: OnboardingStatusProps) {
  return (
    <OnboardingStatusClient
      title={title}
      description={description}
      steps={steps}
      primaryActionLabel={primaryActionLabel}
      primaryActionHref={primaryActionHref}
      {...(onPrimaryAction ? { onPrimaryAction } : {})}
    />
  )
}
