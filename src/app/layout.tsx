import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import AuthSessionProvider from '@/components/AuthSessionProvider';

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Complaint Management System',
  description: 'A comprehensive system for managing complaints and issues',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Header />
        <AuthSessionProvider>
          <div className="min-h-[80vh] flex flex-col justify-between">
            {children}
          </div>
        </AuthSessionProvider>
        <Footer />
      </body>
    </html>
  )
}
