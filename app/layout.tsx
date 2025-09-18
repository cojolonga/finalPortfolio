import type { Metadata } from 'next'
import { Cinzel, Inter } from 'next/font/google'
import './globals.css'

const cinzel = Cinzel({
  subsets: ['latin'],
  variable: '--font-cinzel',
})

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
})

export const metadata: Metadata = {
  title: 'ArsAI - Professional Photo Restoration & Editing',
  description: 'Professional photo restoration, editing and video production services',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${cinzel.variable} ${inter.variable}`}>
      <body className="bg-inferno-bg text-inferno-fg font-inter antialiased">
        {children}
        <script dangerouslySetInnerHTML={{
          __html: `
            if ('scrollRestoration' in history) {
              history.scrollRestoration = 'manual';
            }
            window.addEventListener('beforeunload', function() {
              window.scrollTo(0, 0);
            });
            window.addEventListener('load', function() {
              window.scrollTo(0, 0);
            });
          `
        }} />
      </body>
    </html>
  )
}
