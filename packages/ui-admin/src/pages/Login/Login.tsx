import { LoginClient } from './Login.client'
import { loginDefaultProps } from './Login.fixtures'
import type { LoginProps } from './Login.types'

export function Login({
  title = loginDefaultProps.title,
  description = loginDefaultProps.description,
  emailLabel = loginDefaultProps.emailLabel,
  emailPlaceholder = loginDefaultProps.emailPlaceholder,
  passwordLabel = loginDefaultProps.passwordLabel,
  passwordPlaceholder = loginDefaultProps.passwordPlaceholder,
  otpLabel = loginDefaultProps.otpLabel,
  otpPlaceholder = loginDefaultProps.otpPlaceholder,
  otpHint = loginDefaultProps.otpHint,
  securityBadge = loginDefaultProps.securityBadge,
  submitLabel = loginDefaultProps.submitLabel,
  submittingLabel = loginDefaultProps.submittingLabel,
  forgotPasswordHref = loginDefaultProps.forgotPasswordHref,
  forgotPasswordLabel = loginDefaultProps.forgotPasswordLabel,
  trustDeviceLabel = loginDefaultProps.trustDeviceLabel,
  trustDeviceHint = loginDefaultProps.trustDeviceHint,
  passkeyLabel = loginDefaultProps.passkeyLabel,
  marketplaceHref = loginDefaultProps.marketplaceHref,
  marketplaceLabel = loginDefaultProps.marketplaceLabel,
  sellerLoginHref = loginDefaultProps.sellerLoginHref,
  sellerLoginLabel = loginDefaultProps.sellerLoginLabel,
  requestAccessHref = loginDefaultProps.requestAccessHref,
  requestAccessLabel = loginDefaultProps.requestAccessLabel,
  policyMessage = loginDefaultProps.policyMessage,
  noticeMessage,
  defaultEmail = loginDefaultProps.defaultEmail,
  defaultOtp = loginDefaultProps.defaultOtp,
  onSubmit = loginDefaultProps.onSubmit,
}: LoginProps) {
  const submitHandler: NonNullable<LoginProps['onSubmit']> =
    onSubmit ?? loginDefaultProps.onSubmit ?? (async () => {})

  return (
    <LoginClient
      title={title}
      description={description}
      emailLabel={emailLabel}
      emailPlaceholder={emailPlaceholder}
      passwordLabel={passwordLabel}
      passwordPlaceholder={passwordPlaceholder}
      otpLabel={otpLabel}
      otpPlaceholder={otpPlaceholder}
      otpHint={otpHint}
      securityBadge={securityBadge}
      submitLabel={submitLabel}
      submittingLabel={submittingLabel}
      forgotPasswordHref={forgotPasswordHref}
      forgotPasswordLabel={forgotPasswordLabel}
      trustDeviceLabel={trustDeviceLabel}
      trustDeviceHint={trustDeviceHint}
      passkeyLabel={passkeyLabel}
      marketplaceHref={marketplaceHref}
      marketplaceLabel={marketplaceLabel}
      sellerLoginHref={sellerLoginHref}
      sellerLoginLabel={sellerLoginLabel}
      requestAccessHref={requestAccessHref}
      requestAccessLabel={requestAccessLabel}
      policyMessage={policyMessage}
      {...(noticeMessage !== undefined ? { noticeMessage } : {})}
      defaultEmail={defaultEmail ?? loginDefaultProps.defaultEmail ?? ''}
      defaultOtp={defaultOtp ?? loginDefaultProps.defaultOtp ?? ''}
      onSubmit={submitHandler}
    />
  )
}
