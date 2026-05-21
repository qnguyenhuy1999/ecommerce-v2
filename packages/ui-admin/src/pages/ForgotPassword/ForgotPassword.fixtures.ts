import type { ForgotPasswordProps } from './ForgotPassword.types'

const forgotPasswordSubmitFallback: NonNullable<ForgotPasswordProps['onSubmit']> = async () => {}

export const forgotPasswordDefaultProps: Required<
  Pick<
    ForgotPasswordProps,
    | 'title'
    | 'description'
    | 'emailLabel'
    | 'emailPlaceholder'
    | 'submitLabel'
    | 'submittingLabel'
    | 'successTitle'
    | 'successMessage'
    | 'backToLoginHref'
    | 'backToLoginLabel'
    | 'requestAccessHref'
    | 'requestAccessLabel'
  >
> &
  Pick<ForgotPasswordProps, 'onSubmit'> = {
  title: 'Reset operator access',
  description: 'Enter your admin email and we will send a secure password reset link.',
  emailLabel: 'Work email',
  emailPlaceholder: 'you@halo.market',
  submitLabel: 'Send reset link',
  submittingLabel: 'Sending reset link...',
  successTitle: 'Check your inbox',
  successMessage:
    'If that operator account exists, a reset link will arrive shortly with additional security instructions.',
  backToLoginHref: '/login',
  backToLoginLabel: 'Back to sign-in',
  requestAccessHref: '/request-access',
  requestAccessLabel: 'Request admin access',
  onSubmit: forgotPasswordSubmitFallback,
}
