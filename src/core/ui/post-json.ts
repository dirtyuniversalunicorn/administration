export type PostResult<T = unknown> = { ok: true; data: T } | { ok: false; error: string };

/**
 * POSTs JSON to one of our API routes. Never throws: a failed request (error
 * status or no connection) comes back as `{ ok: false, error }`, where `error`
 * is the API's own message. Client-side only helper, no server imports.
 */
export async function postJson<T = unknown>(url: string, body: unknown): Promise<PostResult<T>> {
	try {
		const response = await fetch(url, {
			method: "POST",
			headers: { "content-type": "application/json" },
			body: JSON.stringify(body),
		});
		const payload = (await response.json().catch(() => null)) as (T & { error?: string }) | null;
		if (!response.ok) return { ok: false, error: payload?.error ?? "Something went wrong." };
		return { ok: true, data: payload as T };
	} catch {
		return { ok: false, error: "Could not reach the server. Try again." };
	}
}
