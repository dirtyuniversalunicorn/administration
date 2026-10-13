import { appConfig } from "./appConfig";

function matches(pattern: string, pathname: string): boolean {
  if (pattern.endsWith("/*")) {
    const base = pattern.slice(0, -2);
    return pathname === base || pathname.startsWith(`${base}/`);
  }
  return pathname === pattern;
}

/** True when `pathname` is one of the protected page paths or sits below one. */
export function isProtectedPath(pathname: string): boolean {
  return appConfig.auth.protectedPaths.some((p) => matches(`${p}/*`, pathname));
}

export function isApiPath(pathname: string): boolean {
  return pathname === "/api" || pathname.startsWith("/api/");
}

export type ApiAccess =
  | { kind: "blocked" }
  | { kind: "disabled" }
  | { kind: "public"; cors: boolean }
  | { kind: "session" }
  | { kind: "method-not-allowed" };

/** Decide how an /api request is treated, per appConfig.api. */
export function getApiAccess(pathname: string, method: string): ApiAccess {
  // Feature flag: a disabled feature's routes don't exist, not even for admins.
  if (!appConfig.subscription.isEnabled && matches(`${appConfig.subscription.apiPrefix}/*`, pathname)) {
    return { kind: "disabled" };
  }
  if (appConfig.api.blocked.some((p) => matches(p, pathname))) return { kind: "blocked" };

  const entry = appConfig.api.public.find((e) => matches(e.path, pathname));
  if (!entry) return { kind: "session" };
  if (method === "OPTIONS" || entry.methods.includes(method)) {
    return { kind: "public", cors: entry.cors };
  }
  return { kind: "method-not-allowed" };
}

/** CORS headers for an allowed request origin, or {} if the origin isn't allowed. */
export function corsHeaders(origin: string | null, preflight: boolean): Record<string, string> {
  const { allowedOrigins, allowedHeaders, maxAgeSeconds } = appConfig.api.cors;
  const any = (allowedOrigins as readonly string[]).includes("*");
  if (!any && (!origin || !(allowedOrigins as readonly string[]).includes(origin))) return {};

  const headers: Record<string, string> = {
    "Access-Control-Allow-Origin": any ? "*" : (origin as string),
  };
  if (!any) headers["Vary"] = "Origin";
  if (preflight) {
    headers["Access-Control-Allow-Methods"] = "GET, POST, OPTIONS";
    headers["Access-Control-Allow-Headers"] = allowedHeaders.join(", ");
    headers["Access-Control-Max-Age"] = String(maxAgeSeconds);
  }
  return headers;
}
