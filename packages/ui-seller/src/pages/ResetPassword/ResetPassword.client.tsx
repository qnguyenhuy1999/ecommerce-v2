'use client'

import {
  Button,
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
  Input,
  Label,
  Typography,
} from '@ecom/core-ui'
import { CircleAlert, CircleCheckBig, KeyRound, ShieldAlert } from 'lucide-react'
import { useState } from 'react'
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

  return (
    <div
      className={`space-y-4 rounded-3xl border p-5 ${
        isWarning ? 'border-warning/20 bg-warning/10' : 'border-success/20 bg-success/10'
      }`}
    >
      <div
        className={`flex size-12 items-center justify-center rounded-2xl ${
          isWarning ? 'bg-warning text-warning-foreground' : 'bg-success text-success-foreground'
        }`}
      >
        {isWarning ? <ShieldAlert className="size-5" /> : <CircleCheckBig className="size-5" />}
      </div>
      <div className="space-y-1">
        <Typography variant="label" className={isWarning ? 'text-warning' : 'text-success'}>
          {title}
        </Typography>
        <Typography variant="body-sm" className={isWarning ? 'text-warning' : 'text-success'}>
          {message}
        </Typography>
      </div>
    </div>
  )
}

function PasswordField({ id, label, placeholder, value, onChange }: PasswordFieldProps) {
  return (
    <div className="space-y-2">
      <Label htmlFor={id}>{label}</Label>
      <div className="relative">
        <KeyRound className="text-muted-foreground pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2" />
        <Input
          id={id}
          type="password"
          autoComplete="new-password"
          required
          minLength={8}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder={placeholder}
          className="bg-background h-11 pl-10"
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

  const handleSubmit = async (event: React.SubmitEvent<HTMLFormElement>) => {
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
      <Card className="bg-card border-border shadow-sm">
        <CardHeader className="space-y-3 pb-2">
          <Typography variant="caption" className="text-muted-foreground tracking-[0.24em] uppercase">
            Password reset
          </Typography>
          <div className="space-y-1">
            <CardTitle className="text-foreground text-2xl">{title}</CardTitle>
            <Typography variant="body-sm" className="text-muted-foreground">
              {description}
            </Typography>
          </div>
        </CardHeader>
        <CardContent className="space-y-5">
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
                <div className="bg-destructive/10 text-destructive flex items-start gap-3 rounded-2xl border border-destructive/20 px-4 py-3 text-sm">
                  <CircleAlert className="mt-0.5 size-4 shrink-0" />
                  <span>{errorMessage}</span>
                </div>
              ) : null}

              <PasswordField
                id="seller-reset-password"
                label={passwordLabel}
                placeholder={passwordPlaceholder}
                value={password}
                onChange={setPassword}
              />

              <PasswordField
                id="seller-reset-password-confirm"
                label={confirmPasswordLabel}
                placeholder={confirmPasswordPlaceholder}
                value={confirmPassword}
                onChange={setConfirmPassword}
              />

              <Button type="submit" size="lg" className="w-full" loading={submitting}>
                {submitting ? submittingLabel : submitLabel}
              </Button>
            </form>
          )}
        </CardContent>
        <CardFooter>
          <a
            href={backToLoginHref}
            className="text-muted-foreground hover:text-foreground text-sm font-medium"
          >
            {backToLoginLabel}
          </a>
        </CardFooter>
      </Card>
    </AuthPageShell>
  )
}
