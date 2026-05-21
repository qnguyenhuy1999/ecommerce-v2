'use client'

import {
  Button,
  Field,
  FieldContent,
  FieldDescription,
  FieldLabel,
  Input,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Textarea,
  Typography,
} from '@ecom/core-ui'
import { ArrowLeft, ArrowRight, Check, Upload } from 'lucide-react'
import { useMemo, useRef, useState } from 'react'
import { SectionCard } from '../../atoms/SectionCard'
import { useControllableState } from '../../hooks'
import type {
  SellerOnboardingDocumentKey,
  SellerOnboardingDocumentSlot,
  SellerOnboardingFormValues,
  SellerOnboardingProps,
  SellerOnboardingStepIndex,
} from './SellerOnboarding.types'

interface SellerOnboardingClientProps {
  title: string
  saveExitLabel: string
  saveExitHref?: string
  stepLabels: [string, string, string, string]
  defaultStep: SellerOnboardingStepIndex
  currentStep?: SellerOnboardingProps['currentStep']
  onCurrentStepChange?: SellerOnboardingProps['onCurrentStepChange']
  defaultValues: SellerOnboardingFormValues
  categoryOptions: string[]
  countryOptions: string[]
  businessTypeOptions: string[]
  idTypeOptions: string[]
  documentSlots: SellerOnboardingDocumentSlot[]
  reviewBannerMessage: string
  onSaveExit?: SellerOnboardingProps['onSaveExit']
  onSubmit: NonNullable<SellerOnboardingProps['onSubmit']>
}

interface SellerOnboardingController {
  activeStep: SellerOnboardingStepIndex
  values: SellerOnboardingFormValues
  submitting: boolean
  actionError: string | null
  documentInputRefs: React.RefObject<Record<SellerOnboardingDocumentKey, HTMLInputElement | null>>
  handleBack: () => void
  handleNext: () => void
  handleSaveExit: () => Promise<boolean>
  handleSubmit: () => Promise<boolean>
  updateAccount: <T extends keyof SellerOnboardingFormValues['account']>(
    key: T,
    nextValue: SellerOnboardingFormValues['account'][T],
  ) => void
  updateShop: <T extends keyof SellerOnboardingFormValues['shop']>(
    key: T,
    nextValue: SellerOnboardingFormValues['shop'][T],
  ) => void
  updateKyc: <T extends keyof Omit<SellerOnboardingFormValues['kyc'], 'documents'>>(
    key: T,
    nextValue: Omit<SellerOnboardingFormValues['kyc'], 'documents'>[T],
  ) => void
  updateDocument: (key: SellerOnboardingDocumentKey, fileName: string) => void
}

const MAX_STEP = 4
const STEP_SEQUENCE: SellerOnboardingStepIndex[] = [1, 2, 3, 4]

function isStepIndex(value: number): value is SellerOnboardingStepIndex {
  return STEP_SEQUENCE.includes(value as SellerOnboardingStepIndex)
}

function getInitialDocumentInputs(
  slots: SellerOnboardingDocumentSlot[],
): Record<SellerOnboardingDocumentKey, HTMLInputElement | null> {
  return slots.reduce(
    (accumulator, slot) => ({
      ...accumulator,
      [slot.key]: null,
    }),
    {
      idFront: null,
      idBack: null,
      selfieWithId: null,
      businessRegistration: null,
    } satisfies Record<SellerOnboardingDocumentKey, HTMLInputElement | null>,
  )
}

function maskPassword(password: string) {
  return '*'.repeat(Math.max(password.length, 6))
}

function maskIdNumber(value: string) {
  const trimmed = value.trim()

  if (trimmed.length <= 4) {
    return trimmed
  }

  return `** ${trimmed.slice(-4)}`
}

function maskAccountNumber(value: string) {
  const digits = value.replace(/\s+/g, '')

  if (digits.length <= 4) {
    return digits
  }

  return `** ${digits.slice(-4)}`
}

function getReviewItems(values: SellerOnboardingFormValues) {
  return [
    {
      label: 'Account',
      value: `${values.account.email} * ${values.account.mobileNumber}`,
    },
    {
      label: 'Shop',
      value: `${values.shop.shopName} * ${values.shop.category} * ${values.shop.country}`,
    },
    {
      label: 'KYC',
      value: `${values.kyc.businessType} * ${values.kyc.idType} * ${Object.values(values.kyc.documents).filter(Boolean).length} documents uploaded`,
    },
    {
      label: 'Bank',
      value: `${values.kyc.bankName} * ${maskAccountNumber(values.kyc.accountNumber)} * ${values.kyc.accountHolder}`,
    },
  ]
}

function SellerOnboardingStepRail({
  currentStep,
  stepLabels,
}: {
  currentStep: SellerOnboardingStepIndex
  stepLabels: [string, string, string, string]
}) {
  return (
    <div className="flex items-center gap-3 overflow-x-auto px-1">
      {stepLabels.map((label, index) => {
        const stepNumber = (index + 1) as SellerOnboardingStepIndex
        const status =
          stepNumber < currentStep ? 'completed' : stepNumber === currentStep ? 'active' : 'pending'

        return (
          <div key={label} className="flex min-w-0 flex-1 items-center gap-3">
            <div className="flex shrink-0 items-center gap-3">
              <span
                className={[
                  'flex size-8 items-center justify-center rounded-full border text-sm font-semibold',
                  status === 'active' && 'border-primary bg-primary text-primary-foreground',
                  status === 'completed' && 'border-emerald-600 bg-emerald-600 text-white',
                  status === 'pending' && 'border-border bg-background text-muted-foreground',
                ]
                  .filter(Boolean)
                  .join(' ')}
              >
                {status === 'completed' ? <Check className="size-4" /> : stepNumber}
              </span>
              <span
                className={[
                  'text-sm font-medium whitespace-nowrap',
                  status === 'pending' ? 'text-muted-foreground' : 'text-foreground',
                ]
                  .filter(Boolean)
                  .join(' ')}
              >
                {label}
              </span>
            </div>

            {index < stepLabels.length - 1 ? (
              <span
                className={[
                  'h-px min-w-12 flex-1',
                  stepNumber < currentStep ? 'bg-emerald-600' : 'bg-border',
                ]
                  .filter(Boolean)
                  .join(' ')}
              />
            ) : null}
          </div>
        )
      })}
    </div>
  )
}

function DocumentUploadSlot({
  label,
  fileName,
  onOpen,
  inputRef,
  onFileChange,
}: {
  label: string
  fileName: string
  onOpen: () => void
  inputRef: (node: HTMLInputElement | null) => void
  onFileChange: (event: React.ChangeEvent<HTMLInputElement>) => void
}) {
  return (
    <button
      type="button"
      onClick={onOpen}
      className="border-border hover:border-primary flex min-h-48 flex-col items-center justify-center rounded-2xl border border-dashed bg-white px-4 py-5 text-center transition-colors"
    >
      <input ref={inputRef} type="file" className="sr-only" onChange={onFileChange} />
      <span className="bg-muted text-muted-foreground mb-5 flex size-10 items-center justify-center rounded-full">
        <Upload className="size-5" />
      </span>
      <span className="text-sm font-medium">{label}</span>
      <span className="text-muted-foreground mt-2 text-xs">{fileName || 'Upload file'}</span>
    </button>
  )
}

function useSellerOnboardingController({
  defaultStep,
  currentStep,
  onCurrentStepChange,
  defaultValues,
  documentSlots,
  onSaveExit,
  onSubmit,
}: Pick<
  SellerOnboardingClientProps,
  | 'defaultStep'
  | 'currentStep'
  | 'onCurrentStepChange'
  | 'defaultValues'
  | 'documentSlots'
  | 'onSaveExit'
  | 'onSubmit'
>): SellerOnboardingController {
  const normalizedDefaultStep = isStepIndex(defaultStep) ? defaultStep : 1
  const normalizedCurrentStep =
    currentStep !== undefined && isStepIndex(currentStep) ? currentStep : undefined

  const [activeStep, setActiveStep] = useControllableState({
    defaultValue: normalizedDefaultStep,
    ...(normalizedCurrentStep !== undefined ? { value: normalizedCurrentStep } : {}),
    ...(onCurrentStepChange !== undefined ? { onChange: onCurrentStepChange } : {}),
  })
  const [values, setValues] = useState<SellerOnboardingFormValues>(defaultValues)
  const [submitting, setSubmitting] = useState(false)
  const [actionError, setActionError] = useState<string | null>(null)
  const documentInputRefs = useRef(getInitialDocumentInputs(documentSlots))

  const updateAccount = <T extends keyof SellerOnboardingFormValues['account']>(
    key: T,
    nextValue: SellerOnboardingFormValues['account'][T],
  ) => {
    setValues((current) => ({
      ...current,
      account: {
        ...current.account,
        [key]: nextValue,
      },
    }))
  }

  const updateShop = <T extends keyof SellerOnboardingFormValues['shop']>(
    key: T,
    nextValue: SellerOnboardingFormValues['shop'][T],
  ) => {
    setValues((current) => ({
      ...current,
      shop: {
        ...current.shop,
        [key]: nextValue,
      },
    }))
  }

  const updateKyc = <T extends keyof Omit<SellerOnboardingFormValues['kyc'], 'documents'>>(
    key: T,
    nextValue: Omit<SellerOnboardingFormValues['kyc'], 'documents'>[T],
  ) => {
    setValues((current) => ({
      ...current,
      kyc: {
        ...current.kyc,
        [key]: nextValue,
      },
    }))
  }

  const updateDocument = (key: SellerOnboardingDocumentKey, fileName: string) => {
    setValues((current) => ({
      ...current,
      kyc: {
        ...current.kyc,
        documents: {
          ...current.kyc.documents,
          [key]: fileName,
        },
      },
    }))
  }

  const handleNext = () => {
    if (activeStep < MAX_STEP) {
      setActionError(null)
      setActiveStep((activeStep + 1) as SellerOnboardingStepIndex)
    }
  }

  const handleBack = () => {
    if (activeStep > 1) {
      setActionError(null)
      setActiveStep((activeStep - 1) as SellerOnboardingStepIndex)
    }
  }

  const handleSaveExit = async () => {
    if (!onSaveExit) {
      return true
    }

    setActionError(null)

    try {
      await Promise.resolve(onSaveExit(values))
      return true
    } catch {
      setActionError('Unable to save your progress right now. Please try again.')
      return false
    }
  }

  const handleSubmit = async () => {
    if (submitting) {
      return false
    }

    setSubmitting(true)
    setActionError(null)

    try {
      await Promise.resolve(onSubmit(values))
      return true
    } catch {
      setActionError('Unable to submit your onboarding right now. Please try again.')
      return false
    } finally {
      setSubmitting(false)
    }
  }

  return {
    activeStep,
    values,
    submitting,
    actionError,
    documentInputRefs,
    handleBack,
    handleNext,
    handleSaveExit,
    handleSubmit,
    updateAccount,
    updateShop,
    updateKyc,
    updateDocument,
  }
}

function SellerOnboardingHeader({
  title,
  saveExitLabel,
  saveExitHref,
  onSaveExit,
  onClickSaveExit,
}: Pick<SellerOnboardingClientProps, 'title' | 'saveExitLabel' | 'saveExitHref' | 'onSaveExit'> & {
  onClickSaveExit: () => Promise<boolean>
}) {
  return (
    <header className="border-border bg-background border-b">
      <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-4 py-5 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3">
          <span className="bg-primary text-primary-foreground flex size-9 items-center justify-center rounded-full text-sm font-semibold">
            O
          </span>
          <Typography variant="label" as="h1" className="text-lg">
            {title}
          </Typography>
        </div>

        {saveExitHref ? (
          <a
            href={saveExitHref}
            onClick={(event) => {
              if (!onSaveExit) {
                return
              }

              event.preventDefault()
              void (async () => {
                const didSave = await onClickSaveExit()

                if (didSave) {
                  window.location.assign(saveExitHref)
                }
              })()
            }}
            className="text-muted-foreground hover:text-foreground text-sm font-medium"
          >
            {saveExitLabel}
          </a>
        ) : (
          <button
            type="button"
            onClick={() => {
              void onClickSaveExit()
            }}
            className="text-muted-foreground hover:text-foreground text-sm font-medium"
          >
            {saveExitLabel}
          </button>
        )}
      </div>
    </header>
  )
}

function SellerOnboardingAccountStep({
  values,
  updateAccount,
}: {
  values: SellerOnboardingFormValues
  updateAccount: SellerOnboardingController['updateAccount']
}) {
  return (
    <div className="grid gap-5">
      <div className="grid gap-4 md:grid-cols-2">
        <Field>
          <FieldLabel>Email *</FieldLabel>
          <FieldContent>
            <Input
              value={values.account.email}
              onChange={(event) => updateAccount('email', event.target.value)}
            />
          </FieldContent>
        </Field>

        <Field>
          <FieldLabel>Mobile number *</FieldLabel>
          <FieldContent>
            <Input
              value={values.account.mobileNumber}
              onChange={(event) => updateAccount('mobileNumber', event.target.value)}
            />
          </FieldContent>
        </Field>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Field>
          <FieldLabel>Password *</FieldLabel>
          <FieldContent>
            <Input
              type="password"
              value={values.account.password}
              onChange={(event) => updateAccount('password', event.target.value)}
            />
          </FieldContent>
          <FieldDescription>At least 8 characters with a number</FieldDescription>
        </Field>

        <Field>
          <FieldLabel>OTP</FieldLabel>
          <FieldContent>
            <Input
              value={values.account.otp}
              onChange={(event) => updateAccount('otp', event.target.value)}
            />
          </FieldContent>
          <FieldDescription>We sent a 6-digit code</FieldDescription>
        </Field>
      </div>
    </div>
  )
}

function SellerOnboardingShopStep({
  values,
  categoryOptions,
  countryOptions,
  updateShop,
}: {
  values: SellerOnboardingFormValues
  categoryOptions: string[]
  countryOptions: string[]
  updateShop: SellerOnboardingController['updateShop']
}) {
  return (
    <div className="grid gap-5">
      <div className="grid gap-4 md:grid-cols-2">
        <Field>
          <FieldLabel>Shop name *</FieldLabel>
          <FieldContent>
            <Input
              value={values.shop.shopName}
              onChange={(event) => updateShop('shopName', event.target.value)}
            />
          </FieldContent>
        </Field>

        <Field>
          <FieldLabel>Shop URL</FieldLabel>
          <FieldContent>
            <Input
              value={values.shop.shopUrl}
              onChange={(event) => updateShop('shopUrl', event.target.value)}
            />
          </FieldContent>
          <FieldDescription>halomarket.co/shop/{values.shop.shopUrl}</FieldDescription>
        </Field>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Field>
          <FieldLabel>Primary category *</FieldLabel>
          <FieldContent>
            <Select
              value={values.shop.category}
              onValueChange={(value) => updateShop('category', value)}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {categoryOptions.map((option) => (
                  <SelectItem key={option} value={option}>
                    {option}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </FieldContent>
        </Field>

        <Field>
          <FieldLabel>Country *</FieldLabel>
          <FieldContent>
            <Select
              value={values.shop.country}
              onValueChange={(value) => updateShop('country', value)}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select country" />
              </SelectTrigger>
              <SelectContent>
                {countryOptions.map((option) => (
                  <SelectItem key={option} value={option}>
                    {option}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </FieldContent>
        </Field>
      </div>

      <Field>
        <FieldLabel>Pickup address *</FieldLabel>
        <FieldContent>
          <Textarea
            rows={5}
            value={values.shop.pickupAddress}
            onChange={(event) => updateShop('pickupAddress', event.target.value)}
          />
        </FieldContent>
      </Field>
    </div>
  )
}

function SellerOnboardingKycStep({
  values,
  businessTypeOptions,
  idTypeOptions,
  documentSlots,
  documentInputRefs,
  updateKyc,
  updateDocument,
}: {
  values: SellerOnboardingFormValues
  businessTypeOptions: string[]
  idTypeOptions: string[]
  documentSlots: SellerOnboardingDocumentSlot[]
  documentInputRefs: React.RefObject<Record<SellerOnboardingDocumentKey, HTMLInputElement | null>>
  updateKyc: SellerOnboardingController['updateKyc']
  updateDocument: SellerOnboardingController['updateDocument']
}) {
  return (
    <div className="grid gap-5">
      <div className="grid gap-4 md:grid-cols-2">
        <Field>
          <FieldLabel>Business type *</FieldLabel>
          <FieldContent>
            <Select
              value={values.kyc.businessType}
              onValueChange={(value) => updateKyc('businessType', value)}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select business type" />
              </SelectTrigger>
              <SelectContent>
                {businessTypeOptions.map((option) => (
                  <SelectItem key={option} value={option}>
                    {option}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </FieldContent>
        </Field>

        <Field>
          <FieldLabel>ID type *</FieldLabel>
          <FieldContent>
            <Select value={values.kyc.idType} onValueChange={(value) => updateKyc('idType', value)}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select ID type" />
              </SelectTrigger>
              <SelectContent>
                {idTypeOptions.map((option) => (
                  <SelectItem key={option} value={option}>
                    {option}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </FieldContent>
        </Field>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Field>
          <FieldLabel>Legal name *</FieldLabel>
          <FieldContent>
            <Input
              value={values.kyc.legalName}
              onChange={(event) => updateKyc('legalName', event.target.value)}
            />
          </FieldContent>
        </Field>

        <Field>
          <FieldLabel>ID number *</FieldLabel>
          <FieldContent>
            <Input
              value={values.kyc.idNumber}
              onChange={(event) => updateKyc('idNumber', event.target.value)}
            />
          </FieldContent>
        </Field>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {documentSlots.map((slot) => (
          <DocumentUploadSlot
            key={slot.key}
            label={slot.label}
            fileName={values.kyc.documents[slot.key]}
            inputRef={(node) => {
              documentInputRefs.current[slot.key] = node
            }}
            onOpen={() => documentInputRefs.current[slot.key]?.click()}
            onFileChange={(event) => {
              const file = event.target.files?.[0]

              if (file) {
                updateDocument(slot.key, file.name)
              }
            }}
          />
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Field>
          <FieldLabel>Bank name *</FieldLabel>
          <FieldContent>
            <Input
              value={values.kyc.bankName}
              onChange={(event) => updateKyc('bankName', event.target.value)}
            />
          </FieldContent>
        </Field>

        <Field>
          <FieldLabel>Account holder *</FieldLabel>
          <FieldContent>
            <Input
              value={values.kyc.accountHolder}
              onChange={(event) => updateKyc('accountHolder', event.target.value)}
            />
          </FieldContent>
        </Field>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Field>
          <FieldLabel>Account number *</FieldLabel>
          <FieldContent>
            <Input
              value={values.kyc.accountNumber}
              onChange={(event) => updateKyc('accountNumber', event.target.value)}
            />
          </FieldContent>
        </Field>

        <Field>
          <FieldLabel>SWIFT / Routing</FieldLabel>
          <FieldContent>
            <Input
              value={values.kyc.swiftRouting}
              onChange={(event) => updateKyc('swiftRouting', event.target.value)}
            />
          </FieldContent>
        </Field>
      </div>
    </div>
  )
}

function SellerOnboardingReviewStep({
  values,
  reviewBannerMessage,
}: {
  values: SellerOnboardingFormValues
  reviewBannerMessage: string
}) {
  const reviewItems = useMemo(() => getReviewItems(values), [values])

  return (
    <div className="grid gap-6">
      <div className="rounded-2xl bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700">
        {reviewBannerMessage}
      </div>

      <div className="divide-border divide-y rounded-2xl border bg-white">
        {reviewItems.map((item) => (
          <div key={item.label} className="grid gap-3 px-4 py-4 md:grid-cols-[160px_1fr]">
            <span className="text-muted-foreground text-sm">{item.label}</span>
            <div className="text-right text-sm font-medium">{item.value}</div>
          </div>
        ))}
        <div className="grid gap-3 px-4 py-4 md:grid-cols-[160px_1fr]">
          <span className="text-muted-foreground text-sm">Password</span>
          <div className="text-right text-sm font-medium">
            {maskPassword(values.account.password)}
          </div>
        </div>
        <div className="grid gap-3 px-4 py-4 md:grid-cols-[160px_1fr]">
          <span className="text-muted-foreground text-sm">ID number</span>
          <div className="text-right text-sm font-medium">{maskIdNumber(values.kyc.idNumber)}</div>
        </div>
      </div>
    </div>
  )
}

function SellerOnboardingStepContent({
  controller,
  categoryOptions,
  countryOptions,
  businessTypeOptions,
  idTypeOptions,
  documentSlots,
  reviewBannerMessage,
}: {
  controller: SellerOnboardingController
  categoryOptions: string[]
  countryOptions: string[]
  businessTypeOptions: string[]
  idTypeOptions: string[]
  documentSlots: SellerOnboardingDocumentSlot[]
  reviewBannerMessage: string
}) {
  if (controller.activeStep === 1) {
    return (
      <SellerOnboardingAccountStep
        values={controller.values}
        updateAccount={controller.updateAccount}
      />
    )
  }

  if (controller.activeStep === 2) {
    return (
      <SellerOnboardingShopStep
        values={controller.values}
        categoryOptions={categoryOptions}
        countryOptions={countryOptions}
        updateShop={controller.updateShop}
      />
    )
  }

  if (controller.activeStep === 3) {
    return (
      <SellerOnboardingKycStep
        values={controller.values}
        businessTypeOptions={businessTypeOptions}
        idTypeOptions={idTypeOptions}
        documentSlots={documentSlots}
        documentInputRefs={controller.documentInputRefs}
        updateKyc={controller.updateKyc}
        updateDocument={controller.updateDocument}
      />
    )
  }

  return (
    <SellerOnboardingReviewStep
      values={controller.values}
      reviewBannerMessage={reviewBannerMessage}
    />
  )
}

function SellerOnboardingFooter({
  activeStep,
  submitting,
  onBack,
  onNext,
  onSubmit,
}: {
  activeStep: SellerOnboardingStepIndex
  submitting: boolean
  onBack: () => void
  onNext: () => void
  onSubmit: () => Promise<boolean>
}) {
  return (
    <div className="flex items-center justify-between gap-4">
      <Button
        type="button"
        variant="outline"
        size="lg"
        onClick={onBack}
        disabled={activeStep === 1}
      >
        <ArrowLeft />
        Back
      </Button>

      {activeStep < MAX_STEP ? (
        <Button type="button" size="lg" onClick={onNext}>
          Next
          <ArrowRight />
        </Button>
      ) : (
        <Button type="button" size="lg" onClick={() => void onSubmit()} loading={submitting}>
          Submit
          <Check />
        </Button>
      )}
    </div>
  )
}

export function SellerOnboardingClient({
  title,
  saveExitLabel,
  saveExitHref,
  stepLabels,
  defaultStep,
  currentStep,
  onCurrentStepChange,
  defaultValues,
  categoryOptions,
  countryOptions,
  businessTypeOptions,
  idTypeOptions,
  documentSlots,
  reviewBannerMessage,
  onSaveExit,
  onSubmit,
}: SellerOnboardingClientProps) {
  const controller = useSellerOnboardingController({
    defaultStep,
    currentStep,
    onCurrentStepChange,
    defaultValues,
    documentSlots,
    onSaveExit,
    onSubmit,
  })

  return (
    <div className="min-h-screen bg-[#eef3fb]">
      <SellerOnboardingHeader
        title={title}
        saveExitLabel={saveExitLabel}
        {...(saveExitHref !== undefined ? { saveExitHref } : {})}
        {...(onSaveExit !== undefined ? { onSaveExit } : {})}
        onClickSaveExit={controller.handleSaveExit}
      />

      <main className="mx-auto flex max-w-5xl flex-col gap-5 px-4 py-8 sm:px-6 lg:px-8">
        <SellerOnboardingStepRail currentStep={controller.activeStep} stepLabels={stepLabels} />

        <SectionCard
          title={stepLabels[controller.activeStep - 1]}
          className="rounded-[24px] bg-white"
        >
          {controller.actionError ? (
            <div className="border-destructive/20 bg-destructive/10 text-destructive mb-4 rounded-2xl border px-4 py-3 text-sm">
              {controller.actionError}
            </div>
          ) : null}

          <SellerOnboardingStepContent
            controller={controller}
            categoryOptions={categoryOptions}
            countryOptions={countryOptions}
            businessTypeOptions={businessTypeOptions}
            idTypeOptions={idTypeOptions}
            documentSlots={documentSlots}
            reviewBannerMessage={reviewBannerMessage}
          />
        </SectionCard>

        <SellerOnboardingFooter
          activeStep={controller.activeStep}
          submitting={controller.submitting}
          onBack={controller.handleBack}
          onNext={controller.handleNext}
          onSubmit={controller.handleSubmit}
        />
      </main>
    </div>
  )
}
