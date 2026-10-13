"use client";

import { appConfig } from "@/src/core/config/appConfig";
import { authClient } from "@/src/lib/auth-client";

export function SignOutButton() {
	return (
		<button
			type="submit"
			className="rounded-md border border-line-strong px-3 py-1 hover:bg-background"
			onClick={async () => {
				await authClient.signOut();
				window.location.href = appConfig.routes.login;
			}}
		>
			Sign out
		</button>
	);
}
