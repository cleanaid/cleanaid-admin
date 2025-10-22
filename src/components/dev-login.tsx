"use client"

import { useEffect } from "react"
import { signIn, useSession } from "next-auth/react"

export function DevLogin() {
  const { data: session, status } = useSession()

  useEffect(() => {
    // Only auto-login if we don't have a session
    if (status === "loading") return
    if (session) {
      console.log('DevLogin: Already have session, skipping auto-login')
      return
    }

    // Automatically sign in with hardcoded credentials for development
    const autoLogin = async () => {
      console.log('DevLogin: Attempting auto-login...')
      try {
        const result = await signIn("credentials", {
          email: "admin@cleanaid.com",
          password: "admin123",
          redirect: false,
        })
        console.log('DevLogin: Auto-login result:', result)
      } catch (error) {
        console.error("DevLogin: Auto-login failed:", error)
      }
    }

    autoLogin()
  }, [session, status])

  return null // This component doesn't render anything
}
