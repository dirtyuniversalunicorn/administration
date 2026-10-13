"use client";

import { Button } from "@chakra-ui/react";
import { appConfig } from "@/core/config/appConfig";
import { authClient } from "@/lib/auth-client";

export function SignOutButton() {
	return (
		<Button
			size="sm"
			variant="outline"
			onClick={async () => {
				await authClient.signOut();
				window.location.href = appConfig.routes.login;
			}}
		>
			Sign out
		</Button>
	);
}
