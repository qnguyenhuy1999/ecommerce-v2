export interface LoginSubmitValues {
  email: string
  password: string
}

export interface LoginProps {
  title?: string
  description?: string
  emailLabel?: string
  emailPlaceholder?: string
  passwordLabel?: string
  passwordPlaceholder?: string
  submitLabel?: string
  submittingLabel?: string
  forgotPasswordHref?: string
  forgotPasswordLabel?: string
  registerHref?: string
  registerLabel?: string
  registerPrompt?: string
  noticeMessage?: string
  defaultEmail?: string
  onSubmit?: (values: LoginSubmitValues) => void | Promise<void>
}
