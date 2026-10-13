"use client";

import { Button } from "@chakra-ui/react";
import { useState, useTransition } from "react";
import { ConfirmModal } from "@/core/ui/confirm-modal";
import { deleteItemAction } from "../actions/itemActions";

export function DeleteItemButton({ id, label }: { id: string; label: string }) {
	const [open, setOpen] = useState(false);
	const [pending, startTransition] = useTransition();

	return (
		<>
			<Button
				size="xs"
				variant="plain"
				colorPalette="red"
				onClick={() => setOpen(true)}
			>
				Delete
			</Button>
			<ConfirmModal
				open={open}
				title="Delete item"
				confirmLabel="Delete"
				pendingLabel="Deleting..."
				pending={pending}
				destructive
				onConfirm={() =>
					startTransition(async () => {
						await deleteItemAction(id); // redirects back to the list when done
					})
				}
				onCancel={() => setOpen(false)}
			>
				Delete <strong>{label}</strong> permanently? This cannot be undone.
			</ConfirmModal>
		</>
	);
}
