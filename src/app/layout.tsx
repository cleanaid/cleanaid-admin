import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { Providers } from "@/lib/providers"
import { SessionProvider } from "@/components/session-provider"
import { DevLogin } from "@/components/dev-login"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Cleanaid Admin",
  description: "Admin dashboard for Cleanaid platform",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <SessionProvider>
          <DevLogin />
          <Providers>
            {children}
          </Providers>
        </SessionProvider>
      </body>
    </html>
  )
}