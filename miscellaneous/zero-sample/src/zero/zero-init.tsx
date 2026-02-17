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
  Link as ReshapedLink,
  Text,
  useTheme,
  View,
} from "reshaped";
import { authClient } from "~/auth/client";
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
  const sessionState = authClient.useSession();
  const [authError, setAuthError] = React.useState<string | null>(null);
  const [queryClient] = React.useState(() => createQueryClient());

  const session = React.useMemo<Session | null>(() => {
    const user = sessionState.data?.user;
    if (!user) {
      return null;
    }

    return {
      email: user.email,
      userID: user.id,
    };
  }, [sessionState.data]);

  const loading = sessionState.isPending;
  const effectiveAuthError = authError ?? sessionState.error?.message ?? null;

  const refreshSession = React.useCallback(async () => {
    setAuthError(null);
    await sessionState.refetch();
  }, [sessionState]);

  const onLogout = React.useCallback(async () => {
    setAuthError(null);

    try {
      const result = await authClient.signOut();
      if (result.error) {
        throw new Error(result.error.message ?? "Sign out failed");
      }

      await dropAllDatabases();
      await sessionState.refetch();
    } catch (e) {
      setAuthError(getErrorMessage(e, "Sign out failed"));
    }
  }, [sessionState]);

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
                  Sign in with email and password to continue
                </Text>
              </View>
              <LoginForm onSuccess={refreshSession} />
              {effectiveAuthError ? (
                <Alert color="critical" title="Auth Error">
                  {effectiveAuthError}
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
    localStorage.setItem("rs-color-mode", newMode);
  }, [colorMode, setColorMode]);

  return (
    <Button
      size="small"
      variant="ghost"
      color="neutral"
      onClick={toggleColorMode}
      attributes={{ "aria-label": `Switch to ${colorMode} mode` }}
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
  const [mode, setMode] = React.useState<"sign-in" | "sign-up">("sign-in");
  const [error, setError] = React.useState<string | null>(null);

  const form = useAppForm({
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
    onSubmit: async ({ value }) => {
      setError(null);

      try {
        const email = value.email.trim().toLowerCase();
        const password = value.password;

        if (mode === "sign-up") {
          const name = value.name.trim() || email.split("@")[0] || "User";
          const signUpResult = await authClient.signUp.email({
            name,
            email,
            password,
          });

          if (signUpResult.error) {
            throw new Error(signUpResult.error.message ?? "Sign up failed");
          }
        } else {
          const signInResult = await authClient.signIn.email({
            email,
            password,
          });

          if (signInResult.error) {
            throw new Error(signInResult.error.message ?? "Sign in failed");
          }
        }

        await props.onSuccess();
      } catch (e) {
        setError(
          getErrorMessage(
            e,
            mode === "sign-up" ? "Sign up failed" : "Sign in failed",
          ),
        );
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
        {mode === "sign-up" ? (
          <form.AppField name="name">
            {(field) => (
              <field.TextInputField
                label="Display name"
                placeholder="Your name"
              />
            )}
          </form.AppField>
        ) : null}
        <form.AppField name="email">
          {(field) => (
            <field.TextInputField
              label="Email address"
              type="email"
              placeholder="you@example.com"
            />
          )}
        </form.AppField>
        <form.AppField name="password">
          {(field) => (
            <field.TextInputField
              label="Password"
              type="password"
              placeholder="At least 8 characters"
            />
          )}
        </form.AppField>
        <form.AppForm>
          <View direction="row" align="center" justify="space-between" gap={3}>
            <form.SubmitButton
              idleLabel={mode === "sign-up" ? "Create account" : "Sign in"}
              submittingLabel={
                mode === "sign-up" ? "Creating account..." : "Signing in..."
              }
            />
            <Button
              type="button"
              variant="ghost"
              color="neutral"
              size="small"
              onClick={() => {
                setMode(mode === "sign-up" ? "sign-in" : "sign-up");
                setError(null);
              }}
            >
              {mode === "sign-up"
                ? "Have an account? Sign in"
                : "New here? Sign up"}
            </Button>
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
