import { fail } from "@/src/core/api";
import { appConfig } from "@/src/core/config/appConfig";
import { parse, statusBodySchema } from "@/src/core/validation";
import { prisma } from "@/src/lib/prisma";
import { refresh } from "@/src/utils/refresh";

/**
 * Activates or inactivates a user. Users are never deleted: an INACTIVE user
 * cannot sign in (see databaseHooks in lib/auth.ts), but stays in the database
 * with everything they wrote, and can be activated again.
 *
 * Inactivating also revokes the user's open sessions, so they are signed out
 * right away. Refused: inactivating yourself, and inactivating the last
 * active user (nobody could sign in afterwards).
 */
export async function setUserStatus(body: Record<string, unknown>, currentUserId: string) {
	const input = parse(statusBodySchema, body);
	if (!input.ok) return fail(400, input.error);
	const { id, status } = input.value;

	const user = await prisma.user.findUnique({ where: { id }, select: { id: true, status: true } });
	if (!user) return fail(404, "User not found.");

	if (status === "INACTIVE" && user.status === "ACTIVE") {
		if (id === currentUserId) return fail(400, "You cannot inactivate your own account.");
		if ((await prisma.user.count({ where: { status: "ACTIVE" } })) <= 1) return fail(400, "The last active user cannot be inactivated.");
	}

	await prisma.user.update({
		where: { id },
		data: { status, deactivatedAt: status === "INACTIVE" ? new Date() : null },
	});
	if (status === "INACTIVE") await prisma.session.deleteMany({ where: { userId: id } });

	refresh({ index: appConfig.routes.users });
	return { ok: true, value: { id, status } } as const;
}
