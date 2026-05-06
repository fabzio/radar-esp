import babel from "@rolldown/plugin-babel";
import tailwindcss from "@tailwindcss/vite";
import { devtools } from "@tanstack/devtools-vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import viteReact, { reactCompilerPreset } from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import { VitePWA } from "vite-plugin-pwa";

const config = defineConfig({
  base: '/radar-esp/',
	resolve: { tsconfigPaths: true },
	plugins: [
		devtools(),
		tailwindcss(),
		tanstackStart({
      spa: {
				enabled: true,
				prerender: {
					outputPath: "/index",
				},
			},
		}),
		viteReact(),
		babel({ presets: [reactCompilerPreset()] }),
		VitePWA({ registerType: "autoUpdate" }),
	],
});

export default config;
