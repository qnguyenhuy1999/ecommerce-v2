import type { Meta, StoryObj } from '@storybook/react-vite'
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupText,
  InputGroupInput,
  InputGroupTextarea,
} from './InputGroup'
import { Copy, CornerDownLeft, RefreshCcw, SearchIcon } from 'lucide-react'

const meta: Meta<typeof InputGroup> = {
  title: 'atoms/InputGroup',
  component: InputGroup,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
}
export default meta
type Story = StoryObj<typeof InputGroup>

export const Default: Story = {
  render: () => (
    <InputGroup>
      <InputGroupInput placeholder="Search..." />
      <InputGroupAddon align="inline-end">
        <SearchIcon />
      </InputGroupAddon>
    </InputGroup>
  ),
}

export const Textarea: Story = {
  render: () => (
    <div className="grid w-full max-w-md gap-4">
      <InputGroup>
        <InputGroupTextarea id="textarea-code-32" placeholder="console.log('Hello, world!');" className="min-h-50" />
        <InputGroupAddon align="block-start" className="border-b">
          <InputGroupText className="font-mono font-medium">JS script.js</InputGroupText>
          <InputGroupButton className="ml-auto" size="icon-xs">
            <RefreshCcw />
          </InputGroupButton>
          <InputGroupButton variant="ghost" size="icon-xs">
            <Copy />
          </InputGroupButton>
        </InputGroupAddon>

        <InputGroupAddon align="block-end" className="border-t">
          <InputGroupText>Line 1, Column 1</InputGroupText>
          <InputGroupButton size="sm" className="ml-auto" variant="default">
            Run <CornerDownLeft />
          </InputGroupButton>
        </InputGroupAddon>
      </InputGroup>
    </div>
  ),
}
