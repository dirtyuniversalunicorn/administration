import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";
import { appConfig } from "@/src/core/config/appConfig";
import { DashboardShell } from "@/src/core/ui/dashboard-shell";
import { SIDEBAR_COOKIE } from "@/src/core/ui/sidebar-cookie";
import { nav } from "@/src/features/registry";
import { auth } from "@/src/lib/auth";

export default async function DashboardLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	const session = await auth.api.getSession({ headers: await headers() });
	if (!session) redirect(appConfig.routes.login);

	// Read on the server so a collapsed sidebar doesn't flash open on page load.
	const collapsed = (await cookies()).get(SIDEBAR_COOKIE)?.value === "1";

	return (
		<DashboardShell
			email={session.user.email}
			nav={nav}
			defaultCollapsed={collapsed}
		>
			{children}
		</DashboardShell>
	);
}
