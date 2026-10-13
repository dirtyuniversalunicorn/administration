import { createSystem, defaultConfig, defineConfig } from "@chakra-ui/react";
import type { ThemeColors } from "@/core/config/appConfig";

const mix = (color: string, percent: number, into: string) =>
	`color-mix(in srgb, ${color} ${percent}%, ${into})`;

/** A full Chakra color palette (what `colorPalette="..."` reads) from one base color. */
function palette(
	solid: string,
	contrast: string,
	surface: string,
	soft?: string,
) {
	return {
		solid: { value: solid },
		contrast: { value: contrast },
		fg: { value: solid },
		muted: { value: mix(solid, 18, surface) },
		subtle: { value: soft ?? mix(solid, 10, surface) },
		emphasized: { value: mix(solid, 28, surface) },
		focusRing: { value: solid },
		border: { value: solid },
	};
}

/**
 * Builds the Chakra design system from the theme colors in appConfig
 * (see theme presets there). Everything in the UI reads these semantic tokens:
 *   bg / bg.panel / fg / fg.muted / border  - page, cards, text, hairlines
 *   colorPalette="brand"                    - primary buttons and accents
 *   colorPalette="red" | "green"            - danger and success
 */
export function createAppSystem(c: ThemeColors) {
	return createSystem(
		defaultConfig,
		defineConfig({
			globalCss: {
				body: { bg: "bg", color: "fg" },
			},
			theme: {
				semanticTokens: {
					colors: {
						bg: {
							DEFAULT: { value: c.background },
							subtle: { value: c.background },
							muted: { value: c.line },
							panel: { value: c.surface },
						},
						fg: {
							DEFAULT: { value: c.foreground },
							muted: { value: c.muted },
							subtle: { value: c.muted },
						},
						border: {
							DEFAULT: { value: c.line },
							muted: { value: c.line },
							subtle: { value: c.line },
							emphasized: { value: c.lineStrong },
						},
						brand: palette(c.primary, c.primaryForeground, c.surface),
						red: palette(c.danger, "#ffffff", c.surface),
						green: palette(c.success, "#ffffff", c.surface, c.successSoft),
					},
				},
			},
		}),
	);
}
