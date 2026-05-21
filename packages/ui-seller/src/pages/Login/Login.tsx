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
  submitLabel = loginDefaultProps.submitLabel,
  submittingLabel = loginDefaultProps.submittingLabel,
  forgotPasswordHref = loginDefaultProps.forgotPasswordHref,
  forgotPasswordLabel = loginDefaultProps.forgotPasswordLabel,
  registerHref = loginDefaultProps.registerHref,
  registerLabel = loginDefaultProps.registerLabel,
  registerPrompt = loginDefaultProps.registerPrompt,
  noticeMessage,
  defaultEmail = loginDefaultProps.defaultEmail,
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
      submitLabel={submitLabel}
      submittingLabel={submittingLabel}
      forgotPasswordHref={forgotPasswordHref}
      forgotPasswordLabel={forgotPasswordLabel}
      registerHref={registerHref}
      registerLabel={registerLabel}
      registerPrompt={registerPrompt}
      {...(noticeMessage !== undefined ? { noticeMessage } : {})}
      defaultEmail={defaultEmail ?? loginDefaultProps.defaultEmail ?? ''}
      onSubmit={submitHandler}
    />
  )
}
