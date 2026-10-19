"use client";

import { useState } from "react";
import { appConfig } from "@/src/core/config/appConfig";
import { authClient } from "@/src/lib/auth-client";

const input = "w-full rounded-md border border-line-strong bg-surface px-3 py-2 text-sm";

export function LoginForm() {
	const [error, setError] = useState("");
	const [pending, setPending] = useState(false);

	async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
		e.preventDefault();
		const data = new FormData(e.currentTarget);
		setPending(true);
		setError("");
		const { error } = await authClient.signIn.email({
			email: String(data.get("email")),
			password: String(data.get("password")),
		});
		if (error) {
			setError(error.message ?? "Login failed.");
			setPending(false);
			return;
		}
		window.location.href = appConfig.routes.dashboard;
	}

	return (
		<form onSubmit={onSubmit} className="flex flex-col gap-4">
			<input className={input} name="email" type="email" placeholder="Email" required />
			<input className={input} name="password" type="password" placeholder="Password" required />
			<button
				type="submit"
				className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground disabled:opacity-50"
				disabled={pending}
			>
				{pending ? "Signing in..." : "Sign in"}
			</button>
			{error && <p className="text-sm text-danger">{error}</p>}
		</form>
	);
}
