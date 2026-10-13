"use client";

import { appConfig } from "@/src/core/config/appConfig";
import { authClient } from "@/src/lib/auth-client";

/** `collapsed` shows only the icon (used by the collapsed sidebar). */
export function SignOutButton({ collapsed = false }: { collapsed?: boolean }) {
	return (
		<button
			type="button"
			title="Sign out"
			className="flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm text-muted hover:bg-background hover:text-foreground"
			onClick={async () => {
				await authClient.signOut();
				window.location.href = appConfig.routes.login;
			}}
		>
			<svg
				viewBox="0 0 24 24"
				className="h-5 w-5 shrink-0"
				fill="none"
				stroke="currentColor"
				strokeWidth="2"
				strokeLinecap="round"
				strokeLinejoin="round"
				aria-hidden="true"
			>
				<path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
				<path d="m16 17 5-5-5-5" />
				<path d="M21 12H9" />
			</svg>
			{!collapsed && <span>Sign out</span>}
		</button>
	);
}
