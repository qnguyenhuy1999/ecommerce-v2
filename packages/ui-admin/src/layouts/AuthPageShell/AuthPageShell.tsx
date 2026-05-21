import { Typography } from '@ecom/core-ui'
import { Activity, Fingerprint, ShieldCheck, Waves, type LucideIcon } from 'lucide-react'
import type { ReactNode } from 'react'
import { authStatusToneClassNames } from '../../lib/auth-theme'

interface AuthFeature {
  icon: LucideIcon
  label: string
}

interface AuthPageShellProps {
  title: string
  description: string
  children: ReactNode
}

const authFeatures: AuthFeature[] = [
  {
    icon: ShieldCheck,
    label: 'Hardware-key & TOTP enforced',
  },
  {
    icon: Waves,
    label: 'Full audit trail - SOC2-aligned',
  },
  {
    icon: Fingerprint,
    label: 'Geo & device fingerprint checks',
  },
]

const authGradientStyle = {
  backgroundImage:
    'radial-gradient(circle at top right, color-mix(in oklab, var(--primary) 18%, transparent), transparent 30%), radial-gradient(circle at bottom left, color-mix(in oklab, var(--warning) 10%, transparent), transparent 32%)',
}

const authGridStyle = {
  backgroundImage:
    'linear-gradient(color-mix(in oklab, var(--foreground) 8%, transparent) 1px, transparent 1px), linear-gradient(90deg, color-mix(in oklab, var(--foreground) 8%, transparent) 1px, transparent 1px)',
  backgroundSize: '40px 40px',
}

const authPanelStyle = {
  backgroundImage:
    'radial-gradient(circle at top left, color-mix(in oklab, var(--background) 24%, transparent), transparent 32%), linear-gradient(180deg, color-mix(in oklab, var(--background) 18%, transparent), color-mix(in oklab, var(--background) 64%, transparent))',
}

const authFormPanelStyle = {
  backgroundImage:
    'radial-gradient(circle at top right, color-mix(in oklab, var(--primary) 14%, transparent), transparent 26%), linear-gradient(180deg, color-mix(in oklab, var(--background) 18%, transparent), color-mix(in oklab, var(--background) 72%, transparent))',
}

export function AuthPageShell({ title, description, children }: AuthPageShellProps) {
  return (
    <div className="dark bg-background min-h-screen px-3 py-3 sm:px-4 sm:py-4 lg:px-6 lg:py-6">
      <div className="bg-background border-border/70 relative mx-auto min-h-[calc(100vh-1.5rem)] max-w-[1600px] overflow-hidden rounded-[32px] border shadow-2xl">
        <div className="absolute inset-0" style={authGradientStyle} />

        <div className="relative grid min-h-[calc(100vh-1.5rem)] lg:grid-cols-[minmax(0,1.08fr)_minmax(420px,0.92fr)]">
          <section className="border-border/70 relative overflow-hidden lg:border-r">
            <div className="absolute inset-0 opacity-60" style={authGridStyle} />
            <div className="absolute inset-0" style={authPanelStyle} />

            <div className="relative flex h-full flex-col px-6 py-7 sm:px-8 sm:py-8 lg:px-12 lg:py-11">
              <div className="flex items-center gap-4">
                <div className="bg-primary text-primary-foreground flex size-14 items-center justify-center rounded-full shadow-sm">
                  <ShieldCheck className="size-6" />
                </div>
                <div className="space-y-1">
                  <Typography
                    variant="label"
                    className="text-lg font-semibold text-white sm:text-xl"
                  >
                    Halo Admin
                  </Typography>
                  <Typography
                    variant="caption"
                    className="text-muted-foreground text-[0.925rem] sm:text-sm"
                  >
                    Platform console
                  </Typography>
                </div>
              </div>

              <div className="bg-card/35 border-border/60 mt-14 inline-flex w-fit items-center gap-2 rounded-full border px-4 py-2 text-sm text-white/90 backdrop-blur-sm sm:mt-20">
                <Activity className={`size-4 ${authStatusToneClassNames.success.text}`} />
                <span>All systems operational</span>
              </div>

              <div className="mt-8 max-w-[40rem] space-y-5 sm:mt-10">
                <Typography
                  as="h1"
                  variant="h1"
                  className="max-w-[33rem] text-4xl leading-[1.02] font-semibold tracking-[-0.04em] text-white sm:text-[3.4rem] lg:text-[4.25rem]"
                >
                  Operate the marketplace with <span className="text-primary">confidence.</span>
                </Typography>
                <Typography
                  variant="body"
                  className="text-muted-foreground max-w-[36rem] text-base leading-8 sm:text-[1.05rem]"
                >
                  Sign in to manage vendors, disputes, payouts and platform safety. Every action is
                  signed, logged and reversible.
                </Typography>
              </div>

              <div className="bg-card/35 border-border/60 mt-8 max-w-[33rem] rounded-[22px] border p-5 backdrop-blur-sm">
                <Typography
                  variant="caption"
                  className="text-muted-foreground tracking-[0.22em] uppercase"
                >
                  Current flow
                </Typography>
                <Typography
                  as="h2"
                  variant="h4"
                  className="mt-3 text-[1.35rem] leading-tight font-semibold tracking-[-0.03em] text-white"
                >
                  {title}
                </Typography>
                <Typography variant="body-sm" className="text-muted-foreground mt-2">
                  {description}
                </Typography>
              </div>

              <div className="mt-10 grid max-w-[35rem] gap-3 sm:mt-12">
                {authFeatures.map(({ icon: Icon, label }) => (
                  <div
                    key={label}
                    className="bg-card/35 border-border/60 flex items-center gap-4 rounded-[18px] border px-4 py-4 text-white/94 backdrop-blur-sm"
                  >
                    <div className="bg-primary-soft text-primary flex size-11 shrink-0 items-center justify-center rounded-2xl">
                      <Icon className="size-5" />
                    </div>
                    <Typography variant="body" className="text-base leading-7 text-white">
                      {label}
                    </Typography>
                  </div>
                ))}
              </div>

              <div className="text-muted-foreground mt-auto hidden items-end justify-between gap-6 pt-10 text-sm lg:flex">
                <span>&copy; Halo Market. Restricted access.</span>
                <span>v4.18.2 - region: ap-sg-1</span>
              </div>
            </div>
          </section>

          <section className="relative flex items-center justify-center px-4 py-8 sm:px-8 lg:px-10 lg:py-10">
            <div className="absolute inset-0" style={authFormPanelStyle} />
            <div className="relative w-full max-w-[28rem]">{children}</div>
          </section>
        </div>
      </div>
    </div>
  )
}
