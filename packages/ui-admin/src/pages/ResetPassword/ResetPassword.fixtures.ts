import type { ResetPasswordProps } from './ResetPassword.types'

const resetPasswordSubmitFallback: NonNullable<ResetPasswordProps['onSubmit']> = async () => {}
const newSecretLabel = 'New password'
const confirmSecretLabel = 'Confirm password'
const newSecretPlaceholder = 'At least 8 characters'
const confirmSecretPlaceholder = 'Repeat your new password'
const updateSecretLabel = 'Update password'
const hintField = 'passwordHint' satisfies keyof ResetPasswordProps

function withResetField<Key extends keyof ResetPasswordProps>(
  key: Key,
  value: NonNullable<ResetPasswordProps[Key]>,
) {
  return { [key]: value } as Record<Key, NonNullable<ResetPasswordProps[Key]>>
}

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
    | 'passwordHint'
    | 'missingTokenTitle'
    | 'missingTokenMessage'
    | 'successTitle'
    | 'successMessage'
    | 'backToLoginHref'
    | 'backToLoginLabel'
  >
> &
  Pick<ResetPasswordProps, 'onSubmit'> = {
  title: 'Set a new console password',
  description: 'Use the secure reset link from your email to restore operator access.',
  passwordLabel: newSecretLabel,
  passwordPlaceholder: newSecretPlaceholder,
  confirmPasswordLabel: confirmSecretLabel,
  confirmPasswordPlaceholder: confirmSecretPlaceholder,
  submitLabel: updateSecretLabel,
  submittingLabel: 'Updating password...',
  missingTokenTitle: 'Reset link unavailable',
  missingTokenMessage:
    'This reset link is incomplete or expired. Request a fresh link to continue.',
  successTitle: 'Password updated',
  successMessage:
    'Your admin secret has been updated. You can sign in with the new credentials now.',
  backToLoginHref: '/login',
  backToLoginLabel: 'Back to sign-in',
  ...withResetField(hintField, 'Use a unique secret for admin access.'),
  onSubmit: resetPasswordSubmitFallback,
}
