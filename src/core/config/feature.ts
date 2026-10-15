/*
 * What a "feature" is, as data. Types only, no imports from src/features, so
 * core never depends on a feature. Each feature describes itself in
 * src/features/<name>/config.ts with defineFeature(); src/features/registry.ts
 * is the single place that lists them and hands the result to core as plain
 * data (sidebar entries, access rules).
 *
 * Adding a feature:
 *   1. add its id to FeatureId below and a flag in appConfig.features,
 *   2. create src/features/<id>/config.ts with defineFeature({ ... }),
 *   3. list it in src/features/registry.ts.
 */

/** Every feature id. A missing flag in appConfig.features is a compile error. */
export type FeatureId =
	| "items"
	| "blogs"
	| "contact"
	| "subscribe"
	| "translations"
	| "website"
	| "seo";

/** Icons the sidebar knows (the icon components live in core/ui/dashboard-shell.tsx). */
export type NavIcon =
	| "dashboard"
	| "items"
	| "blogs"
	| "users"
	| "contact"
	| "subscriptions"
	| "translations"
	| "website"
	| "seo";

export type NavEntry = { label: string; href: string; icon: NavIcon };

/** One anonymous API entry. A trailing "/*" matches a whole subtree. */
export type ApiRule = {
	path: string;
	methods: string[];
	/** Adds CORS headers so the client app's origin can call it. */
	cors: boolean;
};

export type FeatureDefinition<Routes = unknown, Settings = unknown> = {
	id: FeatureId;
	/** Dashboard page prefix owned by the feature. Its pages answer 404 while the feature is off. */
	pagePrefix?: string;
	/** API prefix owned by the feature. Its routes answer 404 while the feature is off. */
	apiPrefix?: string;
	/** Sidebar entry. Hidden while the feature is off. */
	nav?: NavEntry;
	/**
	 * Anonymous API entries for the client-facing app. Every /api path not listed
	 * here (or in appConfig.api.public) needs a session.
	 */
	publicApi?: ApiRule[];
	/** Page paths, used by the feature's own pages and actions. */
	routes: Routes;
	/** The feature's own settings. */
	settings: Settings;
};

/**
 * Identity helper that keeps each feature's `routes` and `settings` precisely
 * typed. Feature config files must stay free of server-only imports (prisma,
 * auth, ...): the proxy and the sidebar import them.
 */
export function defineFeature<Routes, Settings = Record<string, never>>(
	definition: Omit<FeatureDefinition<Routes, Settings>, "settings"> & {
		settings?: Settings;
	},
): FeatureDefinition<Routes, Settings> {
	return { settings: {} as Settings, ...definition };
}
