import { getSessionCookie } from "better-auth/cookies";
import { type NextRequest, NextResponse } from "next/server";
import { isApiPath } from "@/src/core/config/access";
import { appConfig } from "@/src/core/config/appConfig";
import { accessRules } from "@/src/features/registry";

// Optimistic check (cookie presence only). Real session validation happens
// server-side in src/app/dashboard/layout.tsx; protected API routes should
// also verify the session themselves.
export function proxy(request: NextRequest) {
	const { pathname } = request.nextUrl;

	if (isApiPath(pathname)) {
		const origin = request.headers.get("origin");
		const access = accessRules.apiAccess(pathname, request.method);

		if (access.kind === "disabled") {
			return NextResponse.json({ error: "This feature is not enabled" }, { status: 404 });
		}
		if (access.kind === "blocked") {
			return NextResponse.json({ error: "Forbidden" }, { status: 403 });
		}
		if (access.kind === "method-not-allowed") {
			return NextResponse.json({ error: "Method not allowed" }, { status: 405 });
		}
		if (access.kind === "public") {
			if (request.method === "OPTIONS") {
				return new NextResponse(null, {
					status: 204,
					headers: access.cors ? accessRules.corsHeaders(origin, true) : {},
				});
			}
			const response = NextResponse.next();
			if (access.cors) {
				for (const [k, v] of Object.entries(accessRules.corsHeaders(origin, false)))
					response.headers.set(k, v);
			}
			return response;
		}
		// Not on the public list: admin-only.
		if (!getSessionCookie(request)) {
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
		}
		return NextResponse.next();
	}

	// Dashboard pages need a login first, so logged-out visitors never learn
	// which features exist or are switched off.
	if (accessRules.isProtectedPath(pathname) && !getSessionCookie(request)) {
		return NextResponse.redirect(new URL(appConfig.routes.login, request.url));
	}

	// A disabled feature's pages don't exist (404 status). Logged-in users get a
	// page that explains it instead of a bare "not found".
	const disabledFeature = accessRules.disabledPageFeature(pathname);
	if (disabledFeature) {
		return NextResponse.rewrite(
			new URL(appConfig.routes.featureDisabled(disabledFeature), request.url),
			{ status: 404 },
		);
	}
	return NextResponse.next();
}

// Matcher must be a static literal, so it stays broad (everything except static
// assets); which paths are protected, public or disabled is decided by the
// access rules that src/features/registry.ts builds from appConfig and the features.
export const config = {
	matcher: ["/((?!_next/|.*\\..*).*)"],
};
