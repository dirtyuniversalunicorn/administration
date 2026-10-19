"use client";

import { type ReactNode, useState } from "react";
import { postJson } from "./post-json";

/**
 * A button that POSTs `body` to an API route (for example Activate / Inactivate)
 * and then reloads the page, or goes to `redirectTo`. If the API refuses, its
 * message is shown next to the button.
 */
export function ApiButton({
	url,
	body,
	children,
	redirectTo,
	className = "text-foreground hover:underline",
}: {
	url: string;
	body: unknown;
	children: ReactNode;
	redirectTo?: string;
	className?: string;
}) {
	const [pending, setPending] = useState(false);
	const [error, setError] = useState("");

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
			<button type="button" className={`${className} disabled:opacity-50`} disabled={pending} onClick={run}>
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
