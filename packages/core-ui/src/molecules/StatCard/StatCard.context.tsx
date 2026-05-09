import { createContext, useContext } from 'react'
import { accentMap } from './StatCard.fixtures'

type StatCardContextValue = {
  accent: keyof typeof accentMap
  colors: (typeof accentMap)[keyof typeof accentMap]
}

export const StatCardContext = createContext<StatCardContextValue | null>(null)

export function useStatCard() {
  const ctx = useContext(StatCardContext)
  if (!ctx) {
    throw new Error('StatCard components must be used within <StatCard.Root>')
  }
  return ctx
}
