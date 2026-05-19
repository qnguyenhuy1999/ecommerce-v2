import './globals.css'
import { QueryProvider } from '@/lib/query-client'
import { AuthProvider } from '@/providers/auth-provider'
import { TooltipProvider } from '@ecom/core-ui'

export const metadata = {
  title: 'Admin Panel — Marketplace',
  description: 'Multi-vendor marketplace admin dashboard',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-background min-h-screen font-sans antialiased">
        <QueryProvider>
          <AuthProvider>
            <TooltipProvider>{children}</TooltipProvider>
          </AuthProvider>
        </QueryProvider>
      </body>
    </html>
  )
}
