"use client";

import { useState } from "react";
import { postJson } from "@/src/core/ui/post-json";
import { blogsFeature } from "../config";
import { blogKeys } from "../validation";

type Props = {
	/** "add" creates a blog, "edit" changes the blog with `id`. */
	mode: "add" | "edit";
	id?: string;
	defaults?: {
		title: string;
		excerpt: string | null;
		content: string;
		imageUrl: string | null;
	};
};

const input = "w-full rounded-md border border-line-strong bg-surface px-3 py-2 text-sm";
const label = "flex flex-col gap-1 text-sm font-medium";
const hint = "text-xs font-normal text-muted";

/**
 * Talks to the same /api/blog/* endpoints that any other client would use. The
 * fields are uncontrolled and the form is not a server action, so a failed save
 * leaves everything you typed in place.
 */
export function BlogForm({ mode, id, defaults }: Props) {
	const [error, setError] = useState("");
	const [pending, setPending] = useState(false);

	async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
		e.preventDefault();
		const data = new FormData(e.currentTarget);
		// Blank optional fields are sent as "" so that, when editing, they clear the value.
		const fields = Object.fromEntries(blogKeys.map((key) => [key, String(data.get(key) ?? "")]));

		setPending(true);
		setError("");
		const result = await postJson(mode === "add" ? blogsFeature.routes.api.add : blogsFeature.routes.api.edit, mode === "add" ? fields : { id, ...fields });
		if (!result.ok) {
			setError(result.error);
			setPending(false);
			return;
		}
		// A full navigation, so the next page is rendered with the new data.
		window.location.href = mode === "edit" && id ? blogsFeature.routes.detail(id) : blogsFeature.routes.index;
	}

	return (
		<form onSubmit={onSubmit} className="flex flex-col gap-4">
			<label className={label}>
				Title
				<input className={input} name="title" defaultValue={defaults?.title ?? ""} maxLength={150} required />
			</label>
			<label className={label}>
				<span>
					Summary <span className={hint}>(optional, shown in lists)</span>
				</span>
				<textarea className={input} name="excerpt" rows={2} defaultValue={defaults?.excerpt ?? ""} maxLength={300} />
			</label>
			<label className={label}>
				Content
				<textarea className={input} name="content" rows={14} defaultValue={defaults?.content ?? ""} maxLength={20000} required />
			</label>
			<label className={label}>
				<span>
					Cover image link <span className={hint}>(optional)</span>
				</span>
				<input className={input} name="imageUrl" type="url" placeholder="https://..." defaultValue={defaults?.imageUrl ?? ""} />
			</label>
			<button type="submit" className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground disabled:opacity-50" disabled={pending}>
				{pending ? "Saving..." : mode === "add" ? "Create blog" : "Save changes"}
			</button>
			{error && <p className="text-sm text-danger">{error}</p>}
		</form>
	);
}
