export interface LoginSubmitValues {
  email: string
  password: string
  otp: string
  trustDevice: boolean
}

export interface LoginProps {
  title?: string
  description?: string
  emailLabel?: string
  emailPlaceholder?: string
  passwordLabel?: string
  passwordPlaceholder?: string
  otpLabel?: string
  otpPlaceholder?: string
  otpHint?: string
  securityBadge?: string
  submitLabel?: string
  submittingLabel?: string
  forgotPasswordHref?: string
  forgotPasswordLabel?: string
  trustDeviceLabel?: string
  trustDeviceHint?: string
  passkeyLabel?: string
  marketplaceHref?: string
  marketplaceLabel?: string
  sellerLoginHref?: string
  sellerLoginLabel?: string
  requestAccessHref?: string
  requestAccessLabel?: string
  policyMessage?: string
  noticeMessage?: string
  defaultEmail?: string
  defaultOtp?: string
  onSubmit?: (values: LoginSubmitValues) => void | Promise<void>
}
