import { TanStackDevtools } from "@tanstack/react-devtools";
import {
	createRootRoute,
	HeadContent,
	Link,
	Scripts,
} from "@tanstack/react-router";
import { TanStackRouterDevtoolsPanel } from "@tanstack/react-router-devtools";

import appCss from "../styles.css?url";

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
			{
				title: "Radarr IoT",
			},
		],
		links: [
			{
				rel: "stylesheet",
				href: appCss,
			},
		],
	}),
	shellComponent: RootDocument,
});

function RootDocument({ children }: { children: React.ReactNode }) {
	return (
		<html lang="es">
			<head>
				<HeadContent />
			</head>
			<body className="bg-neutral-950 text-white min-h-screen">
				<nav className="p-4 border-b border-neutral-800 flex gap-4 items-center justify-between">
					<div className="font-bold text-xl text-green-500 tracking-tighter">
						RADARR
					</div>
					<div className="flex gap-4">
						<Link
							to="/"
							className="hover:text-green-500 [&.active]:text-green-500 transition-colors"
						>
							Radar
						</Link>
						<Link
							to="/setup"
							className="hover:text-green-500 [&.active]:text-green-500 transition-colors"
						>
							Configuración
						</Link>
					</div>
				</nav>
				<main className="container mx-auto p-4 flex flex-col items-center">
					{children}
				</main>
				<TanStackDevtools
					config={{
						position: "bottom-right",
					}}
					plugins={[
						{
							name: "Tanstack Router",
							render: <TanStackRouterDevtoolsPanel />,
						},
					]}
				/>
				<Scripts />
			</body>
		</html>
	);
}
