'use client'

import { Button, Card, CardContent, Checkbox, Input, Label, Typography } from '@ecom/core-ui'
import { ArrowLeft, CircleAlert, Eye, EyeOff, KeyRound, Mail, ShieldCheck } from 'lucide-react'
import { useState, type ReactNode, type SyntheticEvent } from 'react'
import {
  authIconClassName,
  authInputClassName,
  authLabelClassName,
  authPrimaryButtonClassName,
  authPrimaryLinkClassName,
  authSecondaryLinkClassName,
  authStatusToneClassNames,
  authSurfaceClassName,
} from '../../lib/auth-theme'
import { AuthPageShell } from '../../layouts/AuthPageShell'
import { loginDefaultProps } from './Login.fixtures'
import type { LoginProps, LoginSubmitValues } from './Login.types'

interface LoginClientProps {
  title: string
  description: string
  emailLabel: string
  emailPlaceholder: string
  passwordLabel: string
  passwordPlaceholder: string
  otpLabel: string
  otpPlaceholder: string
  otpHint: string
  securityBadge: string
  submitLabel: string
  submittingLabel: string
  forgotPasswordHref: string
  forgotPasswordLabel: string
  trustDeviceLabel: string
  trustDeviceHint: string
  passkeyLabel: string
  marketplaceHref: string
  marketplaceLabel: string
  sellerLoginHref: string
  sellerLoginLabel: string
  requestAccessHref: string
  requestAccessLabel: string
  policyMessage: string
  noticeMessage?: string
  defaultEmail: string
  defaultOtp: string
  onSubmit: NonNullable<LoginProps['onSubmit']>
}

interface FieldShellProps {
  id: string
  label: string
  children: ReactNode
  trailingContent?: ReactNode
}

interface LoginFormProps {
  emailLabel: string
  emailPlaceholder: string
  email: string
  onEmailChange: (value: string) => void
  passwordLabel: string
  passwordPlaceholder: string
  password: string
  onPasswordChange: (value: string) => void
  showPassword: boolean
  onTogglePassword: () => void
  forgotPasswordHref: string
  forgotPasswordLabel: string
  otpLabel: string
  otpPlaceholder: string
  otpHint: string
  otp: string
  onOtpChange: (value: string) => void
  trustDeviceLabel: string
  trustDeviceHint: string
  trustDevice: boolean
  onTrustDeviceChange: (checked: boolean) => void
  passkeyLabel: string
  submitLabel: string
  submittingLabel: string
  submitting: boolean
  onSubmit: (event: SyntheticEvent<HTMLFormElement>) => Promise<void>
}

function getErrorMessage(error: unknown) {
  if (error instanceof Error && error.message) {
    return error.message
  }

  return 'Sign in failed'
}

function FieldShell({ id, label, children, trailingContent }: FieldShellProps) {
  return (
    <div className="space-y-2.5">
      <div className="flex items-center justify-between gap-3">
        <Label htmlFor={id} className={authLabelClassName}>
          {label}
        </Label>
        {trailingContent}
      </div>
      {children}
    </div>
  )
}

function LoginHeader({
  title,
  description,
  securityBadge,
}: Pick<LoginClientProps, 'title' | 'description' | 'securityBadge'>) {
  return (
    <div className="flex items-start justify-between gap-4">
      <div className="space-y-2">
        <Typography
          as="h2"
          variant="h3"
          className="text-foreground text-[2rem] leading-tight font-semibold tracking-[-0.03em] text-balance"
        >
          {title}
        </Typography>
        <Typography variant="body-sm" className="text-muted-foreground text-[0.98rem] leading-6">
          {description}
        </Typography>
      </div>
      <div
        className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-sm font-semibold ${authStatusToneClassNames.success.container} ${authStatusToneClassNames.success.text}`}
      >
        <span
          className={`inline-flex size-2 rounded-full ${authStatusToneClassNames.success.dot}`}
        />
        <span>{securityBadge}</span>
      </div>
    </div>
  )
}

function LoginNotice({ message }: { message: string }) {
  return (
    <div
      role="status"
      aria-live="polite"
      className={`rounded-2xl border px-4 py-3 text-sm ${authStatusToneClassNames.success.container} ${authStatusToneClassNames.success.text}`}
    >
      {message}
    </div>
  )
}

function LoginError({ message }: { message: string }) {
  return (
    <div
      role="alert"
      aria-live="assertive"
      className={`flex items-start gap-3 rounded-2xl border px-4 py-3 text-sm ${authStatusToneClassNames.destructive.container} ${authStatusToneClassNames.destructive.text}`}
    >
      <CircleAlert className="mt-0.5 size-4 shrink-0" />
      <span>{message}</span>
    </div>
  )
}

function LoginForm({
  emailLabel,
  emailPlaceholder,
  email,
  onEmailChange,
  passwordLabel,
  passwordPlaceholder,
  password,
  onPasswordChange,
  showPassword,
  onTogglePassword,
  forgotPasswordHref,
  forgotPasswordLabel,
  otpLabel,
  otpPlaceholder,
  otpHint,
  otp,
  onOtpChange,
  trustDeviceLabel,
  trustDeviceHint,
  trustDevice,
  onTrustDeviceChange,
  passkeyLabel,
  submitLabel,
  submittingLabel,
  submitting,
  onSubmit,
}: LoginFormProps) {
  return (
    <form onSubmit={(event) => void onSubmit(event)} className="space-y-4.5">
      <FieldShell id="admin-login-email" label={emailLabel}>
        <div className="relative">
          <Mail className={authIconClassName} />
          <Input
            id="admin-login-email"
            type="email"
            autoComplete="email"
            required
            value={email}
            onChange={(event) => onEmailChange(event.target.value)}
            placeholder={emailPlaceholder}
            className={authInputClassName}
          />
        </div>
      </FieldShell>

      <FieldShell
        id="admin-login-password"
        label={passwordLabel}
        trailingContent={
          <a href={forgotPasswordHref} className={authPrimaryLinkClassName}>
            {forgotPasswordLabel}
          </a>
        }
      >
        <div className="relative">
          <KeyRound className={authIconClassName} />
          <Input
            id="admin-login-password"
            type={showPassword ? 'text' : 'password'}
            autoComplete="current-password"
            required
            value={password}
            onChange={(event) => onPasswordChange(event.target.value)}
            placeholder={passwordPlaceholder}
            className={authInputClassName}
          />
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            className="text-muted-foreground hover:text-foreground absolute top-1/2 right-2 -translate-y-1/2 hover:bg-transparent"
            onClick={onTogglePassword}
            aria-label={showPassword ? 'Hide password' : 'Show password'}
          >
            {showPassword ? <EyeOff /> : <Eye />}
          </Button>
        </div>
      </FieldShell>

      <FieldShell
        id="admin-login-otp"
        label={otpLabel}
        trailingContent={
          <Typography variant="body-sm" className="text-muted-foreground">
            {otpHint}
          </Typography>
        }
      >
        <div className="relative">
          <ShieldCheck className={authIconClassName} />
          <Input
            id="admin-login-otp"
            inputMode="numeric"
            autoComplete="one-time-code"
            required
            value={otp}
            onChange={(event) => onOtpChange(event.target.value)}
            placeholder={otpPlaceholder}
            className={`${authInputClassName} tracking-[0.36em]`}
          />
        </div>
      </FieldShell>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <label
          htmlFor="admin-login-trust-device"
          className="text-foreground flex items-center gap-3 text-sm"
        >
          <Checkbox
            id="admin-login-trust-device"
            checked={trustDevice}
            onCheckedChange={(checked) => onTrustDeviceChange(checked === true)}
            className="border-input"
          />
          <span className="flex items-center gap-1.5">
            <span>{trustDeviceLabel}</span>
            <span className="text-muted-foreground">{trustDeviceHint}</span>
          </span>
        </label>

        <span
          aria-disabled="true"
          className="text-muted-foreground inline-flex items-center gap-2 text-sm font-medium"
        >
          <ShieldCheck className="text-muted-foreground/70 size-4" />
          <span>{passkeyLabel}</span>
        </span>
      </div>

      <Button type="submit" size="lg" className={authPrimaryButtonClassName} loading={submitting}>
        {submitting ? submittingLabel : submitLabel}
      </Button>
    </form>
  )
}

function LoginFooterLinks({
  marketplaceHref,
  marketplaceLabel,
  sellerLoginHref,
  sellerLoginLabel,
  requestAccessHref,
  requestAccessLabel,
}: Pick<
  LoginClientProps,
  | 'marketplaceHref'
  | 'marketplaceLabel'
  | 'sellerLoginHref'
  | 'sellerLoginLabel'
  | 'requestAccessHref'
  | 'requestAccessLabel'
>) {
  return (
    <div className="border-border flex flex-wrap items-center justify-between gap-x-4 gap-y-3 border-t pt-4 text-sm">
      <a
        href={marketplaceHref}
        className={`inline-flex items-center gap-2 ${authSecondaryLinkClassName}`}
      >
        <ArrowLeft className="size-4" />
        {marketplaceLabel}
      </a>
      <div className="flex items-center gap-4">
        <a href={sellerLoginHref} className={authSecondaryLinkClassName}>
          {sellerLoginLabel}
        </a>
        <a href={requestAccessHref} className={authPrimaryLinkClassName}>
          {requestAccessLabel}
        </a>
      </div>
    </div>
  )
}

export function LoginClient({
  title,
  description,
  emailLabel,
  emailPlaceholder,
  passwordLabel,
  passwordPlaceholder,
  otpLabel,
  otpPlaceholder,
  otpHint,
  securityBadge,
  submitLabel,
  submittingLabel,
  forgotPasswordHref,
  forgotPasswordLabel,
  trustDeviceLabel,
  trustDeviceHint,
  passkeyLabel,
  marketplaceHref,
  marketplaceLabel,
  sellerLoginHref,
  sellerLoginLabel,
  requestAccessHref,
  requestAccessLabel,
  policyMessage,
  noticeMessage,
  defaultEmail,
  defaultOtp,
  onSubmit,
}: LoginClientProps) {
  const submitHandler = onSubmit ?? loginDefaultProps.onSubmit
  const [email, setEmail] = useState(defaultEmail ?? loginDefaultProps.defaultEmail)
  const [password, setPassword] = useState('')
  const [otp, setOtp] = useState(defaultOtp ?? loginDefaultProps.defaultOtp)
  const [trustDevice, setTrustDevice] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async (event: SyntheticEvent<HTMLFormElement>) => {
    event.preventDefault()
    setErrorMessage('')
    setSubmitting(true)

    const values: LoginSubmitValues = { email, password, otp, trustDevice }

    try {
      await submitHandler(values)
    } catch (error) {
      setErrorMessage(getErrorMessage(error))
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <AuthPageShell title={title} description={description}>
      <div className="space-y-4">
        <Card className={authSurfaceClassName}>
          <CardContent className="space-y-6 p-5 sm:p-6">
            <LoginHeader title={title} description={description} securityBadge={securityBadge} />

            {noticeMessage ? <LoginNotice message={noticeMessage} /> : null}
            {errorMessage ? <LoginError message={errorMessage} /> : null}

            <LoginForm
              emailLabel={emailLabel}
              emailPlaceholder={emailPlaceholder}
              email={email}
              onEmailChange={setEmail}
              passwordLabel={passwordLabel}
              passwordPlaceholder={passwordPlaceholder}
              password={password}
              onPasswordChange={setPassword}
              showPassword={showPassword}
              onTogglePassword={() => setShowPassword((current) => !current)}
              forgotPasswordHref={forgotPasswordHref}
              forgotPasswordLabel={forgotPasswordLabel}
              otpLabel={otpLabel}
              otpPlaceholder={otpPlaceholder}
              otpHint={otpHint}
              otp={otp}
              onOtpChange={setOtp}
              trustDeviceLabel={trustDeviceLabel}
              trustDeviceHint={trustDeviceHint}
              trustDevice={trustDevice}
              onTrustDeviceChange={setTrustDevice}
              passkeyLabel={passkeyLabel}
              submitLabel={submitLabel}
              submittingLabel={submittingLabel}
              submitting={submitting}
              onSubmit={handleSubmit}
            />

            <LoginFooterLinks
              marketplaceHref={marketplaceHref}
              marketplaceLabel={marketplaceLabel}
              sellerLoginHref={sellerLoginHref}
              sellerLoginLabel={sellerLoginLabel}
              requestAccessHref={requestAccessHref}
              requestAccessLabel={requestAccessLabel}
            />
          </CardContent>
        </Card>

        <Typography
          variant="caption"
          className="text-muted-foreground block px-1 text-center text-[0.95rem] lg:text-left"
        >
          {policyMessage}
        </Typography>
      </div>
    </AuthPageShell>
  )
}
