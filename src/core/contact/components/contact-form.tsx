"use client";

import { useActionState } from "react";
import type {
	ContactFormState,
	ContactValues,
} from "../actions/contactActions";

type Props = {
	action: (
		prev: ContactFormState,
		formData: FormData,
	) => Promise<ContactFormState>;
	submitLabel: string;
	defaults?: {
		email: string | null;
		phone: string | null;
		mobile: string | null;
		address: string | null;
		openingHours: string | null;
	};
};

const initial: ContactFormState = { ok: false, message: "" };
const input =
	"w-full rounded-md border border-line-strong bg-surface px-3 py-2 text-sm";
const label = "flex flex-col gap-1 text-sm font-medium";

export function ContactForm({ action, submitLabel, defaults }: Props) {
	const [state, formAction, pending] = useActionState(action, initial);
	// After a failed save, show what was submitted (React clears uncontrolled
	// fields after a form action, so the typed text would otherwise be lost).
	const value = (key: keyof ContactValues) =>
		state.values?.[key] ?? defaults?.[key] ?? "";

	return (
		<form action={formAction} className="flex flex-col gap-4">
			<label className={label}>
				Email
				<input
					className={input}
					name="email"
					type="email"
					defaultValue={value("email")}
					maxLength={254}
				/>
			</label>
			<label className={label}>
				Phone
				<input
					className={input}
					name="phone"
					type="tel"
					defaultValue={value("phone")}
					maxLength={30}
				/>
			</label>
			<label className={label}>
				Mobile
				<input
					className={input}
					name="mobile"
					type="tel"
					defaultValue={value("mobile")}
					maxLength={30}
				/>
			</label>
			<label className={label}>
				Address
				<textarea
					className={input}
					name="address"
					rows={3}
					defaultValue={value("address")}
					maxLength={300}
				/>
			</label>
			<label className={label}>
				Opening hours
				<textarea
					className={input}
					name="openingHours"
					rows={3}
					placeholder={"Mon–Fri 9:00–17:00\nSat 10:00–14:00"}
					defaultValue={value("openingHours")}
					maxLength={300}
				/>
			</label>
			<button
				type="submit"
				className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground disabled:opacity-50"
				disabled={pending}
			>
				{pending ? "Saving..." : submitLabel}
			</button>
			{state.message && (
				<p
					className={state.ok ? "text-sm text-success" : "text-sm text-danger"}
				>
					{state.message}
				</p>
			)}
		</form>
	);
}
