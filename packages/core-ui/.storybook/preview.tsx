import '../src/styles/globals.css'

export const parameters = {
  layout: 'centered',
}

export const globalTypes = {
  theme: {
    defaultValue: 'light',
    toolbar: {
      items: ['light', 'dark'],
    },
  },
}

export const decorators = [
  (Story: React.ComponentType, context: { globals: { theme: string } }) => {
    const isDark = context.globals.theme === 'dark'

    return (
      <div className={isDark ? 'bg-background text-foreground min-w-screen dark min-h-screen' : ''}>
        <Story />
      </div>
    )
  },
]
