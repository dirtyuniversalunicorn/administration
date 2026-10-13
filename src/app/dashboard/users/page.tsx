import { RegisterForm } from "@/core/auth/components/register-form";
import { UsersList } from "@/core/auth/components/users-list";
import { PageStack, PageTitle } from "@/core/ui/page-parts";
import { prisma } from "@/lib/prisma";

export default async function Users() {
	const users = await prisma.user.findMany({
		select: { id: true, name: true, email: true, createdAt: true },
		orderBy: { createdAt: "desc" },
	});

	return (
		<PageStack maxW="xl">
			<PageTitle>Register user</PageTitle>
			<RegisterForm />
			<UsersList
				users={users.map((user) => ({
					id: user.id,
					name: user.name,
					email: user.email,
					created: user.createdAt.toLocaleDateString("en-GB"),
				}))}
			/>
		</PageStack>
	);
}
