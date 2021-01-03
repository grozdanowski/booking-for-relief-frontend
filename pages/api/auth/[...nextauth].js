import NextAuth from 'next-auth'
import Providers from 'next-auth/providers'

const options = {
  
  providers: [
    Providers.Facebook({
      clientId: process.env.FACEBOOK_CLIENT_ID,
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET
    })
    
  ],
}

export default (req, res) => NextAuth(req, res, options)