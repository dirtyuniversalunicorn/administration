"use client";

import { type ReactNode, useEffect, useRef } from "react";

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
	/**
	 * "submit" confirms by submitting the surrounding <form> (use this when the
	 * modal is rendered inside a form with a server action); "button" calls onConfirm.
	 */
	confirmType?: "button" | "submit";
	onConfirm?: () => void;
	onCancel: () => void;
};

/**
 * Reusable confirmation modal built on the native <dialog> element: focus is
 * trapped, Esc and a click on the backdrop cancel, and it sits above the page.
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
	confirmType = "button",
	onConfirm,
	onCancel,
}: Props) {
	const ref = useRef<HTMLDialogElement>(null);

	useEffect(() => {
		const dialog = ref.current;
		if (!dialog) return;
		if (open && !dialog.open) dialog.showModal();
		if (!open && dialog.open) dialog.close();
	}, [open]);

	return (
		<dialog
			ref={ref}
			onCancel={(e) => {
				// Esc key: let React state close it instead of the browser.
				e.preventDefault();
				if (!pending) onCancel();
			}}
			onClick={(e) => {
				// A click on the backdrop targets the <dialog> itself.
				if (e.target === ref.current && !pending) onCancel();
			}}
			onKeyDown={(e) => {
				if (e.key === "Escape" && !pending) onCancel();
			}}
			className="m-auto w-full max-w-md rounded-lg bg-white p-0 text-slate-950 shadow-xl backdrop:bg-slate-900/50"
		>
			<div className="flex flex-col gap-3 p-6">
				<h2 className="text-lg font-semibold">{title}</h2>
				{children && <div className="text-sm text-slate-600">{children}</div>}
			</div>
			<div className="flex justify-end gap-3 border-t border-slate-200 bg-slate-50 px-6 py-3">
				<button
					type="button"
					className="rounded-md border border-slate-300 bg-white px-4 py-2 text-sm font-medium hover:bg-slate-100 disabled:opacity-50"
					disabled={pending}
					onClick={onCancel}
				>
					{cancelLabel}
				</button>
				<button
					type={confirmType}
					className={`rounded-md px-4 py-2 text-sm font-medium text-white disabled:opacity-50 ${
						destructive
							? "bg-red-600 hover:bg-red-700"
							: "bg-slate-900 hover:bg-slate-700"
					}`}
					disabled={pending}
					onClick={confirmType === "button" ? onConfirm : undefined}
				>
					{pending && pendingLabel ? pendingLabel : confirmLabel}
				</button>
			</div>
		</dialog>
	);
}
