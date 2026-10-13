"use client";

import { Field, Input, type InputProps } from "@chakra-ui/react";

/** Labelled text input used by every form. All native input props pass through. */
export function TextField({ label, ...input }: { label: string } & InputProps) {
	return (
		<Field.Root required={input.required}>
			<Field.Label>
				{label}
				<Field.RequiredIndicator />
			</Field.Label>
			<Input {...input} />
		</Field.Root>
	);
}
