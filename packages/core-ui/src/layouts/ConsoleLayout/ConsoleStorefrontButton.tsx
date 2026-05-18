import { Button } from '../../atoms/Button'
import { ExternalLink } from 'lucide-react'

interface ConsoleStorefrontButtonProps {
  label?: string
}

export function ConsoleStorefrontButton({ label = 'Open' }: ConsoleStorefrontButtonProps) {
  return (
    <Button
      variant="ghost"
      size="sm"
      className="text-foreground hidden gap-1.5 rounded-xl px-3 lg:inline-flex"
    >
      <ExternalLink className="h-3.5 w-3.5" />
      {label}
    </Button>
  )
}
