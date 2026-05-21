import { Typography } from '@ecom/core-ui'
import { cn } from '@ecom/shared/utils'

interface SectionCardProps {
  title?: React.ReactNode
  subtitle?: React.ReactNode
  action?: React.ReactNode
  className?: string
  children: React.ReactNode
  padded?: boolean
}

export function SectionCard({
  title,
  subtitle,
  action,
  className,
  children,
  padded = true,
}: SectionCardProps) {
  return (
    <section className={cn('surface-card overflow-hidden', className)}>
      {(title || action) && (
        <header className="border-border flex items-start justify-between gap-3 border-b px-3 py-2.5">
          <div className="min-w-0">
            {title ? (
              <Typography variant="label" as="h2" className="leading-tight">
                {title}
              </Typography>
            ) : null}
            {subtitle ? (
              <Typography variant="caption" className="text-muted-foreground mt-0.5">
                {subtitle}
              </Typography>
            ) : null}
          </div>
          {action}
        </header>
      )}
      <div className={cn(padded && 'p-3')}>{children}</div>
    </section>
  )
}
