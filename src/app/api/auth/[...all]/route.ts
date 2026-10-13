import { auth } from "@/src/lib/auth";

// Handlers dereference `auth` per request (not at import) so the lazy instance
// is never created in Worker global scope.
export function GET(request: Request) {
	return auth.handler(request);
}

export function POST(request: Request) {
	return auth.handler(request);
}
