import type React from "react"
import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import { Analytics } from "@vercel/analytics/next"
import { Suspense } from "react"
import { AuthProvider } from "@/contexts/auth-context"
import { CartProvider } from "@/contexts/cart-context"
import { AuthModal } from "@/components/auth-modal"
import { DesktopSidebar } from "@/components/desktop-sidebar"
import "./globals.css"

export const metadata: Metadata = {
  title: "NXTFIT Clothing - Premium Shirts Collection",
  description: "Luxury shirts and premium fashion for the modern lifestyle",
  generator: "v0.app",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`font-sans ${GeistSans.variable} ${GeistMono.variable} antialiased`}>
        <AuthProvider>
          <CartProvider>
            <div className="flex min-h-screen">
              {/* Desktop Sidebar */}
              <DesktopSidebar />

              {/* Main Content */}
              <div className="flex-1 lg:ml-64">
                <Suspense fallback={null}>{children}</Suspense>
              </div>
            </div>

            <AuthModal />
            <Analytics />
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  )
}
