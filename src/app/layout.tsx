import '../style/components.scss';
import '../style/globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Date Picker Demo',
  description: 'A Cathay Bank interveiw homework.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  )
}
