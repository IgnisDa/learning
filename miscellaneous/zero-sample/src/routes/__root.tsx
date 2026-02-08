/// <reference types="vite/client" />
import { createRootRoute, HeadContent, Scripts } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
import { Reshaped, View, Loader } from "reshaped";
import * as React from "react";
import { DefaultCatchBoundary } from "~/components/DefaultCatchBoundary";
import { NotFound } from "~/components/NotFound";
import appCss from "~/styles/app.css?url";
import { seo } from "~/utils/seo";
import { ZeroInit } from "~/zero/zero-init";

// Script to detect and apply color mode before React hydrates (prevents flash)
const colorModeScript = `
(function() {
  try {
    var stored = localStorage.getItem('rs-color-mode');
    var mode = stored;
    if (!mode) {
      mode = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    document.documentElement.setAttribute('data-rs-color-mode', mode);
    document.documentElement.setAttribute('data-rs-theme', 'reshaped');
  } catch (e) {}
})();
`;

export const Route = createRootRoute({
	head: () => ({
		meta: [
			{
				charSet: "utf-8",
			},
			{
				name: "viewport",
				content: "width=device-width, initial-scale=1",
			},
			...seo({
				title: "Zero Sample | TMDB Shows",
				description:
					"A POC using Zero + TanStack Start to sync TMDB show data with a background worker.",
			}),
		],
		links: [
			{ rel: "stylesheet", href: appCss },
			{
				rel: "apple-touch-icon",
				sizes: "180x180",
				href: "/apple-touch-icon.png",
			},
			{
				rel: "icon",
				type: "image/png",
				sizes: "32x32",
				href: "/favicon-32x32.png",
			},
			{
				rel: "icon",
				type: "image/png",
				sizes: "16x16",
				href: "/favicon-16x16.png",
			},
			{ rel: "manifest", href: "/site.webmanifest", color: "#fffff" },
			{ rel: "icon", href: "/favicon.ico" },
		],
	}),
	errorComponent: DefaultCatchBoundary,
	notFoundComponent: () => <NotFound />,
	shellComponent: RootDocument,
});

function RootDocument({ children }: { children: React.ReactNode }) {
	return (
		<html data-rs-theme="reshaped" data-rs-color-mode="light">
			<head>
				<HeadContent />
				<script dangerouslySetInnerHTML={{ __html: colorModeScript }} />
			</head>
			<body>
				<Reshaped theme="reshaped">
					<ClientOnly>
						<ZeroInit>{children}</ZeroInit>
						<TanStackRouterDevtools position="bottom-right" />
					</ClientOnly>
				</Reshaped>
				<Scripts />
			</body>
		</html>
	);
}

function ClientOnly(props: { children: React.ReactNode }) {
	const [mounted, setMounted] = React.useState(false);

	React.useEffect(() => {
		setMounted(true);
	}, []);

	if (!mounted) {
		return (
			<View padding={6} align="center" justify="center">
				<Loader size="medium" ariaLabel="Loading application" />
			</View>
		);
	}

	return props.children;
}
