import { appConfig, type ThemeColors } from "./appConfig";

/**
 * Colors of the active theme. The THEME variable (per deployment) wins over
 * appConfig.theme.active; an unknown name falls back to the configured one.
 * Server-side only (reads process.env): the root layout passes the result to
 * the Chakra <Provider>, which turns it into the design system.
 */
export function getThemeColors(): ThemeColors {
	const { active, presets, overrides } = appConfig.theme;
	return {
		...(presets[process.env.THEME ?? ""] ?? presets[active] ?? presets.slate),
		...overrides,
	};
}
