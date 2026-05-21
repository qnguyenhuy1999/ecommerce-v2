import type { Meta, StoryObj } from '@storybook/react-vite'
import { Typography } from '.'

const meta: Meta<typeof Typography> = {
  title: 'atoms/Typography',
  component: Typography,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: 'Use `Typography` variants instead of raw `h1`-`h6` and `p` tags in shared UI packages.',
      },
    },
  },
}
export default meta
type Story = StoryObj<typeof Typography>

export const Default: Story = {
  render: () => (
    <div className="max-w-xl">
      <Typography variant="h2">Typography</Typography>
      <Typography variant="muted">Clean, readable text styles aligned with the design system.</Typography>
    </div>
  ),
}

export const Variants: Story = {
  render: () => (
    <div className="max-w-xl space-y-3">
      <Typography variant="h1">Heading one</Typography>
      <Typography variant="h2">Heading two</Typography>
      <Typography variant="h3">Heading three</Typography>
      <Typography variant="body">Body copy for normal page paragraphs.</Typography>
      <Typography variant="body-sm">Smaller body copy for dense layouts.</Typography>
      <Typography variant="caption">Caption and metadata</Typography>
      <Typography variant="label">Inline label</Typography>
      <Typography variant="muted">Muted helper text</Typography>
    </div>
  ),
}
