import type { Meta, StoryObj } from '@storybook/react-vite'
import { OnboardingStatus } from './OnboardingStatus'
import { onboardingStatusDefaultProps } from './OnboardingStatus.fixtures'

const meta = {
  title: 'Pages/OnboardingStatus',
  component: OnboardingStatus,
  parameters: {
    layout: 'fullscreen',
  },
} satisfies Meta<typeof OnboardingStatus>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    ...onboardingStatusDefaultProps,
  },
}
