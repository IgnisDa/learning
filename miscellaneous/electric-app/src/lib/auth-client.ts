import { createAuthClient } from "better-auth/react"
import {
  createCollection,
  localOnlyCollectionOptions,
} from "@tanstack/react-db"
import { z } from "zod"

const authStateSchema = z.object({
  id: z.string(),
  user: z.any().nullable(),
  session: z.any().nullable(),
})

export const authStateCollection = createCollection(
  localOnlyCollectionOptions({
    id: `auth-state`,
    schema: authStateSchema,
    getKey: (item) => item.id,
  })
)

export const authClient = createAuthClient({
  baseURL:
    typeof window !== `undefined`
      ? window.location.origin // Always use current domain in browser
      : undefined, // Let better-auth handle server-side baseURL detection
})
