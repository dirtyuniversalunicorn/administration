import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { LoginView } from "@/core/auth/components/login-view";
import { appConfig } from "@/core/config/appConfig";
import { auth } from "@/lib/auth";

export default async function Home() {
	const session = await auth.api.getSession({ headers: await headers() });
	if (session) redirect(appConfig.routes.dashboard);

	return <LoginView />;
}
