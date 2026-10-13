import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/src/lib/auth";
import { SignOutButton } from "../../core/auth/components/sign-out-button";
import { appConfig } from "@/src/core/config/appConfig";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) redirect(appConfig.routes.login);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-950">
      <header className="flex items-center justify-between border-b border-slate-200 bg-white px-6 py-3">
        <nav className="flex gap-4 text-sm font-medium">
          {appConfig.nav.map((item) => (
            <a key={item.href} href={item.href}>{item.label}</a>
          ))}
        </nav>
        <div className="flex items-center gap-3 text-sm">
          <span className="text-slate-600">{session.user.email}</span>
          <SignOutButton />
        </div>
      </header>
      <main className="mx-auto max-w-2xl px-6 py-10">{children}</main>
    </div>
  );
}
