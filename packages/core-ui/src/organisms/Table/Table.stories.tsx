import type { Meta, StoryObj } from '@storybook/react-vite'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '.'

const meta: Meta<typeof Table> = {
  title: 'organisms/Table',
  component: Table,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
}
export default meta
type Story = StoryObj<typeof Table>

export const Default: Story = {
  render: () => (
    <div className="w-md bg-surface border-border overflow-x-auto rounded-lg border">
      <Table className="text-sm">
        <TableHeader className="bg-secondary text-muted-foreground text-xs uppercase tracking-wider">
          <TableRow>
            <TableHead>Item</TableHead>
            <TableHead className="text-right">Price</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell>Hoodie</TableCell>
            <TableCell className="text-right">$49.00</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Socks</TableCell>
            <TableCell className="text-right">$12.00</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>
  ),
}
