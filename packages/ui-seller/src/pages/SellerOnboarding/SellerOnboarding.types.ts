export type SellerOnboardingStep = 'account' | 'shop' | 'kyc' | 'review'
export type SellerOnboardingStepIndex = 1 | 2 | 3 | 4

export type SellerOnboardingDocumentKey =
  | 'idFront'
  | 'idBack'
  | 'selfieWithId'
  | 'businessRegistration'

export interface SellerOnboardingAccountValues {
  email: string
  mobileNumber: string
  password: string
  otp: string
}

export interface SellerOnboardingShopValues {
  shopName: string
  shopUrl: string
  category: string
  country: string
  pickupAddress: string
}

export interface SellerOnboardingKycValues {
  businessType: string
  idType: string
  legalName: string
  idNumber: string
  bankName: string
  accountHolder: string
  accountNumber: string
  swiftRouting: string
  documents: Record<SellerOnboardingDocumentKey, string>
}

export interface SellerOnboardingFormValues {
  account: SellerOnboardingAccountValues
  shop: SellerOnboardingShopValues
  kyc: SellerOnboardingKycValues
}

export interface SellerOnboardingDocumentSlot {
  key: SellerOnboardingDocumentKey
  label: string
}

export interface SellerOnboardingProps {
  title?: string
  saveExitLabel?: string
  saveExitHref?: string
  stepLabels?: [string, string, string, string]
  defaultStep?: SellerOnboardingStepIndex
  currentStep?: SellerOnboardingStepIndex
  onCurrentStepChange?: (step: SellerOnboardingStepIndex) => void
  defaultValues?: SellerOnboardingFormValues
  categoryOptions?: string[]
  countryOptions?: string[]
  businessTypeOptions?: string[]
  idTypeOptions?: string[]
  documentSlots?: SellerOnboardingDocumentSlot[]
  reviewBannerMessage?: string
  onSaveExit?: (values: SellerOnboardingFormValues) => void | Promise<void>
  onSubmit?: (values: SellerOnboardingFormValues) => void | Promise<void>
}
