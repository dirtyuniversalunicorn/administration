"use server";

import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { hasPermission, roles } from "@/src/core/auth/roles";
import { appConfig } from "@/src/core/config/appConfig";
import { createUser } from "@/src/features/users/services/createUser";
import { auth } from "@/src/lib/auth";

export type CreateUserState = { ok: boolean; message: string };

export async function createUserAction(_prev: CreateUserState, formData: FormData): Promise<CreateUserState> {
	const session = await auth.api.getSession({ headers: await headers() });
	if (!session || !hasPermission(session.user.role, "users")) return { ok: false, message: "Not authorized." };

	const name = String(formData.get("name") ?? "");
	const email = String(formData.get("email") ?? "");
	const password = String(formData.get("password") ?? "");
	const role = roles.find((r) => r === formData.get("role"));
	if (!role) return { ok: false, message: "Choose a role." };
	if (!name.trim() || !email.trim() || !password) {
		return { ok: false, message: "All fields are required." };
	}

	try {
		await createUser({ name, email, password, role });
		revalidatePath(appConfig.routes.users);
		return { ok: true, message: `User ${email} created.` };
	} catch (e) {
		return {
			ok: false,
			message: e instanceof Error ? e.message : "Failed to create user.",
		};
	}
}
