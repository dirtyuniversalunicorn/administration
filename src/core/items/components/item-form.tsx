"use client";

import { Alert, Button, Stack } from "@chakra-ui/react";
import { useActionState } from "react";
import { TextField } from "@/core/ui/text-field";
import type { ItemFormState } from "../actions/itemActions";

type Props = {
	action: (prev: ItemFormState, formData: FormData) => Promise<ItemFormState>;
	submitLabel: string;
	defaults?: { category: string; technique: string; imageUrl: string };
};

const initial: ItemFormState = { ok: false, message: "" };

export function ItemForm({ action, submitLabel, defaults }: Props) {
	const [state, formAction, pending] = useActionState(action, initial);

	return (
		<form action={formAction}>
			<Stack gap="4">
				<TextField
					label="Category"
					name="category"
					defaultValue={defaults?.category}
					maxLength={100}
					required
				/>
				<TextField
					label="Technique"
					name="technique"
					defaultValue={defaults?.technique}
					maxLength={100}
					required
				/>
				<TextField
					label="Image link"
					name="imageUrl"
					type="url"
					placeholder="https://..."
					defaultValue={defaults?.imageUrl}
					required
				/>
				<Button
					type="submit"
					colorPalette="brand"
					loading={pending}
					loadingText="Saving..."
				>
					{submitLabel}
				</Button>
				{state.message && (
					<Alert.Root status={state.ok ? "success" : "error"}>
						<Alert.Indicator />
						<Alert.Title>{state.message}</Alert.Title>
					</Alert.Root>
				)}
			</Stack>
		</form>
	);
}
