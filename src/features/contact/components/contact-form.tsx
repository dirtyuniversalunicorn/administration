"use client";

import { useState } from "react";
import { contactFeature } from "../config";
import { type ContactFields, contactKeys } from "../validation";

type Props = {
	/** "add" creates the contact information, "edit" changes it. */
	mode: "add" | "edit";
	defaults?: ContactFields;
};

const input = "w-full rounded-md border border-line-strong bg-surface px-3 py-2 text-sm";
const label = "flex flex-col gap-1 text-sm font-medium";

/**
 * Talks to the same /api/contact/* endpoints that any other client would use.
 * The fields are uncontrolled and the form is not a server action, so a failed
 * save leaves everything you typed in place.
 */
export function ContactForm({ mode, defaults }: Props) {
	const [error, setError] = useState("");
	const [pending, setPending] = useState(false);

	async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
		e.preventDefault();
		const data = new FormData(e.currentTarget);
		// Blank fields are sent as "" so that, when editing, they clear the value.
		const body = Object.fromEntries(contactKeys.map((key) => [key, String(data.get(key) ?? "")]));

		setPending(true);
		setError("");
		try {
			const response = await fetch(
				mode === "add" ? contactFeature.routes.api.add : contactFeature.routes.api.edit,
				{
					method: "POST",
					headers: { "content-type": "application/json" },
					body: JSON.stringify(body),
				},
			);
			if (!response.ok) {
				const payload = (await response.json().catch(() => null)) as {
					error?: string;
				} | null;
				setError(payload?.error ?? "Failed to save the contact information.");
				setPending(false);
				return;
			}
		} catch {
			setError("Could not reach the server. Try again.");
			setPending(false);
			return;
		}
		// A full navigation, so the contact page is rendered with the new data.
		window.location.href = contactFeature.routes.index;
	}

	return (
		<form onSubmit={onSubmit} className="flex flex-col gap-4">
			<label className={label}>
				Email
				<input
					className={input}
					name="email"
					type="email"
					defaultValue={defaults?.email ?? ""}
					maxLength={254}
				/>
			</label>
			<label className={label}>
				Phone
				<input
					className={input}
					name="phone"
					type="tel"
					defaultValue={defaults?.phone ?? ""}
					maxLength={30}
				/>
			</label>
			<label className={label}>
				Mobile
				<input
					className={input}
					name="mobile"
					type="tel"
					defaultValue={defaults?.mobile ?? ""}
					maxLength={30}
				/>
			</label>
			<label className={label}>
				Address
				<textarea
					className={input}
					name="address"
					rows={3}
					defaultValue={defaults?.address ?? ""}
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
					defaultValue={defaults?.openingHours ?? ""}
					maxLength={300}
				/>
			</label>
			<button
				type="submit"
				className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground disabled:opacity-50"
				disabled={pending}
			>
				{pending ? "Saving..." : mode === "add" ? "Add contact information" : "Save changes"}
			</button>
			{error && <p className="text-sm text-danger">{error}</p>}
		</form>
	);
}
