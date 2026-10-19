"use client";

import { useState } from "react";
import { type Role, roleLabel, roles } from "@/src/core/auth/roles";
import { postJson } from "@/src/core/ui/post-json";

/** Role dropdown for one user. Saves on change through /api/user/role and shows the API's message if it refuses. */
export function RoleSelect({ id, role }: { id: string; role: Role }) {
	const [value, setValue] = useState(role);
	const [error, setError] = useState("");
	const [pending, setPending] = useState(false);

	async function change(next: Role) {
		setPending(true);
		setError("");
		const result = await postJson("/api/user/role", { id, role: next });
		setPending(false);
		if (result.ok) setValue(next);
		else setError(result.error);
	}

	return (
		<>
			<select
				aria-label="Role"
				className="rounded-md border border-line-strong bg-surface px-2 py-1 text-sm disabled:opacity-50"
				value={value}
				disabled={pending}
				onChange={(e) => change(e.target.value as Role)}
			>
				{roles.map((r) => (
					<option key={r} value={r}>
						{roleLabel[r]}
					</option>
				))}
			</select>
			{error && (
				<span role="alert" className="text-xs text-danger">
					{error}
				</span>
			)}
		</>
	);
}
