import { authClient, authStateCollection } from "@/lib/auth-client"
import { projectCollection } from "@/lib/collections"
import { useLiveQuery } from "@tanstack/react-db"
import {
  createFileRoute,
  Link,
  Outlet,
  useNavigate,
} from "@tanstack/react-router"
import { useEffect, useState } from "react"

export const Route = createFileRoute(`/_authenticated`)({
  ssr: false, // Disable SSR - run beforeLoad only on client
  component: AuthenticatedLayout,
  beforeLoad: async () => {
    if (
      authStateCollection.get(`auth`) &&
      authStateCollection.get(`auth`)?.session.expiresAt > new Date()
    ) {
      return authStateCollection.get(`auth`)!
    } else {
      const result = await authClient.getSession()
      authStateCollection.insert({ id: `auth`, ...result.data })
      return result.data
    }
  },
  errorComponent: ({ error }) => {
    const ErrorComponent = () => {
      const { data: session } = authClient.useSession()

      // Only redirect to login if user is not authenticated
      if (!session && typeof window !== `undefined`) {
        window.location.href = `/login`
        return null
      }

      // For other errors, render an error message
      return (
        <div className="flex items-center justify-center min-h-screen bg-gray-50">
          <div className="text-center">
            <h1 className="mb-4 text-2xl font-bold text-red-600">Error</h1>
            <p className="mb-4 text-gray-600">
              {error?.message || `An unexpected error occurred`}
            </p>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-600"
            >
              Retry
            </button>
          </div>
        </div>
      )
    }

    return <ErrorComponent />
  },
})

function AuthenticatedLayout() {
  const { data: session, isPending } = authClient.useSession()
  const navigate = useNavigate()
  const [showNewProjectForm, setShowNewProjectForm] = useState(false)
  const [newProjectName, setNewProjectName] = useState(``)

  const { data: projects, isLoading } = useLiveQuery((q) =>
    q.from({ projectCollection })
  )

  // Create an initial default project if the user doesn't yet have any.
  useEffect(() => {
    if (session && projects && !isLoading) {
      const hasProject = projects.length > 0
      if (!hasProject) {
        projectCollection.insert({
          id: Math.floor(Math.random() * 100000),
          name: `Default`,
          description: `Default project`,
          owner_id: session.user.id,
          shared_user_ids: [],
          created_at: new Date(),
        })
      }
    }
  }, [session, projects, isLoading])

  const handleLogout = async () => {
    await authClient.signOut()
    navigate({ to: `/login` })
  }

  const handleCreateProject = () => {
    if (newProjectName.trim() && session) {
      projectCollection.insert({
        id: Math.floor(Math.random() * 100000),
        name: newProjectName.trim(),
        description: ``,
        owner_id: session.user.id,
        shared_user_ids: [],
        created_at: new Date(),
      })
      setNewProjectName(``)
      setShowNewProjectForm(false)
    }
  }

  if (isPending) {
    return null
  }

  if (!session) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 shadow">
        <div className="px-3 mx-auto max-w-7xl sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex-shrink-0">
              <h1 className="text-xl font-semibold text-gray-900">
                TanStack DB / Electric Starter
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-700">
                {session.user.email}
              </span>
              <button
                onClick={handleLogout}
                className="px-3 py-2 text-sm font-medium text-gray-700 transition-colors rounded-md hover:text-gray-900 hover:bg-gray-100"
              >
                Sign out
              </button>
            </div>
          </div>
        </div>
      </header>
      <div className="flex">
        <aside className="w-64 min-h-screen bg-white border-r border-gray-200 shadow-sm">
          <div className="p-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-medium text-gray-900">Projects</h2>
              <button
                onClick={() => setShowNewProjectForm(!showNewProjectForm)}
                className="p-1 text-gray-500 hover:text-gray-700"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                  />
                </svg>
              </button>
            </div>

            {showNewProjectForm && (
              <div className="p-3 mb-4 rounded-md bg-gray-50">
                <input
                  type="text"
                  value={newProjectName}
                  onChange={(e) => setNewProjectName(e.target.value)}
                  onKeyDown={(e) => e.key === `Enter` && handleCreateProject()}
                  placeholder="Project name"
                  className="w-full px-2 py-1 text-sm border border-gray-300 rounded"
                />
                <div className="flex gap-2 mt-2">
                  <button
                    onClick={handleCreateProject}
                    className="px-3 py-1 text-sm text-white bg-blue-500 rounded hover:bg-blue-600"
                  >
                    Create
                  </button>
                  <button
                    onClick={() => setShowNewProjectForm(false)}
                    className="px-3 py-1 text-sm text-gray-700 bg-gray-300 rounded hover:bg-gray-400"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}

            <nav className="space-y-1">
              {projects.map((project) => (
                <Link
                  key={project.id}
                  to="/project/$projectId"
                  params={{ projectId: project.id.toString() }}
                  className="block px-3 py-2 text-sm font-medium text-gray-700 rounded-md hover:bg-gray-100"
                >
                  {project.name}
                </Link>
              ))}
            </nav>
          </div>
        </aside>
        <main className="flex-1">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
