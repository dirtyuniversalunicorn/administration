import { z } from "zod";
import { optionalText } from "@/src/core/validation";

/*
 * Zod schemas for the contact information. No server-only imports, so the
 * dashboard form can share them (and the field list) with the API.
 */

/** An optional leading +, then 7 to 15 digits, which may be separated by spaces and ( ) . / -. */
const PHONE = /^(?=(?:\D*\d){7,15}\D*$)\+?[0-9 ()./-]+$/;
const phoneMessage = (label: string) => `${label} must be a valid phone number with 7 to 15 digits, for example +420 123 456 789.`;

/** Every field is optional (null when empty). */
const fields = {
	email: optionalText("Email", 254, { lowercase: true, pattern: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "Enter a valid email address."] }),
	phone: optionalText("Phone", 30, { pattern: [PHONE, phoneMessage("Phone")] }),
	mobile: optionalText("Mobile", 30, { pattern: [PHONE, phoneMessage("Mobile")] }),
	address: optionalText("Address", 300),
	openingHours: optionalText("Opening hours", 300),
};

export const contactKeys = Object.keys(fields) as (keyof typeof fields)[];

/** What is stored: every field is a string or null. */
export type ContactFields = Record<(typeof contactKeys)[number], string | null>;

/** True when every field is empty. */
export const isEmptyContact = (value: Partial<Record<(typeof contactKeys)[number], string | null>>) => contactKeys.every((key) => !value[key]);

/** Body of /api/contact/add: at least one field must be filled in. */
export const addContactSchema = z.strictObject(fields).refine((value) => !isEmptyContact(value), "Fill in at least one field.");

/** Body of /api/contact/edit: only the fields to change; null or "" clears one. */
export const editContactSchema = z.strictObject(fields).partial();
