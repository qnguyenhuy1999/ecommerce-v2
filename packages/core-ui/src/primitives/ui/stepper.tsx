import * as React from 'react'

import { cn } from '../../lib/utils'

type StepStatus = 'active' | 'completed' | 'pending'

type StepItem = {
  label: string
  status?: StepStatus
}

type StepperProps = React.ComponentProps<'div'> & {
  steps: StepItem[]
  current?: number
}

function Stepper({ steps, current = 1, className, ...props }: StepperProps) {
  return (
    <div data-slot="stepper" className={cn('flex items-center', className)} {...props}>
      {steps.map((step, index) => {
        const stepNumber = index + 1
        const status: StepStatus =
          stepNumber < current ? 'completed' : stepNumber === current ? 'active' : 'pending'

        return (
          <React.Fragment key={index}>
            <StepperItem label={step.label} stepNumber={stepNumber} status={status} />
            {index < steps.length - 1 && (
              <span
                className={cn(
                  'mx-3 h-px min-w-6 flex-1',
                  status === 'completed' ? 'bg-primary' : 'bg-border',
                )}
              />
            )}
          </React.Fragment>
        )
      })}
    </div>
  )
}

type StepperItemProps = {
  label: string
  stepNumber: number
  status: StepStatus
}

function StepperItem({ label, stepNumber, status }: StepperItemProps) {
  const isActive = status === 'active'
  const isCompleted = status === 'completed'

  return (
    <div
      data-slot="stepper-item"
      data-status={status}
      className="flex shrink-0 items-center gap-2.5"
    >
      <span
        className={cn(
          'flex size-8 items-center justify-center rounded-full border text-sm font-semibold',
          isActive && 'border-primary text-primary',
          isCompleted && 'border-primary bg-primary text-primary-foreground',
          !isActive && !isCompleted && 'border-muted-foreground/40 text-muted-foreground',
        )}
      >
        {stepNumber}
      </span>
      <span
        className={cn(
          'text-sm font-medium',
          isActive || isCompleted ? 'text-foreground' : 'text-muted-foreground',
        )}
      >
        {label}
      </span>
    </div>
  )
}

export { Stepper, StepperItem }
export type { StepperProps, StepperItemProps, StepItem, StepStatus }
