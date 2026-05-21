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
import { CircleAlert, KeyRound, Mail } from 'lucide-react'
import { useState } from 'react'
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
  submitLabel: string
  submittingLabel: string
  forgotPasswordHref: string
  forgotPasswordLabel: string
  registerHref: string
  registerLabel: string
  registerPrompt: string
  noticeMessage?: string
  defaultEmail: string
  onSubmit: NonNullable<LoginProps['onSubmit']>
}

function getErrorMessage(error: unknown) {
  if (error instanceof Error && error.message) {
    return error.message
  }
  return 'Login failed'
}

export function LoginClient({
  title,
  description,
  emailLabel,
  emailPlaceholder,
  passwordLabel,
  passwordPlaceholder,
  submitLabel,
  submittingLabel,
  forgotPasswordHref,
  forgotPasswordLabel,
  registerHref,
  registerLabel,
  registerPrompt,
  noticeMessage,
  defaultEmail,
  onSubmit,
}: LoginClientProps) {
  const submitHandler = onSubmit ?? loginDefaultProps.onSubmit
  const [email, setEmail] = useState(defaultEmail ?? loginDefaultProps.defaultEmail)
  const [password, setPassword] = useState('')
  const [errorMessage, setErrorMessage] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async (event: React.SubmitEvent<HTMLFormElement>) => {
    event.preventDefault()
    setErrorMessage('')
    setSubmitting(true)

    const values: LoginSubmitValues = { email, password }

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
      <Card className="bg-card border-border shadow-sm">
        <CardHeader className="space-y-3 pb-2">
          <Typography variant="caption" className="text-muted-foreground tracking-[0.24em] uppercase">
            Seller Center
          </Typography>
          <div className="space-y-1">
            <CardTitle className="text-foreground text-2xl">{title}</CardTitle>
            <Typography variant="body-sm" className="text-muted-foreground">
              {description}
            </Typography>
          </div>
        </CardHeader>
        <CardContent className="space-y-5">
          {noticeMessage ? (
            <div className="bg-success/10 text-success rounded-2xl border border-success/20 px-4 py-3 text-sm">
              {noticeMessage}
            </div>
          ) : null}

          {errorMessage ? (
            <div className="bg-destructive/10 text-destructive flex items-start gap-3 rounded-2xl border border-destructive/20 px-4 py-3 text-sm">
              <CircleAlert className="mt-0.5 size-4 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          ) : null}

          <form onSubmit={(event) => void handleSubmit(event)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="seller-login-email">{emailLabel}</Label>
              <div className="relative">
                <Mail className="text-muted-foreground pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2" />
                <Input
                  id="seller-login-email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder={emailPlaceholder}
                  className="bg-background h-11 pl-10"
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between gap-3">
                <Label htmlFor="seller-login-password">{passwordLabel}</Label>
                <a
                  href={forgotPasswordHref}
                  className="text-muted-foreground hover:text-foreground text-sm font-medium transition"
                >
                  {forgotPasswordLabel}
                </a>
              </div>
              <div className="relative">
                <KeyRound className="text-muted-foreground pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2" />
                <Input
                  id="seller-login-password"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  placeholder={passwordPlaceholder}
                  className="bg-background h-11 pl-10"
                />
              </div>
            </div>

            <Button type="submit" size="lg" className="mt-2 w-full" loading={submitting}>
              {submitting ? submittingLabel : submitLabel}
            </Button>
          </form>
        </CardContent>
        <CardFooter>
          <Typography variant="body-sm" className="text-muted-foreground">
            {registerPrompt}{' '}
            <a href={registerHref} className="text-foreground hover:text-primary font-semibold">
              {registerLabel}
            </a>
          </Typography>
        </CardFooter>
      </Card>
    </AuthPageShell>
  )
}
