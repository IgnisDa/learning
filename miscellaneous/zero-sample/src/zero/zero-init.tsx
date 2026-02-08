import { dropAllDatabases } from "@rocicorp/zero";
import { ZeroProvider } from "@rocicorp/zero/react";
import { Link } from "@tanstack/react-router";
import * as React from "react";
import { useAppForm } from "~/components/forms/app-form";
import { getErrorMessage } from "~/utils/error-message";
import { mutators } from "./mutators";
import { schema } from "./schema";

const defaultCacheURL =
	typeof window !== "undefined"
		? new URL("/_zero", window.location.origin).toString()
		: "http://localhost:4848";

const cacheURL = import.meta.env.VITE_PUBLIC_ZERO_CACHE_URL ?? defaultCacheURL;

const logLevel = import.meta.env.VITE_PUBLIC_ZERO_LOG_LEVEL;

type Session = {
	email: string;
	userID: string;
};

export function ZeroInit(props: { children: React.ReactNode }) {
	const [session, setSession] = React.useState<Session | null>(null);
	const [loading, setLoading] = React.useState(true);
	const [authError, setAuthError] = React.useState<string | null>(null);

	const refreshSession = React.useCallback(async () => {
		setLoading(true);
		setAuthError(null);

		try {
			const res = await fetch("/api/auth/me", {
				credentials: "include",
			});

			if (res.status === 401) {
				setSession(null);
				return;
			}

			if (!res.ok) {
				const text = await res.text().catch(() => "");
				throw new Error(`Auth failed: ${res.status} ${text}`);
			}

			setSession((await res.json()) as Session);
		} catch (e) {
			setSession(null);
			setAuthError(e instanceof Error ? e.message : "Auth failed");
		} finally {
			setLoading(false);
		}
	}, []);

	React.useEffect(() => {
		void refreshSession();
	}, [refreshSession]);

	const onLogout = React.useCallback(async () => {
		await fetch("/api/auth/logout", {
			method: "POST",
			credentials: "include",
		});

		await dropAllDatabases();
		setSession(null);
	}, []);

	if (loading) {
		return (
			<div className="p-6 text-sm text-gray-600 dark:text-gray-400">
				Loading...
			</div>
		);
	}

	if (!session) {
		return (
			<div className="min-h-[60vh] p-6">
				<div className="max-w-lg mx-auto space-y-6">
					<Header email={null} onLogout={null} />
					<div className="p-5 bg-white border rounded-lg shadow-sm dark:bg-gray-900">
						<div className="text-lg font-semibold">Sign in</div>
						<div className="mt-1 text-sm text-gray-600 dark:text-gray-400">
							Email-only login (POC). This sets an HttpOnly cookie that
							zero-cache forwards to the Zero query/mutate endpoints.
						</div>
						<LoginForm onSuccess={refreshSession} />
						{authError ? (
							<div className="mt-3 text-sm text-red-700 dark:text-red-300">
								{authError}
							</div>
						) : null}
					</div>
				</div>
			</div>
		);
	}

	return (
		<ZeroProvider
			{...{
				schema,
				cacheURL,
				logLevel,
				mutators,
				userID: session.userID,
				context: { userID: session.userID },
			}}
		>
			<Header email={session.email} onLogout={onLogout} />
			{props.children}
		</ZeroProvider>
	);
}

function Header(props: {
	email: string | null;
	onLogout: (() => void) | null;
}) {
	return (
		<div className="flex flex-col gap-3">
			<div className="flex flex-wrap items-center justify-between gap-3">
				<div className="flex items-baseline gap-3">
					<Link
						to="/"
						activeProps={{
							className: "font-bold",
						}}
						activeOptions={{ exact: true }}
					>
						Zero Sample
					</Link>
					<div className="text-sm text-gray-600 dark:text-gray-400">
						TMDB shows + background enrichment
					</div>
				</div>
				<div className="flex items-center gap-3">
					{props.email ? (
						<div className="max-w-[16rem] truncate text-sm text-gray-600 dark:text-gray-400">
							{props.email}
						</div>
					) : null}
					{props.onLogout ? (
						<button
							onClick={props.onLogout}
							type="button"
							className="px-2 py-1 text-sm bg-white border rounded-md hover:bg-gray-50 dark:bg-gray-900"
						>
							Logout
						</button>
					) : null}
					<a
						className="text-sm text-blue-700 hover:underline dark:text-blue-400"
						href="https://zero.rocicorp.dev"
						target="_blank"
						rel="noreferrer"
					>
						Zero Docs
					</a>
				</div>
			</div>
			<hr />
		</div>
	);
}

function LoginForm(props: { onSuccess: () => Promise<void> }) {
	const [error, setError] = React.useState<string | null>(null);
	const form = useAppForm({
		defaultValues: {
			email: "",
		},
		onSubmit: async ({ value }) => {
			setError(null);

			try {
				const res = await fetch("/api/auth/login", {
					method: "POST",
					credentials: "include",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify({ email: value.email }),
				});

				if (!res.ok) {
					const data: unknown = await res.json().catch(() => null);
					const errorValue =
						data && typeof data === "object" && "error" in data
							? (data as Record<string, unknown>).error
							: null;
					throw new Error(
						errorValue
							? String(errorValue)
							: `Login failed: ${res.status}`,
					);
				}

				await props.onSuccess();
			} catch (e) {
				setError(getErrorMessage(e, "Login failed"));
			}
		},
	});

	return (
		<form
			onSubmit={(e) => {
				e.preventDefault();
				e.stopPropagation();
				void form.handleSubmit();
			}}
			className="mt-4 space-y-3"
		>
			<form.AppField name="email">
				{(field) => (
					<field.TextInputField
						label="Email"
						type="email"
						placeholder="you@example.com"
						className="w-full px-3 py-2 mt-1 text-sm bg-white border rounded-md shadow-sm dark:bg-gray-950"
					/>
				)}
			</form.AppField>
			<form.AppForm>
				<form.SubmitButton
					idleLabel="Sign in"
					submittingLabel="Signing in..."
					className="w-full px-3 text-sm font-medium text-white bg-blue-600 rounded-md h-9 hover:bg-blue-500 disabled:opacity-60"
				/>
			</form.AppForm>
			{error ? (
				<div className="text-sm text-red-700 dark:text-red-300">{error}</div>
			) : null}
		</form>
	);
}
