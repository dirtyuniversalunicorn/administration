"use client";

import { useActionState } from "react";
import type { BlogFormState, BlogValues } from "../actions/blogActions";

type Props = {
	action: (prev: BlogFormState, formData: FormData) => Promise<BlogFormState>;
	submitLabel: string;
	defaults?: {
		title: string;
		excerpt: string | null;
		content: string;
		imageUrl: string | null;
	};
};

const initial: BlogFormState = { ok: false, message: "" };
const input =
	"w-full rounded-md border border-line-strong bg-surface px-3 py-2 text-sm";
const label = "flex flex-col gap-1 text-sm font-medium";
const hint = "text-xs font-normal text-muted";

export function BlogForm({ action, submitLabel, defaults }: Props) {
	const [state, formAction, pending] = useActionState(action, initial);
	// After a failed save, show what was submitted (React clears uncontrolled
	// fields after a form action, so the typed text would otherwise be lost).
	const value = (key: keyof BlogValues) =>
		state.values?.[key] ?? defaults?.[key] ?? "";

	return (
		<form action={formAction} className="flex flex-col gap-4">
			<label className={label}>
				Title
				<input
					className={input}
					name="title"
					defaultValue={value("title")}
					maxLength={150}
					required
				/>
			</label>
			<label className={label}>
				<span>
					Summary <span className={hint}>(optional, shown in lists)</span>
				</span>
				<textarea
					className={input}
					name="excerpt"
					rows={2}
					defaultValue={value("excerpt")}
					maxLength={300}
				/>
			</label>
			<label className={label}>
				Content
				<textarea
					className={input}
					name="content"
					rows={14}
					defaultValue={value("content")}
					maxLength={20000}
					required
				/>
			</label>
			<label className={label}>
				<span>
					Cover image link <span className={hint}>(optional)</span>
				</span>
				<input
					className={input}
					name="imageUrl"
					type="url"
					placeholder="https://..."
					defaultValue={value("imageUrl")}
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
