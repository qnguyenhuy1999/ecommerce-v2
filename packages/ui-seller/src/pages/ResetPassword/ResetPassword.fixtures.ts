import type { ResetPasswordProps } from './ResetPassword.types'

const resetPasswordSubmitFallback: NonNullable<ResetPasswordProps['onSubmit']> = async () => {}

export const resetPasswordDefaultProps: Required<
  Pick<
    ResetPasswordProps,
    | 'title'
    | 'description'
    | 'passwordLabel'
    | 'passwordPlaceholder'
    | 'confirmPasswordLabel'
    | 'confirmPasswordPlaceholder'
    | 'submitLabel'
    | 'submittingLabel'
    | 'missingTokenTitle'
    | 'missingTokenMessage'
    | 'successTitle'
    | 'successMessage'
    | 'backToLoginHref'
    | 'backToLoginLabel'
  >
> &
  Pick<ResetPasswordProps, 'onSubmit'> = {
  title: 'Create a new password',
  description: 'Use the reset link from your email to choose a new password for your seller account.',
  passwordLabel: 'New password',
  passwordPlaceholder: 'At least 8 characters',
  confirmPasswordLabel: 'Confirm password',
  confirmPasswordPlaceholder: 'Repeat your new password',
  submitLabel: 'Reset password',
  submittingLabel: 'Resetting password...',
  missingTokenTitle: 'Reset link unavailable',
  missingTokenMessage: 'This password reset link is incomplete or expired. Request a new link to continue.',
  successTitle: 'Password updated',
  successMessage: 'Your password has been reset successfully. You can now sign in with the new password.',
  backToLoginHref: '/login',
  backToLoginLabel: 'Back to login',
  onSubmit: resetPasswordSubmitFallback,
}
