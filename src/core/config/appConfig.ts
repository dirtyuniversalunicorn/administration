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

const routes = {
	/** Public landing page with the login form. */
	login: "/",
	/** Where an authenticated user lands after login. */
	home: "/dashboard",
	contact: "/dashboard/contact",
	items: "/dashboard/items",
	/** Detail page of one item (app/dashboard/items/[item]). */
	item: (id: string) => `/dashboard/items/${encodeURIComponent(id)}`,
	itemNew: "/dashboard/items/new",
	itemEdit: (id: string) => `/dashboard/items/${encodeURIComponent(id)}/edit`,
	users: "/dashboard/users",
	subscriptions: "/dashboard/subscriptions",
	translations: "/dashboard/translations",
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
			{ path: "/api/subscribe/add", methods: ["POST"], cors: true },
			// Opened from links inside emails (plain browser navigation, no CORS needed).
			{ path: "/api/subscribe/confirm", methods: ["GET"], cors: false },
			{ path: "/api/subscribe/delete", methods: ["GET"], cors: false }, // unsubscribe
			{ path: "/api/collection/get", methods: ["GET"], cors: true },
			{ path: "/api/item/get", methods: ["GET"], cors: true },
		] as { path: string; methods: string[]; cors: boolean }[],

		/** Always rejected (403), even with a session. Wins over `public`. */
		blocked: [] as string[],

		cors: {
			/** Origins of the client-facing app(s). "*" allows any origin. */
			allowedOrigins: ["*"],
			allowedHeaders: ["Content-Type"],
			maxAgeSeconds: 86400,
		},
	},

	subscription: {
		/**
		 * Feature flag. false = subscriptions are off: every /api/subscribe/* route
		 * answers 404, no subscription code runs and no email is sent.
		 * (`as boolean` keeps TypeScript from narrowing the flag to the literal `false`.)
		 */
		isEnabled: false as boolean,
		/** API path prefix owned by this feature; hidden entirely while disabled. */
		apiPrefix: "/api/subscribe",
		/**
		 * Client-facing app. After a visitor clicks a link in an email they are sent
		 * to `${clientAppUrl}${resultPath}?status=confirmed|unsubscribed|invalid`.
		 * Override per environment with the CLIENT_APP_URL variable.
		 */
		clientAppUrl: "http://localhost:3001",
		resultPath: "/subscription",
		confirmTtlHours: 48,
		/** Re-submitting a PENDING email within this window does not send another mail. */
		resendCooldownSeconds: 60,
	},

	email: {
		/** Must be an address on a domain verified with the email provider. */
		from: "Administration <no-reply@example.com>",
		confirmSubject: "Please confirm your subscription",
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

	nav: [
		{ label: "Dashboard", href: routes.home },
		{ label: "Items", href: routes.items },
		{ label: "Users", href: routes.users },
		{ label: "Contact", href: routes.contact },
	],
} as const;

export type AppConfig = typeof appConfig;
