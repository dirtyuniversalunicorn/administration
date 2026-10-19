"use client";

import { type ReactNode, useState } from "react";
import { ConfirmModal } from "./confirm-modal";
import { postJson } from "./post-json";

/**
 * "Delete" button that asks for confirmation in a modal, then POSTs `body` to
 * an API route (for example `{ id }` to /api/blog/delete). On success it goes
 * to `redirectTo`, or reloads the page. If the API refuses, its message is
 * shown inside the modal and nothing is lost.
 */
export function DeleteButton({
	url,
	body,
	title,
	children,
	redirectTo,
	className = "text-danger hover:underline",
}: {
	url: string;
	body: unknown;
	title: string;
	/** The question shown in the modal. */
	children: ReactNode;
	redirectTo?: string;
	className?: string;
}) {
	const [open, setOpen] = useState(false);
	const [pending, setPending] = useState(false);
	const [error, setError] = useState("");

	async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
		e.preventDefault();
		setPending(true);
		setError("");
		const result = await postJson(url, body);
		if (!result.ok) {
			setError(result.error);
			setPending(false);
			return;
		}
		if (redirectTo) window.location.href = redirectTo;
		else window.location.reload();
	}

	return (
		<form onSubmit={onSubmit}>
			<button
				type="button"
				className={className}
				onClick={() => {
					setError("");
					setOpen(true);
				}}
			>
				Delete
			</button>
			<ConfirmModal open={open} title={title} confirmLabel="Delete" pendingLabel="Deleting..." pending={pending} destructive confirmType="submit" onCancel={() => setOpen(false)}>
				{children}
				{error && <p className="mt-3 text-danger">{error}</p>}
			</ConfirmModal>
		</form>
	);
}
