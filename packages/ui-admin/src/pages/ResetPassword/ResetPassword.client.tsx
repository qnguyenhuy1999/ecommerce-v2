'use client'

import { Button, Card, CardContent, Input, Label, Typography } from '@ecom/core-ui'
import { CircleAlert, CircleCheckBig, KeyRound, ShieldAlert } from 'lucide-react'
import { useState, type SyntheticEvent } from 'react'
import {
  authIconClassName,
  authInputClassName,
  authLabelClassName,
  authPrimaryButtonClassName,
  authSecondaryLinkClassName,
  authStatusToneClassNames,
  authSurfaceClassName,
} from '../../lib/auth-theme'
import { AuthPageShell } from '../../layouts/AuthPageShell'
import { resetPasswordDefaultProps } from './ResetPassword.fixtures'
import type { ResetPasswordProps, ResetPasswordSubmitValues } from './ResetPassword.types'

interface ResetPasswordClientProps {
  title: string
  description: string
  passwordLabel: string
  passwordPlaceholder: string
  confirmPasswordLabel: string
  confirmPasswordPlaceholder: string
  submitLabel: string
  submittingLabel: string
  passwordHint: string
  missingTokenTitle: string
  missingTokenMessage: string
  successTitle: string
  successMessage: string
  backToLoginHref: string
  backToLoginLabel: string
  token?: string
  onSubmit: NonNullable<ResetPasswordProps['onSubmit']>
}

interface ResetPasswordStatusProps {
  tone: 'warning' | 'success'
  title: string
  message: string
}

interface PasswordFieldProps {
  id: string
  label: string
  placeholder: string
  value: string
  onChange: (value: string) => void
}

function getErrorMessage(error: unknown) {
  if (error instanceof Error && error.message) {
    return error.message
  }

  return 'Password reset failed'
}

function ResetPasswordStatus({ tone, title, message }: ResetPasswordStatusProps) {
  const isWarning = tone === 'warning'
  const toneClassNames = isWarning
    ? authStatusToneClassNames.warning
    : authStatusToneClassNames.success

  return (
    <div
      role={isWarning ? 'alert' : 'status'}
      aria-live={isWarning ? 'assertive' : 'polite'}
      className={`space-y-4 rounded-[24px] border p-5 ${toneClassNames.container}`}
    >
      <div
        className={`flex size-12 items-center justify-center rounded-2xl ${toneClassNames.icon}`}
      >
        {isWarning ? <ShieldAlert className="size-5" /> : <CircleCheckBig className="size-5" />}
      </div>
      <div className="space-y-1">
        <Typography variant="label" className={toneClassNames.text}>
          {title}
        </Typography>
        <Typography variant="body-sm" className={toneClassNames.text}>
          {message}
        </Typography>
      </div>
    </div>
  )
}

function PasswordField({ id, label, placeholder, value, onChange }: PasswordFieldProps) {
  return (
    <div className="space-y-2">
      <Label htmlFor={id} className={authLabelClassName}>
        {label}
      </Label>
      <div className="relative">
        <KeyRound className={authIconClassName} />
        <Input
          id={id}
          type="password"
          autoComplete="new-password"
          required
          minLength={8}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder={placeholder}
          className={authInputClassName.replace('pr-11', '')}
        />
      </div>
    </div>
  )
}

export function ResetPasswordClient({
  title,
  description,
  passwordLabel,
  passwordPlaceholder,
  confirmPasswordLabel,
  confirmPasswordPlaceholder,
  submitLabel,
  submittingLabel,
  passwordHint,
  missingTokenTitle,
  missingTokenMessage,
  successTitle,
  successMessage,
  backToLoginHref,
  backToLoginLabel,
  token,
  onSubmit,
}: ResetPasswordClientProps) {
  const submitHandler = onSubmit ?? resetPasswordDefaultProps.onSubmit
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [errorMessage, setErrorMessage] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [completed, setCompleted] = useState(false)

  const handleSubmit = async (event: SyntheticEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (!token) {
      setErrorMessage(missingTokenMessage)
      return
    }

    if (password.length < 8) {
      setErrorMessage('Password must be at least 8 characters.')
      return
    }

    if (password !== confirmPassword) {
      setErrorMessage('Passwords do not match.')
      return
    }

    setErrorMessage('')
    setSubmitting(true)

    const values: ResetPasswordSubmitValues = { token, password }

    try {
      await submitHandler(values)
      setCompleted(true)
    } catch (error) {
      setErrorMessage(getErrorMessage(error))
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <AuthPageShell title={title} description={description}>
      <Card className={authSurfaceClassName}>
        <CardContent className="space-y-6 p-5 sm:p-6">
          <div className="space-y-2">
            <Typography
              as="h2"
              variant="h3"
              className="text-foreground text-[2rem] leading-tight font-semibold tracking-[-0.03em] text-balance"
            >
              {title}
            </Typography>
            <Typography
              variant="body-sm"
              className="text-muted-foreground text-[0.98rem] leading-6"
            >
              {description}
            </Typography>
          </div>

          {!token ? (
            <ResetPasswordStatus
              tone="warning"
              title={missingTokenTitle}
              message={missingTokenMessage}
            />
          ) : completed ? (
            <ResetPasswordStatus tone="success" title={successTitle} message={successMessage} />
          ) : (
            <form onSubmit={(event) => void handleSubmit(event)} className="space-y-4">
              {errorMessage ? (
                <div
                  role="alert"
                  aria-live="assertive"
                  className={`flex items-start gap-3 rounded-2xl border px-4 py-3 text-sm ${authStatusToneClassNames.destructive.container} ${authStatusToneClassNames.destructive.text}`}
                >
                  <CircleAlert className="mt-0.5 size-4 shrink-0" />
                  <span>{errorMessage}</span>
                </div>
              ) : null}

              <PasswordField
                id="admin-reset-password"
                label={passwordLabel}
                placeholder={passwordPlaceholder}
                value={password}
                onChange={setPassword}
              />

              <PasswordField
                id="admin-reset-password-confirm"
                label={confirmPasswordLabel}
                placeholder={confirmPasswordPlaceholder}
                value={confirmPassword}
                onChange={setConfirmPassword}
              />

              <Typography variant="body-sm" className="text-muted-foreground text-[0.95rem]">
                {passwordHint}
              </Typography>

              <Button
                type="submit"
                size="lg"
                className={authPrimaryButtonClassName}
                loading={submitting}
              >
                {submitting ? submittingLabel : submitLabel}
              </Button>
            </form>
          )}

          <div className="border-border border-t pt-4 text-sm">
            <a href={backToLoginHref} className={authSecondaryLinkClassName}>
              {backToLoginLabel}
            </a>
          </div>
        </CardContent>
      </Card>
    </AuthPageShell>
  )
}
