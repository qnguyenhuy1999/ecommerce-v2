import { LoginForm } from '@/features/auth/components/login-form';
import { Store } from 'lucide-react';

export default function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/40 p-4">
      <div className="w-full max-w-sm space-y-6 rounded-xl border bg-card p-8 shadow-sm">
        <div className="flex flex-col items-center gap-2 text-center">
          <div className="flex size-12 items-center justify-center rounded-xl bg-primary text-primary-foreground">
            <Store className="size-6" />
          </div>
          <h1 className="text-xl font-semibold tracking-tight">
            Admin Portal
          </h1>
          <p className="text-sm text-muted-foreground">
            Sign in to manage the marketplace
          </p>
        </div>
        <LoginForm />
      </div>
    </div>
  );
}
