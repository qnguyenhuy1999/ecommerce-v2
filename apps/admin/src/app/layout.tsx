import './globals.css'
import { QueryProvider } from '@/lib/query-client'
import { AuthProvider } from '@/providers/auth-provider'

export const metadata = {
  title: 'Admin Panel — Marketplace',
  description: 'Multi-vendor marketplace admin dashboard',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-background font-sans antialiased">
        <QueryProvider>
          <AuthProvider>{children}</AuthProvider>
        </QueryProvider>
      </body>
    </html>
  )
}
