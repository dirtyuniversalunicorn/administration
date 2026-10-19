import { headers } from "next/headers";
import { auth } from "@/src/lib/auth";
import { prisma } from "@/src/lib/prisma";
import { RegisterForm } from "../../../core/auth/components/register-form";
import UsersList from "@/src/features/users/components/users-lists";

export default async function Users() {
	const session = await auth.api.getSession({ headers: await headers() });
	const users = await prisma.user.findMany({
		select: { id: true, name: true, email: true, status: true, createdAt: true },
		orderBy: { createdAt: "desc" },
	});

	return (
		<section className="mx-auto flex w-full max-w-xl flex-col gap-6">
			<h1 className="text-2xl font-semibold">Register user</h1>
			<RegisterForm />
			<UsersList session={session} users={users} />
		</section>
	);
}
