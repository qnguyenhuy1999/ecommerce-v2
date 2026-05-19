'use client'

import {
  Button,
  DataTable,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  StatusTabs,
  TableToolbar,
} from '@ecom/core-ui'
import { useState } from 'react'
import { returnsDefaultProps } from './ReturnsRefunds.fixtures'
import type {
  RefundMethod,
  ReturnRow,
  ReturnsRefundsProps,
  ReturnsRefundsStatusTab,
} from './ReturnsRefunds.types'
import {
  buildReturnStatusCounts,
  createReturnsColumns,
  filterReturnsBySearchAndStatus,
  isReturnsRefundsStatusTab,
} from './ReturnsRefunds.utils'

interface ReturnsRefundsClientProps {
  returns: ReturnRow[]
  statusTabs?: ReturnsRefundsProps['statusTabs']
  status?: ReturnsRefundsProps['status']
  defaultStatus?: ReturnsRefundsProps['defaultStatus']
  onStatusChange?: ReturnsRefundsProps['onStatusChange']
  statusCounts?: ReturnsRefundsProps['statusCounts']
  searchPlaceholder?: ReturnsRefundsProps['searchPlaceholder']
  emptyMessage?: ReturnsRefundsProps['emptyMessage']
  filterReturns?: ReturnsRefundsProps['filterReturns']
  onApprove?: ReturnsRefundsProps['onApprove']
  onPartial?: ReturnsRefundsProps['onPartial']
  onReject?: ReturnsRefundsProps['onReject']
}

const moneyFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  maximumFractionDigits: 2,
})

export function ReturnsRefundsClient({
  returns,
  statusTabs = returnsDefaultProps.statusTabs,
  status,
  defaultStatus = returnsDefaultProps.defaultStatus,
  onStatusChange,
  statusCounts,
  searchPlaceholder = returnsDefaultProps.searchPlaceholder,
  emptyMessage = returnsDefaultProps.emptyMessage,
  filterReturns = filterReturnsBySearchAndStatus,
  onApprove = returnsDefaultProps.onApprove,
  onPartial = returnsDefaultProps.onPartial,
  onReject = returnsDefaultProps.onReject,
}: ReturnsRefundsClientProps) {
  const [search, setSearch] = useState('')
  const [internalStatus, setInternalStatus] = useState<ReturnsRefundsStatusTab>(defaultStatus)
  const [selectedCase, setSelectedCase] = useState<ReturnRow | null>(null)
  const [refundMethod, setRefundMethod] = useState<RefundMethod>('ORIGINAL_PAYMENT')
  const [sheetOpen, setSheetOpen] = useState(false)

  const currentStatus = status ?? internalStatus
  const counts = statusCounts ?? buildReturnStatusCounts(returns)
  const filteredReturns = filterReturns({ returns, search, status: currentStatus })

  function handleSelectCase(row: ReturnRow) {
    setSelectedCase(row)
    setRefundMethod('ORIGINAL_PAYMENT')
    setSheetOpen(true)
  }

  const columns = createReturnsColumns(handleSelectCase)

  return (
    <>
      <DataTable
        columns={columns}
        data={filteredReturns}
        toolbar={
          <TableToolbar search={search} onSearchChange={setSearch} placeholder={searchPlaceholder}>
            <StatusTabs
              tabs={statusTabs}
              value={currentStatus}
              onChange={(tab) => {
                if (isReturnsRefundsStatusTab(tab)) {
                  if (status === undefined) {
                    setInternalStatus(tab)
                  }
                  onStatusChange?.(tab)
                }
              }}
              counts={counts}
            />
          </TableToolbar>
        }
        emptyMessage={emptyMessage}
      />

      <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
        <SheetContent className="w-full max-w-md overflow-y-auto">
          {selectedCase ? (
            <CaseDetail
              row={selectedCase}
              refundMethod={refundMethod}
              onRefundMethodChange={setRefundMethod}
              onApprove={() => {
                onApprove(selectedCase.id, refundMethod)
                setSheetOpen(false)
              }}
              onPartial={() => {
                onPartial(selectedCase.id, refundMethod)
                setSheetOpen(false)
              }}
              onReject={() => {
                onReject(selectedCase.id)
                setSheetOpen(false)
              }}
            />
          ) : null}
        </SheetContent>
      </Sheet>
    </>
  )
}

interface CaseDetailProps {
  row: ReturnRow
  refundMethod: RefundMethod
  onRefundMethodChange: (method: RefundMethod) => void
  onApprove: () => void
  onPartial: () => void
  onReject: () => void
}

function CaseDetail({
  row,
  refundMethod,
  onRefundMethodChange,
  onApprove,
  onPartial,
  onReject,
}: CaseDetailProps) {
  return (
    <>
      <SheetHeader className="pb-4">
        <SheetTitle className="text-foreground text-lg font-bold">{row.caseId}</SheetTitle>
        <SheetDescription className="text-muted-foreground text-sm">
          Order {row.orderNumber} · {row.buyerName}
        </SheetDescription>
      </SheetHeader>

      <div className="flex flex-col gap-4 py-2">
        <div className="bg-card border-border rounded-2xl border p-4">
          <p className="text-foreground mb-2 text-sm font-semibold">Reason</p>
          <p className="text-muted-foreground text-sm">{row.reason}</p>
        </div>

        {row.evidence && row.evidence.length > 0 && (
          <div className="bg-card border-border rounded-2xl border p-4">
            <p className="text-foreground mb-3 text-sm font-semibold">Evidence</p>
            <div className="flex flex-wrap gap-2">
              {row.evidence.map((src, index) => (
                <img
                  key={index}
                  src={src}
                  alt={`Evidence ${index + 1}`}
                  className="h-32 w-32 rounded-xl object-cover"
                />
              ))}
            </div>
          </div>
        )}

        <div className="bg-card border-border rounded-2xl border p-4">
          <p className="text-foreground mb-4 text-sm font-semibold">Decision</p>
          <div className="mb-4 flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Requested amount</span>
            <span className="text-foreground font-semibold">
              {moneyFormatter.format(row.amount)}
            </span>
          </div>
          <Select
            value={refundMethod}
            onValueChange={(v) => onRefundMethodChange(v as RefundMethod)}
          >
            <SelectTrigger className="border-input mb-4 w-full rounded-xl">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {(
                Object.entries({
                  ORIGINAL_PAYMENT: 'Refund to original payment',
                  STORE_CREDIT: 'Refund as store credit',
                  BANK_TRANSFER: 'Refund via bank transfer',
                }) as [RefundMethod, string][]
              ).map(([value, label]) => (
                <SelectItem key={value} value={value}>
                  {label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <div className="flex gap-2">
            <Button
              className="bg-success text-success-foreground hover:bg-success/90 flex-1 rounded-full font-semibold"
              onClick={onApprove}
            >
              Approve full
            </Button>
            <Button
              variant="outline"
              className="border-input flex-1 rounded-full font-medium"
              onClick={onPartial}
            >
              Partial
            </Button>
            <Button
              variant="outline"
              className="border-destructive/30 text-destructive hover:bg-destructive/10 flex-1 rounded-full font-medium"
              onClick={onReject}
            >
              Reject
            </Button>
          </div>
        </div>
      </div>
    </>
  )
}
