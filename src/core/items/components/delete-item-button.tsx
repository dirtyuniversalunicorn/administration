"use client";

import { useActionState, useState } from "react";
import { ConfirmModal } from "@/src/core/ui/confirm-modal";
import { deleteItemAction } from "../actions/itemActions";

export function DeleteItemButton({ id, label }: { id: string; label: string }) {
	const [open, setOpen] = useState(false);
	const [, action, pending] = useActionState(async (_prev: null) => {
		await deleteItemAction(id); // redirects back to the list when done
		return null;
	}, null);

	return (
		<form action={action}>
			<button
				type="button"
				className="text-danger hover:underline"
				onClick={() => setOpen(true)}
			>
				Delete
			</button>
			<ConfirmModal
				open={open}
				title="Delete item"
				confirmLabel="Delete"
				pendingLabel="Deleting..."
				pending={pending}
				destructive
				confirmType="submit"
				onCancel={() => setOpen(false)}
			>
				Delete <strong>{label}</strong> permanently? This cannot be undone.
			</ConfirmModal>
		</form>
	);
}
