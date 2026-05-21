export interface ForgotPasswordSubmitValues {
  email: string
}

export interface ForgotPasswordProps {
  title?: string
  description?: string
  emailLabel?: string
  emailPlaceholder?: string
  submitLabel?: string
  submittingLabel?: string
  successTitle?: string
  successMessage?: string
  backToLoginHref?: string
  backToLoginLabel?: string
  requestAccessHref?: string
  requestAccessLabel?: string
  onSubmit?: (values: ForgotPasswordSubmitValues) => void | Promise<void>
}
