"use client";

import { Button, Dialog, Portal } from "@chakra-ui/react";
import type { ReactNode } from "react";

type Props = {
	open: boolean;
	title: string;
	children?: ReactNode;
	confirmLabel?: string;
	cancelLabel?: string;
	/** Disables the buttons and shows `pendingLabel` while the action runs. */
	pending?: boolean;
	pendingLabel?: string;
	/** Red confirm button for irreversible actions. */
	destructive?: boolean;
	onConfirm: () => void;
	onCancel: () => void;
};

/**
 * Reusable confirmation modal (Chakra Dialog). Esc, the dim backdrop and the
 * Cancel button all call onCancel; while `pending` they are disabled.
 */
export function ConfirmModal({
	open,
	title,
	children,
	confirmLabel = "Confirm",
	cancelLabel = "Cancel",
	pending = false,
	pendingLabel,
	destructive = false,
	onConfirm,
	onCancel,
}: Props) {
	return (
		<Dialog.Root
			role="alertdialog"
			placement="center"
			open={open}
			closeOnEscape={!pending}
			closeOnInteractOutside={!pending}
			onOpenChange={(e) => {
				if (!e.open && !pending) onCancel();
			}}
		>
			<Portal>
				<Dialog.Backdrop />
				<Dialog.Positioner>
					<Dialog.Content>
						<Dialog.Header>
							<Dialog.Title>{title}</Dialog.Title>
						</Dialog.Header>
						{children && <Dialog.Body color="fg.muted">{children}</Dialog.Body>}
						<Dialog.Footer>
							<Button variant="outline" onClick={onCancel} disabled={pending}>
								{cancelLabel}
							</Button>
							<Button
								colorPalette={destructive ? "red" : "brand"}
								onClick={onConfirm}
								loading={pending}
								loadingText={pendingLabel}
							>
								{confirmLabel}
							</Button>
						</Dialog.Footer>
					</Dialog.Content>
				</Dialog.Positioner>
			</Portal>
		</Dialog.Root>
	);
}
