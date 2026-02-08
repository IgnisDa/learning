import { dropAllDatabases } from "@rocicorp/zero";
import { ZeroProvider } from "@rocicorp/zero/react";
import { Link } from "@tanstack/react-router";
import * as React from "react";
import { View, Text, Button, Card, Alert, Divider, Loader, Link as ReshapedLink, useTheme } from "reshaped";
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
			<View padding={6} direction="row" gap={2} align="center">
				<Loader size="small" ariaLabel="Loading" />
				<Text variant="body-3" color="neutral-faded">
					Loading...
				</Text>
			</View>
		);
	}

	if (!session) {
		return (
			<View minHeight="60vh" padding={6}>
				<View maxWidth="512px" gap={6}>
					<Header email={null} onLogout={null} />
					<Card>
						<View gap={3}>
							<Text variant="title-6">Sign in</Text>
							<Text variant="body-3" color="neutral-faded">
								Email-only login (POC). This sets an HttpOnly cookie that
								zero-cache forwards to the Zero query/mutate endpoints.
							</Text>
							<LoginForm onSuccess={refreshSession} />
							{authError ? (
								<Alert color="critical" title="Auth Error">
									{authError}
								</Alert>
							) : null}
						</View>
					</Card>
				</View>
			</View>
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

function ColorModeToggle() {
	const { colorMode, setColorMode } = useTheme();

	const toggleColorMode = React.useCallback(() => {
		const newMode = colorMode === "dark" ? "light" : "dark";
		setColorMode(newMode);
		// Persist to localStorage
		try {
			localStorage.setItem("rs-color-mode", newMode);
		} catch (e) {
			// Ignore storage errors
		}
	}, [colorMode, setColorMode]);

	return (
		<Button
			variant="ghost"
			size="small"
			onClick={toggleColorMode}
			attributes={{ "aria-label": `Switch to ${colorMode === "dark" ? "light" : "dark"} mode` }}
		>
			{colorMode === "dark" ? "Light" : "Dark"}
		</Button>
	);
}

function Header(props: {
	email: string | null;
	onLogout: (() => void) | null;
}) {
	return (
		<View gap={3} padding={4}>
			<View direction="row" align="center" justify="space-between" gap={3} wrap>
				<View direction="row" align="baseline" gap={3}>
					<Link to="/">
						<Text variant="body-2" weight="bold">
							Zero Sample
						</Text>
					</Link>
					<Text variant="body-3" color="neutral-faded">
						TMDB shows + background enrichment
					</Text>
				</View>
				<View direction="row" align="center" gap={2}>
					<ColorModeToggle />
					{props.email ? (
						<Text variant="body-3" color="neutral-faded" maxLines={1}>
							{props.email}
						</Text>
					) : null}
					{props.onLogout ? (
						<Button
							variant="outline"
							size="small"
							onClick={props.onLogout}
						>
							Logout
						</Button>
					) : null}
					<ReshapedLink
						href="https://zero.rocicorp.dev"
						color="primary"
						attributes={{ target: "_blank", rel: "noreferrer" }}
					>
						Zero Docs
					</ReshapedLink>
				</View>
			</View>
			<Divider />
		</View>
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
		>
			<View gap={3}>
				<form.AppField name="email">
					{(field) => (
						<field.TextInputField
							label="Email"
							type="email"
							placeholder="you@example.com"
						/>
					)}
				</form.AppField>
				<form.AppForm>
					<View>
						<form.SubmitButton
							idleLabel="Sign in"
							submittingLabel="Signing in..."
						/>
					</View>
				</form.AppForm>
				{error ? (
					<Alert color="critical" title="Error">
						{error}
					</Alert>
				) : null}
			</View>
		</form>
	);
}
