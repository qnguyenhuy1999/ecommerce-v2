import type { LoginProps } from './Login.types'

const loginSubmitFallback: NonNullable<LoginProps['onSubmit']> = async () => {}

export const loginDefaultProps: Required<
  Pick<
    LoginProps,
    | 'title'
    | 'description'
    | 'emailLabel'
    | 'emailPlaceholder'
    | 'passwordLabel'
    | 'passwordPlaceholder'
    | 'submitLabel'
    | 'submittingLabel'
    | 'forgotPasswordHref'
    | 'forgotPasswordLabel'
    | 'registerHref'
    | 'registerLabel'
    | 'registerPrompt'
  >
> &
  Pick<LoginProps, 'defaultEmail' | 'onSubmit'> = {
  title: 'Welcome back',
  description: 'Sign in to manage your seller account, inventory and orders.',
  emailLabel: 'Email',
  emailPlaceholder: 'seller@example.com',
  passwordLabel: 'Password',
  passwordPlaceholder: 'Enter your password',
  submitLabel: 'Sign in',
  submittingLabel: 'Signing in...',
  forgotPasswordHref: '/forgot-password',
  forgotPasswordLabel: 'Forgot password?',
  registerHref: '/register',
  registerLabel: 'Register',
  registerPrompt: "Don't have an account yet?",
  defaultEmail: '',
  onSubmit: loginSubmitFallback,
}
