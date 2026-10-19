"use client";

import { type ReactNode, useState } from "react";
import { postJson } from "./post-json";

/**
 * A button that POSTs `body` to an API route (for example Activate / Inactivate)
 * and then reloads the page, or goes to `redirectTo`. If the API refuses, its
 * message is shown next to the button.
 *
 * Status buttons colour themselves: a body with `status: "INACTIVE"` is red
 * (danger), `status: "ACTIVE"` is green. `className` adds to that, it does not
 * replace the colour.
 */
export function ApiButton({ url, body, children, redirectTo, className = "hover:underline" }: { url: string; body: unknown; children: ReactNode; redirectTo?: string; className?: string }) {
	const [pending, setPending] = useState(false);
	const [error, setError] = useState("");
	const status = typeof body === "object" && body !== null && "status" in body ? body.status : undefined;
	const tone = status === "INACTIVE" ? "text-danger" : status === "ACTIVE" ? "text-success" : "text-foreground";

	async function run() {
		setPending(true);
		setError("");
		const result = await postJson(url, body);
		if (!result.ok) {
			setError(result.error);
			setPending(false);
			return;
		}
		if (redirectTo) window.location.href = redirectTo;
		else window.location.reload();
	}

	return (
		<>
			<button type="button" className={`${tone} ${className} disabled:opacity-50`} disabled={pending} onClick={run}>
				{children}
			</button>
			{error && (
				<span role="alert" className="text-xs text-danger">
					{error}
				</span>
			)}
		</>
	);
}
