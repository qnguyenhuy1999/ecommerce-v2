export interface ConsoleBreadcrumbItem {
  label: string
  href?: string
}

export interface ConsolePageLayoutProps {
  title: React.ReactNode
  description?: React.ReactNode
  breadcrumb?: ConsoleBreadcrumbItem[]
  actions?: React.ReactNode
  children: React.ReactNode
  aside?: React.ReactNode
  stickyAside?: boolean
  className?: string
  headerClassName?: string
  contentClassName?: string
  mainClassName?: string
  asideClassName?: string
}
