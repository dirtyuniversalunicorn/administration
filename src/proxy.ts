import { getSessionCookie } from "better-auth/cookies";
import { type NextRequest, NextResponse } from "next/server";
import {
	corsHeaders,
	getApiAccess,
	isApiPath,
	isProtectedPath,
} from "./core/config/access";
import { appConfig } from "./core/config/appConfig";

// Optimistic check (cookie presence only). Real session validation happens
// server-side in src/app/dashboard/layout.tsx; protected API routes should
// also verify the session themselves.
export function proxy(request: NextRequest) {
	const { pathname } = request.nextUrl;

	if (isApiPath(pathname)) {
		const origin = request.headers.get("origin");
		const access = getApiAccess(pathname, request.method);

		if (access.kind === "disabled") {
			return NextResponse.json(
				{ error: "This feature is not enabled" },
				{ status: 404 },
			);
		}
		if (access.kind === "blocked") {
			return NextResponse.json({ error: "Forbidden" }, { status: 403 });
		}
		if (access.kind === "method-not-allowed") {
			return NextResponse.json(
				{ error: "Method not allowed" },
				{ status: 405 },
			);
		}
		if (access.kind === "public") {
			if (request.method === "OPTIONS") {
				return new NextResponse(null, {
					status: 204,
					headers: access.cors ? corsHeaders(origin, true) : {},
				});
			}
			const response = NextResponse.next();
			if (access.cors) {
				for (const [k, v] of Object.entries(corsHeaders(origin, false)))
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

	if (isProtectedPath(pathname) && !getSessionCookie(request)) {
		return NextResponse.redirect(new URL(appConfig.routes.login, request.url));
	}
	return NextResponse.next();
}

// Matcher must be a static literal, so it stays broad (everything except static
// assets); which paths are protected or public is decided in appConfig.
export const config = {
	matcher: ["/((?!_next/|.*\\..*).*)"],
};
