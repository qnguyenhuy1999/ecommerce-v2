import { SellerOnboardingClient } from './SellerOnboarding.client'
import { sellerOnboardingDefaultProps } from './SellerOnboarding.fixtures'
import type { SellerOnboardingProps } from './SellerOnboarding.types'

export function SellerOnboarding({
  title = sellerOnboardingDefaultProps.title,
  saveExitLabel = sellerOnboardingDefaultProps.saveExitLabel,
  saveExitHref = sellerOnboardingDefaultProps.saveExitHref,
  stepLabels = sellerOnboardingDefaultProps.stepLabels,
  defaultStep = sellerOnboardingDefaultProps.defaultStep,
  currentStep,
  onCurrentStepChange,
  defaultValues = sellerOnboardingDefaultProps.defaultValues,
  categoryOptions = sellerOnboardingDefaultProps.categoryOptions,
  countryOptions = sellerOnboardingDefaultProps.countryOptions,
  businessTypeOptions = sellerOnboardingDefaultProps.businessTypeOptions,
  idTypeOptions = sellerOnboardingDefaultProps.idTypeOptions,
  documentSlots = sellerOnboardingDefaultProps.documentSlots,
  reviewBannerMessage = sellerOnboardingDefaultProps.reviewBannerMessage,
  onSaveExit,
  onSubmit = sellerOnboardingDefaultProps.onSubmit,
}: SellerOnboardingProps) {
  return (
    <SellerOnboardingClient
      title={title}
      saveExitLabel={saveExitLabel}
      saveExitHref={saveExitHref}
      stepLabels={stepLabels}
      defaultStep={defaultStep}
      {...(currentStep !== undefined ? { currentStep } : {})}
      {...(onCurrentStepChange !== undefined ? { onCurrentStepChange } : {})}
      defaultValues={defaultValues}
      categoryOptions={categoryOptions}
      countryOptions={countryOptions}
      businessTypeOptions={businessTypeOptions}
      idTypeOptions={idTypeOptions}
      documentSlots={documentSlots}
      reviewBannerMessage={reviewBannerMessage}
      {...(onSaveExit !== undefined ? { onSaveExit } : {})}
      onSubmit={onSubmit}
    />
  )
}
