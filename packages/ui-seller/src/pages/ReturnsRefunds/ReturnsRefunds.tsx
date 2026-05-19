import { ConsolePageLayout } from '@ecom/core-ui'
import { ReturnsRefundsClient } from './ReturnsRefunds.client'
import { returnsDefaultProps } from './ReturnsRefunds.fixtures'
import type { ReturnsRefundsProps } from './ReturnsRefunds.types'
import { filterReturnsBySearchAndStatus } from './ReturnsRefunds.utils'

export function ReturnsRefunds({
  title = returnsDefaultProps.title,
  description = returnsDefaultProps.description,
  returns = returnsDefaultProps.returns,
  statusTabs = returnsDefaultProps.statusTabs,
  status,
  defaultStatus = returnsDefaultProps.defaultStatus,
  onStatusChange,
  statusCounts,
  searchPlaceholder = returnsDefaultProps.searchPlaceholder,
  emptyMessage = returnsDefaultProps.emptyMessage,
  filterReturns = filterReturnsBySearchAndStatus,
  onApprove,
  onPartial,
  onReject,
}: ReturnsRefundsProps) {
  return (
    <ConsolePageLayout title={title} description={description}>
      <ReturnsRefundsClient
        returns={returns}
        statusTabs={statusTabs}
        status={status}
        defaultStatus={defaultStatus}
        onStatusChange={onStatusChange}
        statusCounts={statusCounts}
        searchPlaceholder={searchPlaceholder}
        emptyMessage={emptyMessage}
        filterReturns={filterReturns}
        onApprove={onApprove}
        onPartial={onPartial}
        onReject={onReject}
      />
    </ConsolePageLayout>
  )
}
