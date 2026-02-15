import * as schema from "@/db/auth-schema"
import { db } from "@/db/connection"
import { betterAuth } from "better-auth"
import { drizzleAdapter } from "better-auth/adapters/drizzle"
import { tanstackStartCookies } from "better-auth/tanstack-start"
import { networkInterfaces } from "os"

// Get network IP for trusted origins
const nets = networkInterfaces()
let networkIP = `192.168.1.1` // fallback

for (const name of Object.keys(nets)) {
  const netInterfaces = nets[name]
  if (netInterfaces) {
    for (const net of netInterfaces) {
      if (net.family === `IPv4` && !net.internal) {
        networkIP = net.address
        break
      }
    }
  }
}

export const auth = betterAuth({
  plugins: [tanstackStartCookies()],
  database: drizzleAdapter(db, {
    schema,
    provider: `pg`,
    usePlural: true,
  }),
  trustedOrigins: [
    `https://tanstack-start-db-electric-starter.localhost`,
    `https://${networkIP}`,
    `http://localhost:5173`, // fallback for direct Vite access
  ],
  emailAndPassword: {
    enabled: true,
    // Disable signup in production, allow in dev
    disableSignUp: process.env.NODE_ENV === `production`,
    minPasswordLength: process.env.NODE_ENV === `production` ? 8 : 1,
  },
})
