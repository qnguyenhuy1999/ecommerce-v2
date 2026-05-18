import { cn } from '../../lib/utils'
import { ChevronRight } from 'lucide-react'
import type { ConsolePageLayoutProps } from './ConsolePageLayout.types'

function ConsolePageBreadcrumb({
  items,
}: {
  items: NonNullable<ConsolePageLayoutProps['breadcrumb']>
}) {
  if (items.length === 0) {
    return null
  }

  return (
    <nav aria-label="Breadcrumb" className="text-muted-foreground text-sm">
      <ol className="flex flex-wrap items-center gap-1.5">
        {items.map((item, index) => {
          const isLast = index === items.length - 1
          const ariaCurrent = isLast ? 'page' : undefined
          const label = item.href ? (
            <a
              aria-current={ariaCurrent}
              className="hover:text-foreground transition-colors"
              href={item.href}
            >
              {item.label}
            </a>
          ) : (
            <span aria-current={ariaCurrent} className={cn(isLast && 'text-foreground')}>
              {item.label}
            </span>
          )

          return (
            <li key={`${item.label}-${index}`} className="flex items-center">
              {label}
              {!isLast && (
                <ChevronRight aria-hidden="true" className="text-muted-foreground/70 size-3" />
              )}
            </li>
          )
        })}
      </ol>
    </nav>
  )
}

export function ConsolePageLayout({
  title,
  description,
  breadcrumb,
  actions,
  children,
  aside,
  stickyAside = true,
  className,
  headerClassName,
  contentClassName,
  mainClassName,
  asideClassName,
}: ConsolePageLayoutProps) {
  return (
    <section className={cn('flex w-full flex-col gap-6', className)}>
      <header
        className={cn(
          'flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between',
          headerClassName,
        )}
      >
        <div className="min-w-0 space-y-1">
          {breadcrumb ? <ConsolePageBreadcrumb items={breadcrumb} /> : null}
          <h1 className="text-foreground text-3xl font-semibold tracking-tight">{title}</h1>
          {description ? (
            <p className="text-muted-foreground max-w-3xl text-sm">{description}</p>
          ) : null}
        </div>
        {actions ? (
          <div className="flex shrink-0 flex-wrap items-center gap-3 lg:justify-end">{actions}</div>
        ) : null}
      </header>
      <div
        className={cn(
          aside
            ? 'grid min-h-0 items-start gap-6 xl:grid-cols-[minmax(0,1fr)_22rem]'
            : 'flex min-h-0 flex-col gap-6',
          contentClassName,
        )}
      >
        <div className={cn('min-w-0', mainClassName)}>{children}</div>
        {aside ? (
          <aside
            className={cn(
              'min-w-0 xl:sticky xl:top-6',
              !stickyAside && 'xl:static',
              asideClassName,
            )}
          >
            {aside}
          </aside>
        ) : null}
      </div>
    </section>
  )
}
