import type { Meta, StoryObj } from '@storybook/react-vite'
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from '.'
import { Button } from '@/atoms/Button'
import { ArrowUpRightIcon, FolderCode } from 'lucide-react'

const meta: Meta<typeof Empty> = {
  title: 'molecules/Empty',
  component: Empty,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
}
export default meta
type Story = StoryObj<typeof Empty>

export const Default: Story = {
  render: () => (
    <Empty>
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <FolderCode />
        </EmptyMedia>
        <EmptyTitle>No Projects Yet</EmptyTitle>
        <EmptyDescription>
          You haven&apos;t created any projects yet. Get started by creating your first project.
        </EmptyDescription>
      </EmptyHeader>
      <EmptyContent className="flex-row justify-center gap-2">
        <Button>Create Project</Button>
        <Button variant="outline">Import Project</Button>
      </EmptyContent>
      <Button variant="link">
        <a href="#" className="inline-flex items-center gap-1">
          Learn More <ArrowUpRightIcon />
        </a>
      </Button>
    </Empty>
  ),
}
