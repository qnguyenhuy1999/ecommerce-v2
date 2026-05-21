import { ResetPasswordClient } from './ResetPassword.client'
import { resetPasswordDefaultProps } from './ResetPassword.fixtures'
import type { ResetPasswordProps } from './ResetPassword.types'

export function ResetPassword({
  title = resetPasswordDefaultProps.title,
  description = resetPasswordDefaultProps.description,
  passwordLabel = resetPasswordDefaultProps.passwordLabel,
  passwordPlaceholder = resetPasswordDefaultProps.passwordPlaceholder,
  confirmPasswordLabel = resetPasswordDefaultProps.confirmPasswordLabel,
  confirmPasswordPlaceholder = resetPasswordDefaultProps.confirmPasswordPlaceholder,
  submitLabel = resetPasswordDefaultProps.submitLabel,
  submittingLabel = resetPasswordDefaultProps.submittingLabel,
  missingTokenTitle = resetPasswordDefaultProps.missingTokenTitle,
  missingTokenMessage = resetPasswordDefaultProps.missingTokenMessage,
  successTitle = resetPasswordDefaultProps.successTitle,
  successMessage = resetPasswordDefaultProps.successMessage,
  backToLoginHref = resetPasswordDefaultProps.backToLoginHref,
  backToLoginLabel = resetPasswordDefaultProps.backToLoginLabel,
  token,
  onSubmit = resetPasswordDefaultProps.onSubmit,
}: ResetPasswordProps) {
  const submitHandler: NonNullable<ResetPasswordProps['onSubmit']> =
    onSubmit ?? resetPasswordDefaultProps.onSubmit ?? (async () => {})

  return (
    <ResetPasswordClient
      title={title}
      description={description}
      passwordLabel={passwordLabel}
      passwordPlaceholder={passwordPlaceholder}
      confirmPasswordLabel={confirmPasswordLabel}
      confirmPasswordPlaceholder={confirmPasswordPlaceholder}
      submitLabel={submitLabel}
      submittingLabel={submittingLabel}
      missingTokenTitle={missingTokenTitle}
      missingTokenMessage={missingTokenMessage}
      successTitle={successTitle}
      successMessage={successMessage}
      backToLoginHref={backToLoginHref}
      backToLoginLabel={backToLoginLabel}
      {...(token !== undefined ? { token } : {})}
      onSubmit={submitHandler}
    />
  )
}
