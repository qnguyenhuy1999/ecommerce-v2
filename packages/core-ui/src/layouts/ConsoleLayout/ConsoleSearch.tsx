import { InputGroup, InputGroupAddon, InputGroupInput } from '../../atoms/InputGroup'
import { SearchIcon } from 'lucide-react'

interface ConsoleSearchProps {
  placeholder?: string
}

export function ConsoleSearch({ placeholder = 'Search...' }: ConsoleSearchProps) {
  return (
    <div className="hidden w-full max-w-xl md:block">
      <InputGroup className="bg-muted border-border h-10 rounded-2xl shadow-none">
        <InputGroupInput className="text-sm" placeholder={placeholder} />
        <InputGroupAddon align="inline-start">
          <SearchIcon className="text-muted-foreground size-4" />
        </InputGroupAddon>
      </InputGroup>
    </div>
  )
}
