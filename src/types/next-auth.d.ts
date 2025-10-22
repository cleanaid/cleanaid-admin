declare module "next-auth" {
  interface User {
    role: string
  }

  interface Session {
    user: {
      id: string
      name?: string | null
      email?: string | null
      image?: string | null
      role: string
    }
    accessToken?: string
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    role: string
    accessToken?: string
  }
}
