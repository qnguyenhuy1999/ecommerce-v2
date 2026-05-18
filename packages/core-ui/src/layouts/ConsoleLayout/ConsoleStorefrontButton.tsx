import { Button } from '../../atoms/Button'
import { ExternalLink } from 'lucide-react'

interface ConsoleStorefrontButtonProps {
  label?: string
}

export function ConsoleStorefrontButton({ label = 'Open' }: ConsoleStorefrontButtonProps) {
  return (
    <Button variant="outline" size="sm" className="gap-1.5">
      <ExternalLink className="h-3.5 w-3.5" />
      {label}
    </Button>
  )
}
