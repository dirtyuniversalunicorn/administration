import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { appConfig } from "@/core/config/appConfig";
import { DashboardShell } from "@/core/ui/dashboard-shell";
import { auth } from "@/lib/auth";

export default async function DashboardLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	const session = await auth.api.getSession({ headers: await headers() });
	if (!session) redirect(appConfig.routes.login);

	return <DashboardShell email={session.user.email}>{children}</DashboardShell>;
}
