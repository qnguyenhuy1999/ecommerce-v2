'use client'

import { Button, Card, CardContent, Input, Label, Typography } from '@ecom/core-ui'
import { CircleAlert, Mail, Send } from 'lucide-react'
import { useState, type SyntheticEvent } from 'react'
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
import { forgotPasswordDefaultProps } from './ForgotPassword.fixtures'
import type { ForgotPasswordProps, ForgotPasswordSubmitValues } from './ForgotPassword.types'

interface ForgotPasswordClientProps {
  title: string
  description: string
  emailLabel: string
  emailPlaceholder: string
  submitLabel: string
  submittingLabel: string
  successTitle: string
  successMessage: string
  backToLoginHref: string
  backToLoginLabel: string
  requestAccessHref: string
  requestAccessLabel: string
  onSubmit: NonNullable<ForgotPasswordProps['onSubmit']>
}

function getErrorMessage(error: unknown) {
  if (error instanceof Error && error.message) {
    return error.message
  }

  return 'Request failed'
}

export function ForgotPasswordClient({
  title,
  description,
  emailLabel,
  emailPlaceholder,
  submitLabel,
  submittingLabel,
  successTitle,
  successMessage,
  backToLoginHref,
  backToLoginLabel,
  requestAccessHref,
  requestAccessLabel,
  onSubmit,
}: ForgotPasswordClientProps) {
  const submitHandler = onSubmit ?? forgotPasswordDefaultProps.onSubmit
  const [email, setEmail] = useState('')
  const [errorMessage, setErrorMessage] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [sent, setSent] = useState(false)

  const handleSubmit = async (event: SyntheticEvent<HTMLFormElement>) => {
    event.preventDefault()
    setErrorMessage('')
    setSubmitting(true)

    const values: ForgotPasswordSubmitValues = { email }

    try {
      await submitHandler(values)
      setSent(true)
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

          {sent ? (
            <div
              role="status"
              aria-live="polite"
              className={`space-y-4 rounded-[24px] border p-5 ${authStatusToneClassNames.success.container}`}
            >
              <div
                className={`flex size-12 items-center justify-center rounded-2xl ${authStatusToneClassNames.success.icon}`}
              >
                <Send className="size-5" />
              </div>
              <div className="space-y-1">
                <Typography variant="label" className={authStatusToneClassNames.success.text}>
                  {successTitle}
                </Typography>
                <Typography variant="body-sm" className={authStatusToneClassNames.success.text}>
                  {successMessage}
                </Typography>
              </div>
            </div>
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

              <div className="space-y-2">
                <Label htmlFor="admin-forgot-password-email" className={authLabelClassName}>
                  {emailLabel}
                </Label>
                <div className="relative">
                  <Mail className={authIconClassName} />
                  <Input
                    id="admin-forgot-password-email"
                    type="email"
                    autoComplete="email"
                    required
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    placeholder={emailPlaceholder}
                    className={authInputClassName.replace('pr-11', '')}
                  />
                </div>
              </div>

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

          <div className="border-border flex items-center justify-between gap-3 border-t pt-4 text-sm">
            <a href={backToLoginHref} className={authSecondaryLinkClassName}>
              {backToLoginLabel}
            </a>
            <a href={requestAccessHref} className={authPrimaryLinkClassName}>
              {requestAccessLabel}
            </a>
          </div>
        </CardContent>
      </Card>
    </AuthPageShell>
  )
}
