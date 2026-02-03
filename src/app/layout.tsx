import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import { Toaster } from "sonner"
import { HydrationSignal } from "@/components/hydration-signal"
import "./globals.css"

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
})

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
})

export const metadata: Metadata = {
  title: "Agentic Dashboard",
  description: "Agent-testable SaaS dashboard",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" data-test-mode={process.env.NEXT_PUBLIC_TEST_MODE === "true" ? "true" : undefined}>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <HydrationSignal />
        {children}
        <Toaster
          position="top-right"
          duration={process.env.NEXT_PUBLIC_TEST_MODE === "true" ? 10000 : 5000}
          toastOptions={{
            classNames: {
              error: "bg-destructive text-destructive-foreground",
            },
          }}
        />
      </body>
    </html>
  )
}
