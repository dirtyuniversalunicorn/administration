import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { appConfig } from "@/src/core/config/appConfig";
import { auth } from "@/src/lib/auth";
import { LoginForm } from "../core/auth/components/login-form";

export default async function Home() {
	const session = await auth.api.getSession({ headers: await headers() });
	
	if (session) redirect(appConfig.routes.dashboard);

	return (
		<main className="flex min-h-screen items-center justify-center bg-background px-6 text-foreground">
			<div className="w-full max-w-sm rounded-lg border border-line bg-surface p-6">
				<h1 className="mb-6 text-xl font-semibold">Sign in</h1>
				<LoginForm />
			</div>
		</main>
	);
}
