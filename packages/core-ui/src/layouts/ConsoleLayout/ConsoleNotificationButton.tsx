import { Button } from '../../atoms/Button'
import { Bell } from 'lucide-react'

interface ConsoleNotificationButtonProps {
  count?: number
}

export function ConsoleNotificationButton({ count = 0 }: ConsoleNotificationButtonProps) {
  return (
    <div className="relative">
      <Button variant="ghost" size="icon-sm" aria-label="Notifications">
        <Bell className="h-4 w-4" />
      </Button>
      {count > 0 && (
        <span className="bg-primary absolute -top-1 -right-1 flex size-4 items-center justify-center rounded-full text-[10px] text-white">
          {count}
        </span>
      )}
    </div>
  )
}
