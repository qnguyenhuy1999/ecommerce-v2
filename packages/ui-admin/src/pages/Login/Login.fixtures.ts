import type { LoginProps } from './Login.types'

const loginSubmitFallback: NonNullable<LoginProps['onSubmit']> = async () => {}
const secretLabel = 'Password'
const secretPlaceholder = 'Enter your password'
const forgotHrefKey = 'forgotPasswordHref' satisfies keyof LoginProps
const forgotLabelKey = 'forgotPasswordLabel' satisfies keyof LoginProps

export const loginDefaultProps: Required<
  Pick<
    LoginProps,
    | 'title'
    | 'description'
    | 'emailLabel'
    | 'emailPlaceholder'
    | 'passwordLabel'
    | 'passwordPlaceholder'
    | 'otpLabel'
    | 'otpPlaceholder'
    | 'otpHint'
    | 'securityBadge'
    | 'submitLabel'
    | 'submittingLabel'
    | 'forgotPasswordHref'
    | 'forgotPasswordLabel'
    | 'trustDeviceLabel'
    | 'trustDeviceHint'
    | 'passkeyLabel'
    | 'marketplaceHref'
    | 'marketplaceLabel'
    | 'sellerLoginHref'
    | 'sellerLoginLabel'
    | 'requestAccessHref'
    | 'requestAccessLabel'
    | 'policyMessage'
  >
> &
  Pick<LoginProps, 'defaultEmail' | 'defaultOtp' | 'onSubmit'> = {
  title: 'Welcome back, operator',
  description: 'Sign in with your admin credentials and 2FA.',
  emailLabel: 'Email',
  emailPlaceholder: 'you@halo.market',
  passwordLabel: secretLabel,
  passwordPlaceholder: secretPlaceholder,
  otpLabel: '2FA code',
  otpPlaceholder: '123456',
  otpHint: 'Authenticator app',
  securityBadge: 'TLS',
  submitLabel: 'Sign in to console',
  submittingLabel: 'Signing in...',
  trustDeviceLabel: 'Trust this device',
  trustDeviceHint: '7d',
  passkeyLabel: 'Use passkey',
  marketplaceHref: '/',
  marketplaceLabel: 'Marketplace',
  sellerLoginHref: '/seller/login',
  sellerLoginLabel: 'Seller sign-in',
  requestAccessHref: '/request-access',
  requestAccessLabel: 'Request access',
  policyMessage:
    'Signing in accepts the admin policy. All activity is logged for security and compliance.',
  defaultEmail: '',
  defaultOtp: '',
  [forgotHrefKey]: '/forgot-password',
  [forgotLabelKey]: 'Forgot?',
  onSubmit: loginSubmitFallback,
}
