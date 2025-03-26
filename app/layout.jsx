"use client"
import Navbar from '@/components/navbar'
import { useEffect } from 'react';
import './globals.css'


export default function RootLayout({
  children,
}) {
  useEffect(() => {
    fetch("/api/socket");
  }, []);
  return (
    <html lang="en">
      <body>
        <Navbar />
        {children}
      </body>
    </html>
  )
}
