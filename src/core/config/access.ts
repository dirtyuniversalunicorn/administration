import type { ApiRule, FeatureId } from "./feature";

/** Everything the proxy decides with. Built once by src/features/registry.ts. */
export type AccessConfig = {
	/** Page path prefixes that need a session. */
	protectedPaths: readonly string[];
	/** Anonymous API entries (core + enabled features). */
	publicApi: readonly ApiRule[];
	/** API paths that are always rejected, even with a session. */
	blockedApi: readonly string[];
	/** API prefixes of disabled features: they don't exist (404). */
	disabledApiPrefixes: readonly string[];
	/** Page prefixes of disabled features, with the feature that owns each. */
	disabledPages: readonly { prefix: string; id: FeatureId }[];
	cors: {
		allowedOrigins: readonly string[];
		allowedHeaders: readonly string[];
		maxAgeSeconds: number;
	};
};

export type ApiAccess =
	| { kind: "blocked" }
	| { kind: "disabled" }
	| { kind: "public"; cors: boolean }
	| { kind: "session" }
	| { kind: "method-not-allowed" };

function matches(pattern: string, pathname: string): boolean {
	if (pattern.endsWith("/*")) {
		const base = pattern.slice(0, -2);
		return pathname === base || pathname.startsWith(`${base}/`);
	}
	return pathname === pattern;
}

/** True for a path under `prefix` (or the prefix itself). */
const under = (prefix: string, pathname: string) => matches(`${prefix}/*`, pathname);

export function isApiPath(pathname: string): boolean {
	return pathname === "/api" || pathname.startsWith("/api/");
}

/**
 * Pure access rules: no config is imported here, so core stays independent of
 * features. The decisions are made from the data passed in.
 */
export function createAccessRules(config: AccessConfig) {
	return {
		/** True when `pathname` is a protected page path or sits below one. */
		isProtectedPath: (pathname: string) => config.protectedPaths.some((p) => under(p, pathname)),

		/** The disabled feature a dashboard page belongs to, or null. */
		disabledPageFeature: (pathname: string): FeatureId | null =>
			config.disabledPages.find((p) => under(p.prefix, pathname))?.id ?? null,

		/** How an /api request is treated. */
		apiAccess(pathname: string, method: string): ApiAccess {
			// A disabled feature's routes don't exist, not even for admins.
			if (config.disabledApiPrefixes.some((p) => under(p, pathname))) {
				return { kind: "disabled" };
			}
			if (config.blockedApi.some((p) => matches(p, pathname))) return { kind: "blocked" };

			const entry = config.publicApi.find((e) => matches(e.path, pathname));
			if (!entry) return { kind: "session" };
			if (method === "OPTIONS" || entry.methods.includes(method)) {
				return { kind: "public", cors: entry.cors };
			}
			return { kind: "method-not-allowed" };
		},

		/** CORS headers for an allowed request origin, or {} if the origin isn't allowed. */
		corsHeaders(origin: string | null, preflight: boolean): Record<string, string> {
			const { allowedOrigins, allowedHeaders, maxAgeSeconds } = config.cors;
			const any = allowedOrigins.includes("*");
			if (!any && (!origin || !allowedOrigins.includes(origin))) return {};

			const headers: Record<string, string> = {
				"Access-Control-Allow-Origin": any ? "*" : (origin as string),
			};
			if (!any) headers.Vary = "Origin";
			if (preflight) {
				headers["Access-Control-Allow-Methods"] = "GET, POST, OPTIONS";
				headers["Access-Control-Allow-Headers"] = allowedHeaders.join(", ");
				headers["Access-Control-Max-Age"] = String(maxAgeSeconds);
			}
			return headers;
		},
	};
}

export type AccessRules = ReturnType<typeof createAccessRules>;
