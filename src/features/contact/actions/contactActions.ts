"use server";

import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/src/lib/auth";
import { prisma } from "@/src/lib/prisma";
import { contactFeature } from "@/src/features/contact/config";

export type ContactValues = {
	email: string;
	phone: string;
	mobile: string;
	address: string;
	openingHours: string;
};

/** `values` echoes what was submitted, so a failed save doesn't wipe the form. */
export type ContactFormState = {
	ok: boolean;
	message: string;
	values?: ContactValues;
};

type ContactInput = {
	email: string | null;
	phone: string | null;
	mobile: string | null;
	address: string | null;
	openingHours: string | null;
};

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_RE = /^\+?[0-9 ()./-]{5,30}$/;

async function getSession() {
	return auth.api.getSession({ headers: await headers() });
}

function submittedValues(formData: FormData): ContactValues {
	const raw = (name: string) => String(formData.get(name) ?? "");
	return {
		email: raw("email"),
		phone: raw("phone"),
		mobile: raw("mobile"),
		address: raw("address"),
		openingHours: raw("openingHours"),
	};
}

/** Empty fields are stored as null. Returns the cleaned input, or an error message. */
function parseContact(formData: FormData): ContactInput | string {
	const field = (name: string) => {
		const value = String(formData.get(name) ?? "").trim();
		return value === "" ? null : value;
	};
	const input: ContactInput = {
		email: field("email")?.toLowerCase() ?? null,
		phone: field("phone"),
		mobile: field("mobile"),
		address: field("address"),
		openingHours: field("openingHours"),
	};

	if (Object.values(input).every((value) => value === null))
		return "Fill in at least one field.";
	if (input.email && (input.email.length > 254 || !EMAIL_RE.test(input.email)))
		return "Enter a valid email address.";
	for (const [label, value] of [
		["Phone", input.phone],
		["Mobile", input.mobile],
	] as const) {
		if (value && !PHONE_RE.test(value))
			return `${label} may contain only digits, spaces and + ( ) . / -`;
	}
	if (
		(input.address?.length ?? 0) > 300 ||
		(input.openingHours?.length ?? 0) > 300
	)
		return "Address and opening hours can be at most 300 characters.";
	return input;
}

/**
 * Saves the contact information: creates it the first time, edits it afterwards
 * (the same form is used for both). The poster is only set when it is created;
 * `editedBy` is the user who made the latest change.
 */
export async function saveContactAction(
	_prev: ContactFormState,
	formData: FormData,
): Promise<ContactFormState> {
	const values = submittedValues(formData);
	const session = await getSession();
	if (!session) return { ok: false, message: "Not authorized.", values };

	const input = parseContact(formData);
	if (typeof input === "string") return { ok: false, message: input, values };

	try {
		const existing = await prisma.contact.findFirst({
			orderBy: { createdAt: "asc" },
			select: { id: true },
		});
		if (existing) {
			await prisma.contact.update({
				where: { id: existing.id },
				data: { ...input, editedById: session.user.id },
			});
		} else {
			await prisma.contact.create({
				data: {
					...input,
					postedById: session.user.id,
					editedById: session.user.id,
				},
			});
		}
	} catch (error) {
		console.error("saveContactAction failed", error);
		return {
			ok: false,
			message: "Failed to save the contact information.",
			values,
		};
	}
	revalidatePath(contactFeature.routes.index);
	redirect(contactFeature.routes.index);
}
