import { prisma } from "@/src/lib/prisma";
import { RegisterForm } from "../../../core/auth/components/register-form";

export default async function Users() {
	const users = await prisma.user.findMany({
		select: { id: true, name: true, email: true, createdAt: true },
		orderBy: { createdAt: "desc" },
	});

	return (
		<section className="mx-auto flex w-full max-w-xl flex-col gap-6">
			<h1 className="text-2xl font-semibold">Register user</h1>
			<RegisterForm />

			<h2 className="text-xl font-semibold">Users ({users.length})</h2>
			{users.length === 0 ? (
				<p className="text-sm text-muted">No users yet.</p>
			) : (
				<ul className="flex flex-col divide-y divide-line rounded-md border border-line bg-surface">
					{users.map((user) => (
						<li key={user.id} className="flex items-center justify-between gap-4 px-4 py-3 text-sm">
							<div className="flex flex-col">
								<span className="font-medium">{user.name ?? "—"}</span>
								<span className="text-muted">{user.email}</span>
							</div>
							<span className="text-muted">{user.createdAt.toLocaleDateString("en-GB")}</span>
						</li>
					))}
				</ul>
			)}
		</section>
	);
}
