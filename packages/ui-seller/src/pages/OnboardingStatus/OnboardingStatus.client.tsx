'use client'

import { Button, Typography } from '@ecom/core-ui'
import { Clock3 } from 'lucide-react'
import { onboardingStatusDefaultProps } from './OnboardingStatus.fixtures'
import type {
  OnboardingStatusProps,
  OnboardingStatusStep,
  OnboardingStepStatus,
} from './OnboardingStatus.types'

const statusToneClassName: Record<OnboardingStepStatus, string> = {
  DONE: 'text-emerald-600',
  IN_REVIEW: 'text-slate-600',
  PENDING: 'text-slate-400',
}

function resolveStatusLabel(step: OnboardingStatusStep) {
  if (step.statusLabel) {
    return step.statusLabel
  }

  switch (step.status) {
    case 'DONE':
      return 'Done'
    case 'IN_REVIEW':
      return 'In review'
    case 'PENDING':
      return 'Pending'
  }
}

export function OnboardingStatusClient({
  title = onboardingStatusDefaultProps.title,
  description = onboardingStatusDefaultProps.description,
  steps = onboardingStatusDefaultProps.steps,
  primaryActionLabel = onboardingStatusDefaultProps.primaryActionLabel,
  primaryActionHref = onboardingStatusDefaultProps.primaryActionHref,
  onPrimaryAction,
}: Required<Omit<OnboardingStatusProps, 'onPrimaryAction'>> &
  Pick<OnboardingStatusProps, 'onPrimaryAction'>) {
  return (
    <section className="flex min-h-screen items-center justify-center bg-slate-100 px-4 py-10 sm:px-6">
      <div className="w-full max-w-3xl rounded-[28px] border border-slate-200 bg-white px-6 py-10 shadow-[0_18px_60px_-40px_rgba(15,23,42,0.35)] sm:px-10">
        <div className="mx-auto max-w-2xl text-center">
          <div className="mx-auto flex size-16 items-center justify-center rounded-full bg-sky-100 text-sky-600">
            <Clock3 className="size-7" strokeWidth={2.2} />
          </div>

          <Typography variant="h1" as="h1" className="mt-6 text-3xl text-slate-950">
            {title}
          </Typography>
          <Typography variant="body-sm" className="mt-3 text-slate-500 sm:text-base">
            {description}
          </Typography>
        </div>

        <div className="mx-auto mt-8 max-w-2xl space-y-3">
          {steps.map((step) => (
            <div
              key={step.id}
              className="flex items-center justify-between gap-4 rounded-2xl border border-slate-200 bg-white px-4 py-4 text-sm shadow-[0_1px_0_rgba(15,23,42,0.02)]"
            >
              <span className="font-medium text-slate-900">{step.label}</span>
              <span className={statusToneClassName[step.status]}>{resolveStatusLabel(step)}</span>
            </div>
          ))}
        </div>

        <div className="mt-8 flex justify-center">
          {onPrimaryAction ? (
            <Button variant="outline" size="lg" onClick={onPrimaryAction} className="min-w-40">
              {primaryActionLabel}
            </Button>
          ) : (
            <Button asChild variant="outline" size="lg" className="min-w-40">
              <a href={primaryActionHref}>{primaryActionLabel}</a>
            </Button>
          )}
        </div>
      </div>
    </section>
  )
}
