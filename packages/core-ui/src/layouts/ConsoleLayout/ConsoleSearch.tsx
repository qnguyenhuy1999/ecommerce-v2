import { InputGroup, InputGroupAddon, InputGroupInput } from '../../atoms/InputGroup'
import { SearchIcon } from 'lucide-react'

interface ConsoleSearchProps {
  placeholder?: string
}

export function ConsoleSearch({ placeholder = 'Search...' }: ConsoleSearchProps) {
  return (
    <div className="mx-auto w-full max-w-sm">
      <InputGroup>
        <InputGroupInput placeholder={placeholder} />
        <InputGroupAddon align="inline-start">
          <SearchIcon className="text-muted-foreground h-4 w-4" />
        </InputGroupAddon>
      </InputGroup>
    </div>
  )
}
