import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"

import { SiteFooter } from "@/components/site-footer"
import { SiteHeader } from "@/components/site-header"

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
  title: "Pen & Pixels — A Markdown Powered Blog",
  description:
    "A minimal blog built with Next.js, Tailwind CSS, and shadcn/ui that renders markdown posts from the filesystem.",
}

const RootLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode
}>) => {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} bg-background text-foreground antialiased`}
      >
        <div className="flex min-h-screen flex-col bg-gradient-to-b from-background via-background to-muted/30">
          <SiteHeader />
          <main className="mx-auto w-full max-w-5xl flex-1 px-6 pb-16 pt-10 sm:px-8">
            {children}
          </main>
          <SiteFooter />
        </div>
      </body>
    </html>
  )
}

export default RootLayout
