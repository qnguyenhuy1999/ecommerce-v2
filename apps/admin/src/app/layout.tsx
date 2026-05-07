import './globals.css';
import { QueryProvider } from '@/lib/query-client';

export const metadata = {
  title: 'Admin Panel — Marketplace',
  description: 'Multi-vendor marketplace admin dashboard',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-background font-sans antialiased">
        <QueryProvider>{children}</QueryProvider>
      </body>
    </html>
  );
}
