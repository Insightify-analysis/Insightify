import Navbar from '@/components/navbar'
import './globals.css'

export const metadata = {
  title: 'Insightfy',
  description: 'Insightify is an AI-powered platform designed to empower startups with rapid, accurate, and cost-effective market research tools.',
}

export default function RootLayout({
  children,
}) {
  return (
    <html lang="en">
      <body>
        <Navbar />
        {children}
      </body>
    </html>
  )
}
