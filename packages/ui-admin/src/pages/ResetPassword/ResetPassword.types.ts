export interface ResetPasswordSubmitValues {
  token: string
  password: string
}

export interface ResetPasswordProps {
  title?: string
  description?: string
  passwordLabel?: string
  passwordPlaceholder?: string
  confirmPasswordLabel?: string
  confirmPasswordPlaceholder?: string
  submitLabel?: string
  submittingLabel?: string
  passwordHint?: string
  missingTokenTitle?: string
  missingTokenMessage?: string
  successTitle?: string
  successMessage?: string
  backToLoginHref?: string
  backToLoginLabel?: string
  token?: string
  onSubmit?: (values: ResetPasswordSubmitValues) => void | Promise<void>
}
