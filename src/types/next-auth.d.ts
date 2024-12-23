import { DefaultSession, DefaultUser } from 'next-auth'
import { JWT, DefaultJWT } from 'next-auth/jwt'

declare module 'next-auth' {
  interface Session {
    user: {
      id: string
      username: string
      isAdmin: boolean
    } & DefaultSession['user']
  }

  interface User extends DefaultUser {
    username: string
    isAdmin: boolean
  }
}

declare module 'next-auth/jwt' {
  interface JWT extends DefaultJWT {
    id: string
    username: string
    isAdmin: boolean
  }
} 