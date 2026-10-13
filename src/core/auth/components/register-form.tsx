"use client";

import { Alert, Button, Stack } from "@chakra-ui/react";
import { useActionState } from "react";
import { TextField } from "@/core/ui/text-field";
import {
	type CreateUserState,
	createUserAction,
} from "../actions/createUserAction";

const initial: CreateUserState = { ok: false, message: "" };

export function RegisterForm() {
	const [state, action, pending] = useActionState(createUserAction, initial);

	return (
		<form action={action}>
			<Stack gap="4">
				<TextField label="Name" name="name" required />
				<TextField label="Email" name="email" type="email" required />
				<TextField
					label="Password"
					name="password"
					type="password"
					placeholder="At least 8 characters"
					minLength={8}
					required
				/>
				<Button
					type="submit"
					colorPalette="brand"
					loading={pending}
					loadingText="Creating..."
				>
					Create user
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
