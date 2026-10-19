import { z } from "zod";
import { fail } from "@/src/core/api";
import { roles } from "@/src/core/auth/roles";
import { appConfig } from "@/src/core/config/appConfig";
import { idSchema, parse } from "@/src/core/validation";
import { prisma } from "@/src/lib/prisma";
import { refresh } from "@/src/utils/refresh";

const roleBodySchema = z.strictObject({
	id: idSchema,
	role: z.enum(roles, { error: `role must be one of ${roles.join(", ")}.` }),
});

/**
 * Changes a user's role. Takes effect on their next request (the role is read
 * from the database each time). Refused: changing your own role, and taking
 * the admin role from the last active admin.
 */
export async function setUserRole(body: Record<string, unknown>, currentUserId: string) {
	const input = parse(roleBodySchema, body);
	if (!input.ok) return fail(400, input.error);
	const { id, role } = input.value;

	if (id === currentUserId) return fail(400, "You cannot change your own role.");

	const user = await prisma.user.findUnique({ where: { id }, select: { role: true, status: true } });
	if (!user) return fail(404, "User not found.");

	if (user.role === "ADMIN" && role !== "ADMIN" && user.status === "ACTIVE") {
		if ((await prisma.user.count({ where: { status: "ACTIVE", role: "ADMIN" } })) <= 1) return fail(400, "The last active admin cannot lose the admin role.");
	}

	await prisma.user.update({ where: { id }, data: { role } });
	refresh({ index: appConfig.routes.users });
	return { ok: true, value: { id, role } } as const;
}
