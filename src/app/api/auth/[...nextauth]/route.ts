import NextAuth from "next-auth"
// import GoogleProvider from "next-auth/providers/google"
import CredentialsProvider from "next-auth/providers/credentials"
import { authenticateAdmin } from "@/api/auth"

const authOptions = {
  providers: [
    // GoogleProvider({
    //   clientId: process.env.GOOGLE_CLIENT_ID!,
    //   clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    // }),
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null
        }

        try {
          const adminUser = await authenticateAdmin({
            emailAddress: credentials.email,
            password: credentials.password
          })

          if (adminUser) {
            return {
              id: adminUser.id,
              email: adminUser.email,
              name: adminUser.name,
              role: adminUser.role,
              accessToken: adminUser.accessToken
            };
          }

          return null
        } catch (error: unknown) {
          console.error('Authentication error:', error)
          
          // For development mode, allow demo login when API server is not available
          const errorMessage = (error as Error)?.message || '';
          if (errorMessage.includes('API server is not available') || 
              errorMessage.includes('Network error')) {
            
            // Demo credentials for development
            if (credentials.email === 'admin@cleanaid.com' && credentials.password === 'admin123') {
              return {
                id: 'demo-admin-1',
                email: 'admin@cleanaid.com',
                name: 'Demo Admin',
                role: 'admin',
                accessToken: 'demo-token-for-development'
              };
            }
          }
          
          return null
        }
      }
    })
  ],
  pages: {
    signIn: "/auth/login",
  },
  callbacks: {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    async jwt({ token, user }: any) {
      if (user) {
        token.role = user.role
        token.accessToken = user.accessToken
      }
      return token
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    async session({ session, token }: any) {
      if (token) {
        session.user.id = token.sub!
        session.user.role = token.role as string
        session.accessToken = token.accessToken
      }
      return session
    },
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET || "fallback-secret-for-development",
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const handler = (NextAuth as any)(authOptions)

export { handler as GET, handler as POST }