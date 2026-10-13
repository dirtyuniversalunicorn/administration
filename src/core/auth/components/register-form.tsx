"use client";

import { useActionState } from "react";
import {
	type CreateUserState,
	createUserAction,
} from "../actions/createUserAction";

const initial: CreateUserState = { ok: false, message: "" };
const input =
	"w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm";

export function RegisterForm() {
	const [state, action, pending] = useActionState(createUserAction, initial);

	return (
		<form action={action} className="flex flex-col gap-4">
			<input className={input} name="name" placeholder="Name" required />
			<input
				className={input}
				name="email"
				type="email"
				placeholder="Email"
				required
			/>
			<input
				className={input}
				name="password"
				type="password"
				placeholder="Password (min. 8 characters)"
				minLength={8}
				required
			/>
			<button
				type="button"
				className="rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white disabled:opacity-50"
				disabled={pending}
			>
				{pending ? "Creating..." : "Create user"}
			</button>
			{state.message && (
				<p
					className={
						state.ok ? "text-sm text-green-700" : "text-sm text-red-600"
					}
				>
					{state.message}
				</p>
			)}
		</form>
	);
}
