import { appConfig } from "../config/appConfig";

type Message = { to: string; subject: string; html: string; text: string };

/**
 * Sends an email through Resend's HTTP API (works on Workers, no SMTP needed).
 * Requires the RESEND_API_KEY secret. Without it (local dev) the message is
 * logged instead so the confirmation link can be copied from the console.
 * Swapping providers only means changing this one function.
 */
export async function sendEmail(message: Message): Promise<void> {
	const apiKey = process.env.RESEND_API_KEY;
	if (!apiKey) {
		console.warn(
			`[email] RESEND_API_KEY not set, not sending. To: ${message.to}\n${message.text}`,
		);
		return;
	}

	const response = await fetch("https://api.resend.com/emails", {
		method: "POST",
		headers: {
			Authorization: `Bearer ${apiKey}`,
			"Content-Type": "application/json",
		},
		body: JSON.stringify({
			from: appConfig.email.from,
			to: message.to,
			subject: message.subject,
			html: message.html,
			text: message.text,
		}),
	});
	if (!response.ok) {
		throw new Error(
			`Email provider responded ${response.status}: ${await response.text()}`,
		);
	}
}
