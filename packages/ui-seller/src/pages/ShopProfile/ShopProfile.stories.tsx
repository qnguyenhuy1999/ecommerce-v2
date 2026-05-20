import { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { ConsoleLayout } from '../../layouts/ConsoleLayout'
import { ShopProfile } from './ShopProfile'
import { shopProfileDefaultProps } from './ShopProfile.fixtures'
import type { ShopProfileFormData } from './ShopProfile.types'

const meta: Meta<typeof ShopProfile> = {
  title: 'pages/ShopProfile',
  component: ShopProfile,
  tags: ['autodocs'],
  parameters: { layout: 'fullscreen' },
}

export default meta

type Story = StoryObj<typeof ShopProfile>

export const Default: Story = {
  render: (args) => (
    <ConsoleLayout>
      <ShopProfile {...args} />
    </ConsoleLayout>
  ),
}

export const ControlledSubmit: Story = {
  render: (args) => {
    const [data, setData] = useState<ShopProfileFormData>(shopProfileDefaultProps.initialData)

    return (
      <ConsoleLayout>
        <ShopProfile {...args} initialData={data} onSubmit={setData} />
      </ConsoleLayout>
    )
  },
}
