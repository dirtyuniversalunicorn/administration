import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { appConfig } from "@/src/core/config/appConfig";
import { auth } from "@/src/lib/auth";
import { can, type Permission } from "./roles";

/**
 * For server components: the signed-in user plus what their role allows.
 * Sends anonymous visitors to the login page.
 *
 *   const { user, can: allowed } = await currentUser();
 *   {allowed("write") && <a href="...">Add</a>}
 */
export async function currentUser() {
	const session = await auth.api.getSession({ headers: await headers() });
	if (!session) redirect(appConfig.routes.login);
	const { user } = session;
	return { user, can: (permission: Permission) => can(user.role, permission) };
}
