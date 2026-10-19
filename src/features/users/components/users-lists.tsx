import { type Role, roleLabel } from "@/src/core/auth/roles";
import { ApiButton } from "@/src/core/ui/api-button";
import { RoleSelect } from "./role-select";

type UserRow = {
	id: string;
	name: string | null;
	email: string;
	role: Role;
	status: "ACTIVE" | "INACTIVE";
	createdAt: Date;
};

type Props = {
	users: UserRow[];
	session: { user: { id: string } } | null;
};

const th = "px-3 py-2 text-left font-medium text-muted";
const td = "px-3 py-2";

export default function UsersList({ users, session }: Props) {
	return (
		<>
			<h2 className="text-xl font-semibold">Users ({users.length})</h2>
			{users.length === 0 ? (
				<p className="text-sm text-muted">No users.</p>
			) : (
				<table className="w-full border-collapse rounded-md border border-line bg-surface text-sm">
					<thead className="border-b border-line bg-background">
						<tr>
							<th className={th}>Name</th>
							<th className={th}>Email</th>
							<th className={th}>Role</th>
							<th className={th}>Status</th>
							<th className={th}>Created</th>
							<th className={th}>
								<span className="sr-only">Actions</span>
							</th>
						</tr>
					</thead>
					<tbody className="divide-y divide-line">
						{users.map((user) => {
							const active = user.status === "ACTIVE";
							const isYou = user.id === session?.user.id;
							return (
								<tr key={user.id} className={active ? "" : "bg-background text-muted"}>
									<td className={`${td} font-medium`}>{user.name ?? "—"}</td>
									<td className={td}>{user.email}</td>
									<td className={td}>
										{isYou ? (
											roleLabel[user.role]
										) : (
											<div className="flex items-center gap-2">
												<RoleSelect id={user.id} role={user.role} />
											</div>
										)}
									</td>
									<td className={td}>
										<span className={`rounded-full px-2 py-0.5 text-xs font-medium ${active ? "bg-success-soft text-success" : "bg-line text-muted"}`}>{active ? "Active" : "Inactive"}</span>
									</td>
									<td className={td}>{user.createdAt.toLocaleDateString("en-GB")}</td>
									<td className={td}>
										<div className="flex items-center justify-end gap-4">
											{isYou ? (
												<span className="text-muted">You</span>
											) : (
												<ApiButton url="/api/user/status" body={{ id: user.id, status: active ? "INACTIVE" : "ACTIVE" }}>
													{active ? "Inactivate" : "Activate"}
												</ApiButton>
											)}
										</div>
									</td>
								</tr>
							);
						})}
					</tbody>
				</table>
			)}
		</>
	);
}
