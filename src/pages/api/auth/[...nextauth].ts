import NextAuth from "next-auth"
import GithubProvider from "next-auth/providers/github"

export const authOptions = {
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      scope: 'read:user'
    }),
  ],
  callbacks: {
    async session(session: object, profile: any){
      try {
        return {
          ...session,
          id: profile.sub
        }
      } catch {
        return {
          ...session,
          id: null
        }
      }
    },
    async signIn(user: any){
      const { email } = user;

      try {
        return true
      } catch(err) {
        console.log('ERRO:', err)
        return false
      }
    }
  }
}

export default NextAuth(authOptions)