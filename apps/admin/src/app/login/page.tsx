import { LoginForm } from '@/features/auth/components/login-form'
import { Store } from 'lucide-react'

export default function LoginPage() {
  return (
    <div className="bg-muted/40 flex min-h-screen items-center justify-center p-4">
      <div className="bg-card w-full max-w-sm space-y-6 rounded-xl border p-8 shadow-sm">
        <div className="flex flex-col items-center gap-2 text-center">
          <div className="bg-primary text-primary-foreground flex size-12 items-center justify-center rounded-xl">
            <Store className="size-6" />
          </div>
          <h1 className="text-xl font-semibold tracking-tight">Admin Portal</h1>
          <p className="text-muted-foreground text-sm">Sign in to manage the marketplace</p>
        </div>
        <LoginForm />
      </div>
    </div>
  )
}
