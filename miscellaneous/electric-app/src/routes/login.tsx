import { authClient } from "@/lib/auth-client"
import { createFileRoute } from "@tanstack/react-router"
import * as React from "react"
import { useState } from "react"

export const Route = createFileRoute(`/login`)({
  component: Layout,
  ssr: false,
})

function Layout() {
  const [email, setEmail] = useState(``)
  const [password, setPassword] = useState(``)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(``)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(``)

    try {
      let { data: _data, error } = await authClient.signUp.email(
        { email, password, name: email },
        {
          onSuccess: () => {
            window.location.href = `/`
          },
        }
      )

      if (error?.code === `USER_ALREADY_EXISTS_USE_ANOTHER_EMAIL`) {
        const result = await authClient.signIn.email(
          { email, password },
          {
            onSuccess: async () => {
              await authClient.getSession()
              window.location.href = `/`
            },
          }
        )

        _data = result.data
        error = result.error
      }

      if (error) {
        console.error(`Authentication error:`, error)
        setError(error.message || `Authentication failed`)
      }
    } catch (err) {
      console.error(`Unexpected error:`, err)
      setError(`An unexpected error occurred`)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen px-4 py-12 bg-gray-50 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8">
        <div>
          <h2 className="mt-6 text-3xl font-extrabold text-center text-gray-900">
            Sign in to your account
          </h2>
          <div className="p-4 mt-4 border border-blue-200 rounded-md bg-blue-50">
            <p className="text-sm text-blue-700">
              <strong>Development Mode:</strong> Any email/password combination
              will work for testing. Also new accounts will be automatically
              created when you try signing in with a new combo.
            </p>
          </div>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="-space-y-px rounded-md shadow-sm">
            <div>
              <label htmlFor="email" className="sr-only">
                Email address
              </label>
              <input
                required
                id="email"
                name="email"
                type="email"
                value={email}
                autoComplete="email"
                onChange={(e) => setEmail(e.target.value)}
                className="relative block w-full px-3 py-2 text-gray-900 placeholder-gray-500 border border-gray-300 rounded-none appearance-none rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Email address"
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="relative block w-full px-3 py-2 text-gray-900 placeholder-gray-500 border border-gray-300 rounded-none appearance-none rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Password"
              />
            </div>
          </div>

          {error && (
            <div className="p-4 rounded-md bg-red-50">
              <div className="text-sm text-red-700">{error}</div>
            </div>
          )}

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="relative flex justify-center w-full px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md group hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? `Signing in...` : `Sign in`}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
