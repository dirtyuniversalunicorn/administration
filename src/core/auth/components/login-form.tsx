"use client";

import { Alert, Button, Stack } from "@chakra-ui/react";
import { useState } from "react";
import { appConfig } from "@/core/config/appConfig";
import { TextField } from "@/core/ui/text-field";
import { authClient } from "@/lib/auth-client";

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
		<form onSubmit={onSubmit}>
			<Stack gap="4">
				<TextField label="Email" name="email" type="email" required />
				<TextField label="Password" name="password" type="password" required />
				<Button
					type="submit"
					colorPalette="brand"
					loading={pending}
					loadingText="Signing in..."
				>
					Sign in
				</Button>
				{error && (
					<Alert.Root status="error">
						<Alert.Indicator />
						<Alert.Title>{error}</Alert.Title>
					</Alert.Root>
				)}
			</Stack>
		</form>
	);
}
