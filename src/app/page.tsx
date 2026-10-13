import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/src/lib/auth";
import { LoginForm } from "../core/auth/components/login-form";
import { appConfig } from "@/src/core/config/appConfig";

export default async function Home() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (session) redirect(appConfig.routes.home);

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50 px-6 text-slate-950">
      <div className="w-full max-w-sm rounded-lg border border-slate-200 bg-white p-6">
        <h1 className="mb-6 text-xl font-semibold">Sign in</h1>
        <LoginForm />
      </div>
    </main>
  );
}
