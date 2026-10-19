import { ApiButton } from "@/src/core/ui/api-button";

type UserRow = {
	id: string;
	name: string | null;
	email: string;
	status: "ACTIVE" | "INACTIVE";
	createdAt: Date;
};

type Props = {
	users: UserRow[];
	session: { user: { id: string } } | null;
};

export default function UsersList({ users, session }: Props) {
	return (
		<>
			<h2 className="text-xl font-semibold">Users ({users.length})</h2>
			{users.length === 0 ? (
				<p className="text-sm text-muted">No users.</p>
			) : (
				<ul className="flex flex-col divide-y divide-line rounded-md border border-line bg-surface">
					{users.map((user) => (
						<li key={user.id} className="flex items-center justify-between gap-4 px-4 py-3 text-sm">
							<div className="flex flex-col">
								<span className="font-medium">{user.name ?? "—"}</span>
								<span className="text-muted">{user.email}</span>
							</div>
							<div className="flex items-center gap-4">
								<span className={`rounded-full px-2 py-0.5 text-xs font-medium ${user.status === "ACTIVE" ? "bg-success-soft text-success" : "bg-line text-muted"}`}>
									{user.status === "ACTIVE" ? "Active" : "Inactive"}
								</span>
								<span className="text-muted">{user.createdAt.toLocaleDateString("en-GB")}</span>
								{user.id === session?.user.id ? (
									<span className="text-muted">You</span>
								) : (
									<ApiButton url="/api/user/status" body={{ id: user.id, status: user.status === "ACTIVE" ? "INACTIVE" : "ACTIVE" }}>
										{user.status === "ACTIVE" ? "Inactivate" : "Activate"}
									</ApiButton>
								)}
							</div>
						</li>
					))}
				</ul>
			)}
		</>
	);
}
