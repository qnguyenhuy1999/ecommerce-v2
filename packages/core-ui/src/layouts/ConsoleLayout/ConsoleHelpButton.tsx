import { Button } from '../../atoms/Button'
import { CircleHelp } from 'lucide-react'

export function ConsoleHelpButton() {
  return (
    <Button variant="ghost" size="icon-sm" aria-label="Help">
      <CircleHelp className="h-4 w-4" />
    </Button>
  )
}
