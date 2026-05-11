/* eslint-disable sonarjs/no-nested-functions */
import type { Meta, StoryObj } from '@storybook/react-vite'
import { Toaster } from '.'
import { Button } from '../../atoms/Button'
import { toast } from 'sonner'

const meta: Meta<typeof Toaster> = {
  title: 'organisms/Sonner',
  component: Toaster,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
  decorators: [
    (Story) => (
      <>
        <Toaster />
        <Story />
      </>
    ),
  ],
}
export default meta
type Story = StoryObj<typeof Toaster>

export const FullVariants: Story = {
  render: () => (
    <div className="flex flex-wrap gap-2">
      <Button variant="outline" onClick={() => toast('Event has been created')}>
        Default
      </Button>
      <Button variant="outline" onClick={() => toast.success('Event has been created')}>
        Success
      </Button>
      <Button variant="outline" onClick={() => toast.info('Be at the area 10 minutes before the event time')}>
        Info
      </Button>
      <Button variant="outline" onClick={() => toast.warning('Event start time cannot be earlier than 8am')}>
        Warning
      </Button>
      <Button variant="outline" onClick={() => toast.error('Event has not been created')}>
        Error
      </Button>
      <Button
        variant="outline"
        onClick={() => {
          toast.promise<{ name: string }>(
            () => new Promise((resolve) => setTimeout(() => resolve({ name: 'Event' }), 2000)),
            {
              loading: 'Loading...',
              success: (data) => `${data.name} has been created`,
              error: 'Error',
            },
          )
        }}>
        Promise
      </Button>
    </div>
  ),
}
