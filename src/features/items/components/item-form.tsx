"use client";

import { useState } from "react";
import { postJson } from "@/src/core/ui/post-json";
import { itemsFeature } from "../config";
import { type ItemFields, itemKeys } from "../validation";

type Props = {
	/** "add" creates an item, "edit" changes the item with `id`. */
	mode: "add" | "edit";
	id?: string;
	defaults?: ItemFields;
};

const input = "w-full rounded-md border border-line-strong bg-surface px-3 py-2 text-sm";

/**
 * Talks to the same /api/item/* endpoints that any other client would use. The
 * fields are uncontrolled and the form is not a server action, so a failed save
 * leaves everything you typed in place.
 */
export function ItemForm({ mode, id, defaults }: Props) {
	const [error, setError] = useState("");
	const [pending, setPending] = useState(false);

	async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
		e.preventDefault();
		const data = new FormData(e.currentTarget);
		const fields = Object.fromEntries(itemKeys.map((key) => [key, String(data.get(key) ?? "")]));

		setPending(true);
		setError("");
		const result = await postJson(mode === "add" ? itemsFeature.routes.api.add : itemsFeature.routes.api.edit, mode === "add" ? fields : { id, ...fields });
		if (!result.ok) {
			setError(result.error);
			setPending(false);
			return;
		}
		// A full navigation, so the list is rendered with the new data.
		window.location.href = itemsFeature.routes.index;
	}

	return (
		<form onSubmit={onSubmit} className="flex flex-col gap-4">
			<input className={input} name="category" placeholder="Category" defaultValue={defaults?.category} maxLength={100} required />
			<input className={input} name="technique" placeholder="Technique" defaultValue={defaults?.technique} maxLength={100} required />
			<input className={input} name="imageUrl" type="url" placeholder="Image link (https://...)" defaultValue={defaults?.imageUrl} required />
			<button type="submit" className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground disabled:opacity-50" disabled={pending}>
				{pending ? "Saving..." : mode === "add" ? "Create item" : "Save changes"}
			</button>
			{error && <p className="text-sm text-danger">{error}</p>}
		</form>
	);
}
