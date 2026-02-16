import { dropAllDatabases } from "@rocicorp/zero";
import { ZeroProvider } from "@rocicorp/zero/react";
import { QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { Link } from "@tanstack/react-router";
import * as React from "react";
import {
  Alert,
  Button,
  Card,
  Loader,
  Link as ReshapedLink,
  Text,
  useTheme,
  View,
} from "reshaped";
import { useAppForm } from "~/components/forms/app-form";
import {
  ExternalLinkIcon,
  LogOutIcon,
  MoonIcon,
  SunIcon,
  TvIcon,
} from "~/components/icons";
import { LoadingState } from "~/components/LoadingState";
import { createQueryClient } from "~/lib/query-client";
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
  const [queryClient] = React.useState(() => createQueryClient());

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
        <LoadingState />
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
              attributes={{
                style: { color: "var(--rs-color-foreground-primary)" },
              }}
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
                <Text variant="featured-3" weight="bold">
                  Welcome back
                </Text>
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
    <QueryClientProvider client={queryClient}>
      <ZeroProvider
        schema={schema}
        cacheURL={cacheURL}
        logLevel={logLevel}
        mutators={mutators}
        userID={session.userID}
        context={{ userID: session.userID }}
      >
        <Header email={session.email} onLogout={onLogout} />
        {props.children}
      </ZeroProvider>
      <ReactQueryDevtools initialIsOpen={false} position="bottom" />
    </QueryClientProvider>
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
      attributes={{
        "aria-label": `Switch to ${colorMode === "dark" ? "light" : "dark"} mode`,
      }}
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
                attributes={{
                  style: { color: "var(--rs-color-foreground-primary)" },
                }}
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
                  <Text
                    variant="body-3"
                    attributes={{ className: "hide-on-mobile" }}
                  >
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
            errorValue ? String(errorValue) : `Login failed: ${res.status}`,
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
