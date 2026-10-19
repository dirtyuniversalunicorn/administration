import { RegisterForm } from "@/src/core/auth/components/register-form";
import { currentUser } from "@/src/core/auth/session";
import { NoAccess } from "@/src/core/ui/no-access";
import UserTable from "@/src/features/users/components/users-table";
import { prisma } from "@/src/lib/prisma";

export default async function Users() {
	const { user, hasPermission } = await currentUser();
	if (!hasPermission("users")) return <NoAccess />;

	const users = await prisma.user.findMany({
		select: { id: true, name: true, email: true, status: true, role: true, createdAt: true },
		orderBy: { createdAt: "desc" },
	});

	return (
		<section className="mx-auto flex w-full max-w-4xl flex-col gap-6">
			<h1 className="text-2xl font-semibold">Register user</h1>
			<RegisterForm />
			<UserTable session={{ user }} users={users} />
		</section>
	);
}
