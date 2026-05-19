'use client'

import { useId } from 'react'
import { Area, AreaChart, ResponsiveContainer } from 'recharts'
import { accentMap } from './StatCard.fixtures'
import type { StatChartProps } from './StatCard.types'

export function StatCardChart({ spark, accent = 'primary' }: StatChartProps) {
  const gradientId = useId()
  const colors = accentMap[accent]

  return (
    <div className="-mr-1 h-11 w-28 shrink-0">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={spark}>
          <defs key={accent}>
            <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={colors.fill} stopOpacity={0.9} />
              <stop offset="100%" stopColor={colors.fill} stopOpacity={0.15} />
            </linearGradient>
          </defs>

          <Area
            type="linear"
            dataKey="y"
            stroke={colors.stroke}
            strokeWidth={2}
            fill={`url(#${gradientId})`}
            dot={false}
            activeDot={false}
            isAnimationActive={false}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}
