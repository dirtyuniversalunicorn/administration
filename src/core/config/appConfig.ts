import type { ApiRule, FeatureId } from "./feature";

/** Every color the UI uses. Pages use these through Tailwind classes like bg-primary. */
export type ThemeColors = {
	/** Page background and subtle fills (table header, inactive rows). */
	background: string;
	/** Cards, tables, inputs, modals. */
	surface: string;
	/** Main text. */
	foreground: string;
	/** Secondary text. */
	muted: string;
	/** Hairline borders and dividers. */
	line: string;
	/** Borders of inputs and buttons. */
	lineStrong: string;
	/** Brand color: main buttons, active filter. */
	primary: string;
	/** Text on top of primary. */
	primaryForeground: string;
	/** Destructive actions and error messages. */
	danger: string;
	/** Success text and the Active badge. */
	success: string;
	successSoft: string;
};

const themePresets = {
	slate: {
		background: "#f8fafc",
		surface: "#ffffff",
		foreground: "#111827",
		muted: "#475569",
		line: "#e2e8f0",
		lineStrong: "#cbd5e1",
		primary: "#0f172a",
		primaryForeground: "#ffffff",
		danger: "#dc2626",
		success: "#15803d",
		successSoft: "#dcfce7",
	},
	indigo: {
		background: "#f5f6ff",
		surface: "#ffffff",
		foreground: "#1e1b4b",
		muted: "#52525b",
		line: "#e0e7ff",
		lineStrong: "#c7d2fe",
		primary: "#4338ca",
		primaryForeground: "#ffffff",
		danger: "#dc2626",
		success: "#15803d",
		successSoft: "#dcfce7",
	},
	emerald: {
		background: "#f4faf7",
		surface: "#ffffff",
		foreground: "#052e16",
		muted: "#4b5563",
		line: "#d1fae5",
		lineStrong: "#a7f3d0",
		primary: "#047857",
		primaryForeground: "#ffffff",
		danger: "#dc2626",
		success: "#15803d",
		successSoft: "#dcfce7",
	},
	rose: {
		background: "#fff7f8",
		surface: "#ffffff",
		foreground: "#4c0519",
		muted: "#6b7280",
		line: "#fecdd3",
		lineStrong: "#fda4af",
		primary: "#be123c",
		primaryForeground: "#ffffff",
		danger: "#b91c1c",
		success: "#15803d",
		successSoft: "#dcfce7",
	},
} satisfies Record<string, ThemeColors>;

/** Core routes. Each feature owns its own routes in src/features/<name>/config.ts. */
const routes = {
	/** Public landing page with the login form. */
	login: "/",
	/** Where an authenticated user lands after login. */
	dashboard: "/dashboard",
	/** User management (register form + list). */
	users: "/dashboard/users",
	/** Explains that a feature is turned off (the proxy rewrites its pages here). */
	featureDisabled: (id: string) => `/dashboard/feature-disabled/${encodeURIComponent(id)}`,
};

const featureFlags: Record<FeatureId, boolean> = {
	items: true,
	blogs: true,
	contact: true,
	subscribe: true,
	translations: true,
	website: true,
	seo: true,
};

export const appConfig = {
	site: {
		name: "Administration",
		description: "Admin console",
		locale: "en",
	},

	routes,

	auth: {
		/**
		 * Page path prefixes that require a session. Anything starting with one of
		 * these (e.g. "/dashboard" and "/dashboard/users") redirects to
		 * `routes.login` when there is no session cookie.
		 */
		protectedPaths: ["/dashboard"],
		minPasswordLength: 8,
	},

	api: {
		/**
		 * Anonymous (no login) API access, used by the client-facing app.
		 * A trailing "/*" matches the whole subtree, otherwise the path is exact.
		 * Every /api path NOT listed here needs a session cookie (admin only).
		 * `cors: true` adds CORS headers so the client app's origin can call it.
		 */
		public: [
			{ path: "/api/auth/*", methods: ["GET", "POST"], cors: false }, // Better Auth does its own checks
			// No feature owns this stub yet. Features add their own entries in their config.
			{ path: "/api/collection/get", methods: ["GET"], cors: true },
		] as ApiRule[],

		/** Always rejected (403), even with a session. Wins over `public`. */
		blocked: [] as string[],

		cors: {
			/** Origins of the client-facing app(s). "*" allows any origin. */
			allowedOrigins: ["*"],
			allowedHeaders: ["Content-Type"],
			maxAgeSeconds: 86400,
		},
	},

	email: {
		/** Must be an address on a domain verified with the email provider. */
		from: "Administration <no-reply@example.com>",
	},

	theme: {
		/**
		 * Which preset to use: "slate" | "indigo" | "emerald" | "rose". Set the THEME
		 * variable on the Worker to switch without touching code. Add a new preset
		 * by adding another entry to themePresets above.
		 */
		active: "slate" as keyof typeof themePresets,
		presets: themePresets as Record<string, ThemeColors>,
		/** Override single colors on top of the active preset, e.g. { primary: "#7c3aed" }. */
		overrides: {} as Partial<ThemeColors>,
	},

	/**
	 * Feature flags. false = the feature is off everywhere: no sidebar entry, its
	 * pages and API routes answer 404, and its code refuses to run.
	 */
	features: featureFlags,
} as const;

export type AppConfig = typeof appConfig;

export function isFeatureEnabled(id: FeatureId): boolean {
	return appConfig.features[id];
}
