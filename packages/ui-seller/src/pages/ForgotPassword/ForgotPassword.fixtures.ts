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
  >
> &
  Pick<ForgotPasswordProps, 'onSubmit'> = {
  title: 'Reset your password',
  description: 'Enter the email attached to your seller account and we will send a reset link.',
  emailLabel: 'Email',
  emailPlaceholder: 'seller@example.com',
  submitLabel: 'Send reset link',
  submittingLabel: 'Sending reset link...',
  successTitle: 'Check your inbox',
  successMessage: 'If that email exists, you will receive a password reset link shortly.',
  backToLoginHref: '/login',
  backToLoginLabel: 'Back to login',
  onSubmit: forgotPasswordSubmitFallback,
}
