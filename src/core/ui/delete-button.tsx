"use client";

import { type ReactNode, useActionState, useState } from "react";
import { ConfirmModal } from "./confirm-modal";

/**
 * "Delete" button that asks for confirmation in a modal first. Pass a bound
 * server action, e.g. `action={deleteBlogAction.bind(null, blog.id)}`; it is
 * expected to redirect when it is done.
 */
export function DeleteButton({
	action,
	title,
	children,
	className = "text-danger hover:underline",
}: {
	action: () => Promise<void>;
	title: string;
	/** The question shown in the modal. */
	children: ReactNode;
	className?: string;
}) {
	const [open, setOpen] = useState(false);
	const [, formAction, pending] = useActionState(async (_prev: null) => {
		await action();
		return null;
	}, null);

	return (
		<form action={formAction}>
			<button type="button" className={className} onClick={() => setOpen(true)}>
				Delete
			</button>
			<ConfirmModal
				open={open}
				title={title}
				confirmLabel="Delete"
				pendingLabel="Deleting..."
				pending={pending}
				destructive
				confirmType="submit"
				onCancel={() => setOpen(false)}
			>
				{children}
			</ConfirmModal>
		</form>
	);
}
