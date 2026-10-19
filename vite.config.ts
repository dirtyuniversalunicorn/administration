import "dotenv/config";
import { cloudflare } from "@cloudflare/vite-plugin";
import { imagesOptimizer } from "@vinext/cloudflare/images/images-optimizer";
import vinext from "vinext";
import { defineConfig } from "vite";

// Local dev: the Hyperdrive binding connects straight to DATABASE_URL.
process.env.CLOUDFLARE_HYPERDRIVE_LOCAL_CONNECTION_STRING_HYPERDRIVE ??= process.env.DATABASE_URL;

export default defineConfig({
	plugins: [
		vinext({
			images: { optimizer: imagesOptimizer() },
		}),
		cloudflare({
			viteEnvironment: {
				name: "rsc",
				childEnvironments: ["ssr"],
			},
		}),
	],
});
