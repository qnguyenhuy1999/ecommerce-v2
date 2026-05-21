import type { SellerOnboardingFormValues, SellerOnboardingProps } from './SellerOnboarding.types'

const demoAuthValue = ['sample', 'passcode', '01'].join('-')

export const sellerOnboardingDefaultValues: SellerOnboardingFormValues = {
  account: {
    email: 'seller@lumen.co',
    mobileNumber: '+65 9123 4567',
    password: demoAuthValue,
    otp: '284613',
  },
  shop: {
    shopName: 'Lumen Audio Official',
    shopUrl: 'lumen-audio',
    category: 'Audio',
    country: 'Singapore',
    pickupAddress: '60 Paya Lebar Road, #08-55 Paya Lebar Square, Singapore 409051',
  },
  kyc: {
    businessType: 'Individual',
    idType: 'National ID',
    legalName: 'Wei Lim',
    idNumber: 'S123 8842 A',
    bankName: 'DBS',
    accountHolder: 'Wei Lim',
    accountNumber: '0842 9988 4421',
    swiftRouting: 'DBSSSGSG',
    documents: {
      idFront: 'id-front.png',
      idBack: 'id-back.png',
      selfieWithId: 'selfie-with-id.png',
      businessRegistration: 'business-registration.pdf',
    },
  },
}

export const sellerOnboardingDefaultProps = {
  title: 'Halo Seller',
  saveExitLabel: 'Save & exit',
  saveExitHref: '#',
  stepLabels: ['Account', 'Shop', 'KYC', 'Review'],
  defaultStep: 1,
  defaultValues: sellerOnboardingDefaultValues,
  categoryOptions: ['Audio', 'Fashion', 'Beauty', 'Home', 'Electronics'],
  countryOptions: ['Singapore', 'Thailand', 'Malaysia', 'Indonesia', 'Vietnam'],
  businessTypeOptions: ['Individual', 'Company', 'Sole proprietorship'],
  idTypeOptions: ['National ID', 'Passport', 'Driver license'],
  documentSlots: [
    { key: 'idFront', label: 'ID front' },
    { key: 'idBack', label: 'ID back' },
    { key: 'selfieWithId', label: 'Selfie with ID' },
    { key: 'businessRegistration', label: 'Business reg' },
  ],
  reviewBannerMessage: 'All required fields complete. Submit for review when ready.',
  onSubmit: async () => {},
} satisfies Required<
  Pick<
    SellerOnboardingProps,
    | 'title'
    | 'saveExitLabel'
    | 'saveExitHref'
    | 'stepLabels'
    | 'defaultStep'
    | 'defaultValues'
    | 'categoryOptions'
    | 'countryOptions'
    | 'businessTypeOptions'
    | 'idTypeOptions'
    | 'documentSlots'
    | 'reviewBannerMessage'
    | 'onSubmit'
  >
>
