"use client";

import { useActionState } from "react";
import { type CreateUserState, createUserAction } from "../actions/createUserAction";
import { roleLabel, roles } from "../roles";

const initial: CreateUserState = { ok: false, message: "" };
const input = "w-full rounded-md border border-line-strong bg-surface px-3 py-2 text-sm";

export function RegisterForm() {
	const [state, action, pending] = useActionState(createUserAction, initial);

	return (
		<form action={action} className="flex flex-col gap-4">
			<input className={input} name="name" placeholder="Name" required />
			<input className={input} name="email" type="email" placeholder="Email" required />
			<input className={input} name="password" type="password" placeholder="Password (min. 8 characters)" minLength={8} required />
			<select className={input} name="role" defaultValue="USER" aria-label="Role">
				{roles.map((role) => (
					<option key={role} value={role}>
						{roleLabel[role]}
					</option>
				))}
			</select>
			<button type="submit" className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground disabled:opacity-50" disabled={pending}>
				{pending ? "Creating..." : "Create user"}
			</button>
			{state.message && <p className={state.ok ? "text-sm text-success" : "text-sm text-danger"}>{state.message}</p>}
		</form>
	);
}
