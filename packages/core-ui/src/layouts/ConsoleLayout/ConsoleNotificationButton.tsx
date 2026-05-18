import { Button } from '../../atoms/Button'
import { Bell } from 'lucide-react'

interface ConsoleNotificationButtonProps {
  count?: number
}

export function ConsoleNotificationButton({ count = 0 }: ConsoleNotificationButtonProps) {
  const ariaLabel = count > 0 ? `Notifications (${count} unread)` : 'Notifications'

  return (
    <div className="relative">
      <Button
        variant="ghost"
        size="icon-sm"
        aria-label={ariaLabel}
        className="text-muted-foreground hover:bg-muted hover:text-foreground rounded-full"
      >
        <Bell className="h-4 w-4" />
      </Button>
      {count > 0 && (
        <span
          className="bg-destructive absolute top-1 right-1 size-2.5 rounded-full"
          aria-hidden="true"
        />
      )}
    </div>
  )
}
