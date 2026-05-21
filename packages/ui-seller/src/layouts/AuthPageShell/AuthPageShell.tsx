import { Card, CardContent, Typography } from '@ecom/core-ui'
import { ShieldCheck, Store, type LucideIcon } from 'lucide-react'

interface AuthFeature {
  icon: LucideIcon
  label: string
  description: string
}

interface AuthPageShellProps {
  title: string
  description: string
  children: React.ReactNode
}

const authFeatures: AuthFeature[] = [
  {
    icon: Store,
    label: 'Seller operations',
    description: 'Orders, inventory, pricing and shop tools in one place.',
  },
  {
    icon: ShieldCheck,
    label: 'Protected access',
    description: 'Session and password flows stay aligned with the seller API.',
  },
]

export function AuthPageShell({ title, description, children }: AuthPageShellProps) {
  return (
    <div className="bg-background relative min-h-screen overflow-hidden px-4 py-8 sm:px-6 lg:px-8">
      <div className="bg-primary/10 pointer-events-none absolute inset-x-0 top-0 h-64 blur-3xl" />
      <div className="bg-success/10 pointer-events-none absolute right-0 bottom-0 h-56 w-56 rounded-full blur-3xl" />
      <div className="mx-auto grid min-h-[calc(100vh-4rem)] w-full max-w-6xl items-center gap-6 lg:grid-cols-2">
        <section className="bg-card border-border hidden rounded-3xl border p-8 shadow-sm lg:block xl:p-10">
          <div className="max-w-md space-y-8">
            <div className="space-y-4">
              <div className="bg-muted border-border inline-flex items-center gap-3 rounded-full border px-4 py-2">
                <div className="bg-primary text-primary-foreground flex size-10 items-center justify-center rounded-2xl">
                  <Store className="size-5" />
                </div>
                <div>
                  <Typography variant="label" className="text-foreground">
                    Seller Center
                  </Typography>
                  <Typography variant="caption" className="text-muted-foreground">
                    Marketplace console
                  </Typography>
                </div>
              </div>
              <div className="space-y-3">
                <Typography as="h1" variant="h1" className="text-foreground max-w-lg text-balance">
                  Run the daily work behind your catalog, fulfillment and growth.
                </Typography>
                <Typography variant="body" className="text-muted-foreground max-w-xl">
                  Seller authentication pages live in the same shared UI layer as the rest of
                  the console, so account access feels consistent with the tools behind it.
                </Typography>
              </div>
            </div>
            <div className="grid gap-4">
              {authFeatures.map(({ icon: Icon, label, description: featureDescription }) => (
                <Card key={label} className="bg-background border-border shadow-none">
                  <CardContent className="flex items-start gap-4 p-5">
                    <div className="bg-primary/10 text-primary flex size-11 shrink-0 items-center justify-center rounded-2xl">
                      <Icon className="size-5" />
                    </div>
                    <div className="space-y-1">
                      <Typography variant="label" className="text-foreground">
                        {label}
                      </Typography>
                      <Typography variant="body-sm" className="text-muted-foreground">
                        {featureDescription}
                      </Typography>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        <section className="mx-auto w-full max-w-lg">{children}</section>

        <div className="lg:hidden">
          <Typography variant="caption" className="text-muted-foreground mb-2 block text-center uppercase">
            Seller Center
          </Typography>
          <Typography as="h1" variant="h2" className="text-foreground text-center">
            {title}
          </Typography>
          <Typography variant="body-sm" className="text-muted-foreground mt-2 text-center">
            {description}
          </Typography>
        </div>
      </div>
    </div>
  )
}
