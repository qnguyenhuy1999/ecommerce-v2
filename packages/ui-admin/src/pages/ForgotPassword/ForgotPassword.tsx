import { ForgotPasswordClient } from './ForgotPassword.client'
import { forgotPasswordDefaultProps } from './ForgotPassword.fixtures'
import type { ForgotPasswordProps } from './ForgotPassword.types'

export function ForgotPassword({
  title = forgotPasswordDefaultProps.title,
  description = forgotPasswordDefaultProps.description,
  emailLabel = forgotPasswordDefaultProps.emailLabel,
  emailPlaceholder = forgotPasswordDefaultProps.emailPlaceholder,
  submitLabel = forgotPasswordDefaultProps.submitLabel,
  submittingLabel = forgotPasswordDefaultProps.submittingLabel,
  successTitle = forgotPasswordDefaultProps.successTitle,
  successMessage = forgotPasswordDefaultProps.successMessage,
  backToLoginHref = forgotPasswordDefaultProps.backToLoginHref,
  backToLoginLabel = forgotPasswordDefaultProps.backToLoginLabel,
  requestAccessHref = forgotPasswordDefaultProps.requestAccessHref,
  requestAccessLabel = forgotPasswordDefaultProps.requestAccessLabel,
  onSubmit = forgotPasswordDefaultProps.onSubmit,
}: ForgotPasswordProps) {
  const submitHandler: NonNullable<ForgotPasswordProps['onSubmit']> =
    onSubmit ?? forgotPasswordDefaultProps.onSubmit ?? (async () => {})

  return (
    <ForgotPasswordClient
      title={title}
      description={description}
      emailLabel={emailLabel}
      emailPlaceholder={emailPlaceholder}
      submitLabel={submitLabel}
      submittingLabel={submittingLabel}
      successTitle={successTitle}
      successMessage={successMessage}
      backToLoginHref={backToLoginHref}
      backToLoginLabel={backToLoginLabel}
      requestAccessHref={requestAccessHref}
      requestAccessLabel={requestAccessLabel}
      onSubmit={submitHandler}
    />
  )
}
