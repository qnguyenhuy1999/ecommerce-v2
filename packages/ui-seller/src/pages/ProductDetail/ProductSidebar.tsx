'use client'

import {
  Checkbox,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  StatusBadge,
} from '@ecom/core-ui'
import { SectionCard } from '../../atoms/SectionCard'
import { cn } from '../../lib/utils'
import { useProductEditorSidebar } from './ProductDetail.context'

export function ProductSidebar() {
  const {
    status,
    statuses,
    lastSavedLabel,
    visibility,
    validationItems,
    onStatusChange,
    onVisibilityChange,
  } = useProductEditorSidebar()
  const validationCompleteCount = validationItems.filter((item) => item.complete).length

  return (
    <div className="space-y-4">
      <SectionCard title="Status">
        <div className="space-y-4">
          <StatusBadge status={status} />
          <Select value={status} onValueChange={(value) => onStatusChange(value as typeof status)}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent>
              {statuses.map((entry) => (
                <SelectItem key={entry} value={entry}>
                  {entry.replace(/_/g, ' ')}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <p className="text-muted-foreground text-sm">{lastSavedLabel}</p>
        </div>
      </SectionCard>

      <SectionCard title="Visibility">
        <div className="space-y-3">
          {visibility.map((option) => (
            <label key={option.id} className="flex items-center justify-between gap-3 text-sm">
              <span>{option.label}</span>
              <Checkbox
                checked={option.checked}
                onCheckedChange={(checked) => onVisibilityChange(option.id, checked === true)}
                aria-label={option.label}
              />
            </label>
          ))}
        </div>
      </SectionCard>

      <SectionCard title="Validation summary">
        <div className="space-y-2 text-sm">
          {validationItems.map((item) => (
            <div
              key={item.id}
              className={cn(
                'flex items-start gap-2',
                item.complete ? 'text-success' : 'text-muted-foreground',
              )}
            >
              <span className="mt-0.5 text-xs">{item.complete ? '✓' : '·'}</span>
              <span>{item.label}</span>
            </div>
          ))}
          <p className="text-muted-foreground pt-2 text-xs">
            {validationCompleteCount} of {validationItems.length} checks completed
          </p>
        </div>
      </SectionCard>
    </div>
  )
}
