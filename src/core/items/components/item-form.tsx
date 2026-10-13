"use client";

import { useActionState } from "react";
import type { ItemFormState } from "../actions/itemActions";

type Props = {
	action: (prev: ItemFormState, formData: FormData) => Promise<ItemFormState>;
	submitLabel: string;
	defaults?: { category: string; technique: string; imageUrl: string };
};

const initial: ItemFormState = { ok: false, message: "" };
const input =
	"w-full rounded-md border border-line-strong bg-surface px-3 py-2 text-sm";

export function ItemForm({ action, submitLabel, defaults }: Props) {
	const [state, formAction, pending] = useActionState(action, initial);

	return (
		<form action={formAction} className="flex flex-col gap-4">
			<input
				className={input}
				name="category"
				placeholder="Category"
				defaultValue={defaults?.category}
				maxLength={100}
				required
			/>
			<input
				className={input}
				name="technique"
				placeholder="Technique"
				defaultValue={defaults?.technique}
				maxLength={100}
				required
			/>
			<input
				className={input}
				name="imageUrl"
				type="url"
				placeholder="Image link (https://...)"
				defaultValue={defaults?.imageUrl}
				required
			/>
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
