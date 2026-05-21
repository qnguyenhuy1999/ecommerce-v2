import type { HTMLAttributes, ReactNode } from 'react'
import { cn } from '../../lib/utils'

const typographyVariants = {
  h1: 'scroll-m-20 text-4xl font-extrabold tracking-tight text-balance',
  h2: 'scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight first:mt-0',
  h3: 'scroll-m-20 text-2xl font-semibold tracking-tight',
  h4: 'scroll-m-20 text-xl font-semibold tracking-tight',
  body: 'leading-7',
  'body-sm': 'text-sm leading-6',
  caption: 'text-xs leading-5',
  label: 'text-sm leading-none font-medium',
  muted: 'text-muted-foreground text-sm leading-6',
  blockquote: 'mt-6 border-l-2 pl-6 italic',
} as const

type TypographyVariant = keyof typeof typographyVariants

type TypographyElement = 'blockquote' | 'div' | 'h1' | 'h2' | 'h3' | 'h4' | 'p' | 'small' | 'span'

const typographyVariantElements = {
  h1: 'h1',
  h2: 'h2',
  h3: 'h3',
  h4: 'h4',
  body: 'p',
  'body-sm': 'p',
  caption: 'p',
  label: 'span',
  muted: 'p',
  blockquote: 'blockquote',
} as const satisfies Record<TypographyVariant, TypographyElement>

type TypographyProps = HTMLAttributes<HTMLElement> & {
  as?: TypographyElement
  children: ReactNode
  variant: TypographyVariant
}

function Typography({ as, children, className, variant, ...props }: TypographyProps) {
  const Component = as ?? typographyVariantElements[variant]

  return (
    <Component className={cn(typographyVariants[variant], className)} {...props}>
      {children}
    </Component>
  )
}

/**
 * @deprecated Prefer `Typography` with `variant="h1"`.
 */
function TypographyH1(props: Omit<TypographyProps, 'as' | 'variant'>) {
  return <Typography variant="h1" {...props} />
}

/**
 * @deprecated Prefer `Typography` with `variant="h2"`.
 */
function TypographyH2(props: Omit<TypographyProps, 'as' | 'variant'>) {
  return <Typography variant="h2" {...props} />
}

/**
 * @deprecated Prefer `Typography` with `variant="h3"`.
 */
function TypographyH3(props: Omit<TypographyProps, 'as' | 'variant'>) {
  return <Typography variant="h3" {...props} />
}

/**
 * @deprecated Prefer `Typography` with `variant="h4"`.
 */
function TypographyH4(props: Omit<TypographyProps, 'as' | 'variant'>) {
  return <Typography variant="h4" {...props} />
}

/**
 * @deprecated Prefer `Typography` with `variant="body"`.
 */
function TypographyP(props: Omit<TypographyProps, 'as' | 'variant'>) {
  return <Typography variant="body" {...props} />
}

/**
 * @deprecated Prefer `Typography` with `variant="blockquote"`.
 */
function TypographyBlockquote(props: Omit<TypographyProps, 'as' | 'variant'>) {
  return <Typography variant="blockquote" {...props} />
}

/**
 * @deprecated Prefer `Typography` with `variant="label"` and `as="small"` when needed.
 */
function TypographySmall(props: Omit<TypographyProps, 'variant'>) {
  return <Typography as="small" variant="label" {...props} />
}

export {
  Typography,
  TypographyH1,
  TypographyH2,
  TypographyH3,
  TypographyH4,
  TypographyP,
  TypographyBlockquote,
  TypographySmall,
}
export type { TypographyProps, TypographyVariant }
