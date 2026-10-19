import type { CSSProperties } from "react";
import { appConfig, type ThemeColors } from "./appConfig";

const kebab = (key: string) => key.replace(/[A-Z]/g, (c) => `-${c.toLowerCase()}`);

/**
 * CSS variables for the active theme, set on <html> in the root layout. The
 * THEME variable (per deployment) wins over appConfig.theme.active; an unknown
 * name falls back to the configured one. Tailwind picks the variables up via
 * the @theme block in globals.css.
 */
export function getTheme(): CSSProperties {
	const { active, presets, overrides } = appConfig.theme;
	const requested = process.env.THEME;
	const colors: ThemeColors = {
		...(presets[requested ?? ""] ?? presets[active] ?? presets.slate),
		...overrides,
	};

	const style: Record<string, string> = {};
	for (const [key, value] of Object.entries(colors)) {
		style[`--${kebab(key)}`] = value;
	}
	return style as CSSProperties;
}
