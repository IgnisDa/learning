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

// Icons
const SunIcon = () => (
	<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
		<circle cx="12" cy="12" r="4" />
		<path d="M12 2v2" />
		<path d="M12 20v2" />
		<path d="m4.93 4.93 1.41 1.41" />
		<path d="m17.66 17.66 1.41 1.41" />
		<path d="M2 12h2" />
		<path d="M20 12h2" />
		<path d="m6.34 17.66-1.41 1.41" />
		<path d="m19.07 4.93-1.41 1.41" />
	</svg>
);

const MoonIcon = () => (
	<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
		<path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
	</svg>
);

const TvIcon = () => (
	<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
		<rect width="20" height="15" x="2" y="7" rx="2" ry="2" />
		<polyline points="17 2 12 7 7 2" />
	</svg>
);

const ExternalLinkIcon = () => (
	<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
		<path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
		<polyline points="15 3 21 3 21 9" />
		<line x1="10" x2="21" y1="14" y2="3" />
	</svg>
);

const LogOutIcon = () => (
	<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
		<path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
		<polyline points="16 17 21 12 16 7" />
		<line x1="21" x2="9" y1="12" y2="12" />
	</svg>
);

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
			<View minHeight="100vh" align="center" justify="center">
				<View direction="row" gap={3} align="center">
					<Loader size="medium" ariaLabel="Loading" />
					<Text variant="body-2" color="neutral-faded">
						Loading...
					</Text>
				</View>
			</View>
		);
	}

	if (!session) {
		return (
			<View minHeight="100vh" align="center" justify="center" padding={4}>
				<View maxWidth="420px" width="100%" gap={6}>
					<View align="center" gap={3}>
						<View
							width="64px"
							height="64px"
							borderRadius="large"
							backgroundColor="primary-faded"
							align="center"
							justify="center"
							attributes={{ style: { color: "var(--rs-color-foreground-primary)" } }}
						>
							<TvIcon />
						</View>
						<View align="center" gap={1}>
							<Text variant="featured-2" weight="bold">
								Zero Sample
							</Text>
							<Text variant="body-2" color="neutral-faded" align="center">
								Track your favorite TV shows with real-time sync
							</Text>
						</View>
					</View>

					<Card padding={6}>
						<View gap={5}>
							<View gap={1}>
								<Text variant="featured-3" weight="bold">Welcome back</Text>
								<Text variant="body-3" color="neutral-faded">
									Sign in with your email to continue
								</Text>
							</View>
							<LoginForm onSuccess={refreshSession} />
							{authError ? (
								<Alert color="critical" title="Auth Error">
									{authError}
								</Alert>
							) : null}
						</View>
					</Card>

					<View align="center">
						<ReshapedLink
							href="https://zero.rocicorp.dev"
							attributes={{ target: "_blank", rel: "noreferrer" }}
						>
							<View direction="row" align="center" gap={1}>
								<Text variant="caption-1" color="neutral-faded">
									Powered by Zero
								</Text>
								<ExternalLinkIcon />
							</View>
						</ReshapedLink>
					</View>
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
			color="neutral"
			size="small"
			onClick={toggleColorMode}
			attributes={{ "aria-label": `Switch to ${colorMode === "dark" ? "light" : "dark"} mode` }}
		>
			{colorMode === "dark" ? <SunIcon /> : <MoonIcon />}
		</Button>
	);
}

function Header(props: {
	email: string | null;
	onLogout: (() => void) | null;
}) {
	return (
		<View className="app-header">
			<View className="page-container">
				<View
					direction="row"
					align="center"
					justify="space-between"
					gap={4}
					paddingBlock={3}
				>
					{/* Logo */}
					<Link to="/" style={{ textDecoration: "none" }}>
						<View direction="row" align="center" gap={3}>
							<View
								width="36px"
								height="36px"
								borderRadius="medium"
								backgroundColor="primary-faded"
								align="center"
								justify="center"
								attributes={{ style: { color: "var(--rs-color-foreground-primary)" } }}
							>
								<TvIcon />
							</View>
							<View gap={0}>
								<Text className="app-logo">Zero Sample</Text>
								<Text variant="caption-2" color="neutral-faded">
									TV Show Tracker
								</Text>
							</View>
						</View>
					</Link>

					{/* Right side */}
					<View direction="row" align="center" gap={2}>
						<ColorModeToggle />

						{props.email ? (
							<View
								padding={2}
								paddingInline={3}
								borderRadius="medium"
								backgroundColor="neutral-faded"
								attributes={{ className: "hide-on-mobile" }}
							>
								<Text variant="caption-1" color="neutral-faded" maxLines={1}>
									{props.email}
								</Text>
							</View>
						) : null}

						{props.onLogout ? (
							<Button
								variant="ghost"
								color="neutral"
								size="small"
								onClick={props.onLogout}
							>
								<View direction="row" align="center" gap={2}>
									<LogOutIcon />
									<Text variant="body-3" attributes={{ className: "hide-on-mobile" }}>
										Sign out
									</Text>
								</View>
							</Button>
						) : null}

						<ReshapedLink
							href="https://zero.rocicorp.dev"
							attributes={{ target: "_blank", rel: "noreferrer" }}
						>
							<Button variant="outline" size="small" color="neutral">
								<View direction="row" align="center" gap={1}>
									<Text variant="body-3">Docs</Text>
									<ExternalLinkIcon />
								</View>
							</Button>
						</ReshapedLink>
					</View>
				</View>
			</View>
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
			<View gap={4}>
				<form.AppField name="email">
					{(field) => (
						<field.TextInputField
							label="Email address"
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
