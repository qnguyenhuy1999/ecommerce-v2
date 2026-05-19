'use client'

import { useCallback, useState } from 'react'

type SetStateAction<T> = T | ((previous: T) => T)

interface UseControllableStateOptions<T> {
  value?: T
  defaultValue: T
  onChange?: (value: T) => void
}

export function useControllableState<T>({
  value,
  defaultValue,
  onChange,
}: UseControllableStateOptions<T>) {
  const [internalValue, setInternalValue] = useState(defaultValue)
  const isControlled = value !== undefined
  const currentValue = isControlled ? value : internalValue

  const setValue = useCallback(
    (nextValue: SetStateAction<T>) => {
      const resolvedValue =
        typeof nextValue === 'function'
          ? (nextValue as (previous: T) => T)(currentValue)
          : nextValue

      if (!isControlled) {
        setInternalValue(resolvedValue)
      }

      onChange?.(resolvedValue)
    },
    [currentValue, isControlled, onChange],
  )

  return [currentValue, setValue] as const
}
