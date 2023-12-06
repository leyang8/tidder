import type { Metadata } from 'next'
import './globals.css'
import { Navbar } from '@/components'



export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      
      <body className="relative">
       <Navbar></Navbar>
        {children}
       

        </body>
        
    </html>
  )
}
