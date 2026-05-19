import { useDeferredValue, useMemo, useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { Button } from '@ecom/core-ui'
import { ConsoleLayout } from '../../layouts/ConsoleLayout'
import { productsDefaultProps } from '../../pages/Products/Products.fixtures'
import type { ProductsStatusTab } from '../../pages/Products/Products.types'
import { filterProductsBySearchAndStatus, productsColumns } from '../../pages/Products/Products.utils'
import { SellerListPage } from './SellerListPage'

const meta: Meta<typeof SellerListPage> = {
  title: 'organisms/SellerListPage',
  component: SellerListPage,
  tags: ['autodocs'],
  parameters: { layout: 'fullscreen' },
}

export default meta

type Story = StoryObj<typeof SellerListPage>

export const Default: Story = {
  render: () => {
    const [search, setSearch] = useState('')
    const [status, setStatus] = useState<ProductsStatusTab>('ALL')
    const deferredSearch = useDeferredValue(search)

    const filteredProducts = useMemo(
      () =>
        filterProductsBySearchAndStatus({
          products: productsDefaultProps.products,
          search: deferredSearch,
          status,
        }),
      [deferredSearch, status],
    )

    return (
      <ConsoleLayout>
        <SellerListPage
          title={productsDefaultProps.title}
          description={productsDefaultProps.description}
          actions={
            <SellerListPage.Actions>
              <Button size="sm" variant="outline">
                Import
              </Button>
              <Button size="sm">New product</Button>
            </SellerListPage.Actions>
          }>
          <SellerListPage.Table
            columns={productsColumns}
            data={filteredProducts}
            toolbar={
              <SellerListPage.Filters>
                <SellerListPage.Search
                  value={search}
                  onChange={setSearch}
                  placeholder={productsDefaultProps.searchPlaceholder}
                />
                <SellerListPage.StatusTabs
                  tabs={productsDefaultProps.statusTabs}
                  value={status}
                  onChange={(tab) => setStatus(tab as ProductsStatusTab)}
                  counts={productsDefaultProps.statusCounts}
                />
              </SellerListPage.Filters>
            }
          />
        </SellerListPage>
      </ConsoleLayout>
    )
  },
}
