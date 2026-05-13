interface TypographyProps {
  children: React.ReactNode
  className?: string
}

function TypographyH1({ children, className }: TypographyProps) {
  return (
    <h1
      className={`scroll-m-20 text-4xl font-extrabold tracking-tight text-balance ${className || ''}`}
    >
      {children}
    </h1>
  )
}

function TypographyH2({ children, className }: TypographyProps) {
  return (
    <h2
      className={`scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight first:mt-0 ${className || ''}`}
    >
      {children}
    </h2>
  )
}

function TypographyH3({ children, className }: TypographyProps) {
  return (
    <h3 className={`scroll-m-20 text-2xl font-semibold tracking-tight ${className || ''}`}>
      {children}
    </h3>
  )
}

function TypographyH4({ children, className }: TypographyProps) {
  return (
    <h4 className={`scroll-m-20 text-xl font-semibold tracking-tight ${className || ''}`}>
      {children}
    </h4>
  )
}

function TypographyP({ children, className }: TypographyProps) {
  return <p className={`leading-7 not-first:mt-6 ${className || ''}`}>{children}</p>
}

function TypographyBlockquote({ children, className }: TypographyProps) {
  return (
    <blockquote className={`mt-6 border-l-2 pl-6 italic ${className || ''}`}>{children}</blockquote>
  )
}

function TypographySmall({ className }: TypographyProps) {
  return (
    <small className={`text-sm leading-none font-medium ${className || ''}`}>Email address</small>
  )
}

export {
  TypographyH1,
  TypographyH2,
  TypographyH3,
  TypographyH4,
  TypographyP,
  TypographyBlockquote,
  TypographySmall,
}
