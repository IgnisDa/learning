import { Link, useNavigate, useRouteContext } from "@tanstack/react-router";
import { type ReactNode } from "react";
import { removeCookie } from "../utils/cookies";
import { apiCall } from "../utils/api";

interface DashboardLayoutProps {
  children: ReactNode;
  activeTab?: "my-shows" | "search";
}

export function DashboardLayout({ children, activeTab }: DashboardLayoutProps) {
  const navigate = useNavigate();
  const { token } = useRouteContext({ from: "/_dashboard" });

  const handleSignOut = async () => {
    if (token) {
      try {
        await apiCall("/api/auth/signout", {
          method: "POST",
          body: JSON.stringify({ token }),
        });
      } catch (error) {
        console.error("Signout error:", error);
      }
    }
    removeCookie("auth_token");
    navigate({ to: "/signin" });
  };

  return (
    <main className="w-full max-w-6xl min-h-screen px-4 pt-8 pb-10 mx-auto sm:px-6 lg:px-8">
      <header className="flex flex-col gap-4 pb-5 mb-8 border-b border-neutral-200 sm:flex-row sm:items-end sm:justify-between">
        <div className="space-y-2">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-neutral-500">
            Workspace
          </p>
          <h1 className="text-3xl font-semibold tracking-tight text-neutral-900">
            TV Explorer
          </h1>
          <p className="max-w-2xl text-sm text-neutral-600">
            Search the TMDB catalog in a clean, Notion-inspired workspace.
          </p>
        </div>

        <button
          className="inline-flex items-center justify-center px-4 text-sm font-medium transition bg-white border rounded-md h-9 border-neutral-300 text-neutral-700 hover:border-neutral-400 hover:bg-neutral-100 hover:text-neutral-900"
          onClick={handleSignOut}
          type="button"
        >
          Sign out
        </button>
      </header>

      <section className="p-4 bg-white border shadow-sm rounded-xl border-neutral-200 sm:p-6">
        <div className="flex items-center gap-2 p-1 border rounded-lg border-neutral-200 bg-neutral-50">
          <Link
            className={`inline-flex items-center justify-center px-3 text-sm font-medium transition rounded-md h-9 ${
              activeTab === "my-shows"
                ? "bg-white text-neutral-900 shadow-sm"
                : "text-neutral-600 hover:text-neutral-900"
            }`}
            to="/"
          >
            My Shows
          </Link>
          <Link
            className={`inline-flex items-center justify-center px-3 text-sm font-medium transition rounded-md h-9 ${
              activeTab === "search"
                ? "bg-white text-neutral-900 shadow-sm"
                : "text-neutral-600 hover:text-neutral-900"
            }`}
            to="/search"
          >
            Search
          </Link>
        </div>

        <div className="mt-5">{children}</div>
      </section>
    </main>
  );
}
