"use client";

import { deleteItemAction } from "../actions/itemActions";

export function DeleteItemButton({ id, label }: { id: string; label: string }) {
	return (
		<form
			action={deleteItemAction.bind(null, id)}
			onSubmit={(e) => {
				if (!window.confirm(`Delete "${label}" permanently?`))
					e.preventDefault();
			}}
		>
			<button type="submit" className="text-red-600 hover:underline">
				Delete
			</button>
		</form>
	);
}
