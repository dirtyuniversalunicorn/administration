"use server";

import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { appConfig } from "@/core/config/appConfig";
import { auth } from "@/lib/auth";
import { createUser } from "@/lib/create-user";

export type CreateUserState = { ok: boolean; message: string };

export async function createUserAction(
	_prev: CreateUserState,
	formData: FormData,
): Promise<CreateUserState> {
	const session = await auth.api.getSession({ headers: await headers() });
	if (!session) return { ok: false, message: "Not authorized." };

	const name = String(formData.get("name") ?? "");
	const email = String(formData.get("email") ?? "");
	const password = String(formData.get("password") ?? "");
	if (!name.trim() || !email.trim() || !password) {
		return { ok: false, message: "All fields are required." };
	}

	try {
		await createUser({ name, email, password });
		revalidatePath(appConfig.routes.users);
		return { ok: true, message: `User ${email} created.` };
	} catch (e) {
		return {
			ok: false,
			message: e instanceof Error ? e.message : "Failed to create user.",
		};
	}
}
