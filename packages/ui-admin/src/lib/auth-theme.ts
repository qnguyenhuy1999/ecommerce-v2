export const authSurfaceClassName = 'border-border/80 bg-card shadow-sm'

export const authInputClassName =
  'h-12 rounded-2xl border-input bg-background pl-11 pr-11 text-[15px] text-foreground shadow-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/20'

export const authLabelClassName = 'text-[0.95rem] font-medium text-foreground'

export const authIconClassName =
  'pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-muted-foreground'

export const authPrimaryLinkClassName =
  'text-primary hover:text-primary-deep text-sm font-semibold transition-colors'

export const authSecondaryLinkClassName =
  'text-muted-foreground hover:text-foreground transition-colors'

export const authPrimaryButtonClassName =
  'h-[3.25rem] w-full rounded-[18px] border-0 text-base font-semibold shadow-sm'

export const authStatusToneClassNames = {
  success: {
    container: 'border-success/20 bg-success/10',
    icon: 'bg-success text-success-foreground',
    text: 'text-success',
    dot: 'bg-success',
  },
  warning: {
    container: 'border-warning/25 bg-warning/12',
    icon: 'bg-warning text-warning-foreground',
    text: 'text-warning',
    dot: 'bg-warning',
  },
  destructive: {
    container: 'border-destructive/20 bg-destructive/10',
    icon: 'text-destructive',
    text: 'text-destructive',
  },
} as const
