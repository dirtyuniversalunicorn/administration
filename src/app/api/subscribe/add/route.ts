// Anonymous visitors sign up here; the subscription stays PENDING until they

import {
	isSubscriptionEnabled,
	readEmail,
	requestSubscription,
	subscriptionDisabledResponse,
} from "@/core/subscribe/subscribe";

// click the link in the confirmation email (see ../confirm).
export async function POST(request: Request) {
	if (!isSubscriptionEnabled()) return subscriptionDisabledResponse();

	const email = await readEmail(request);
	if (!email)
		return Response.json(
			{ error: "A valid email is required." },
			{ status: 400 },
		);

	try {
		await requestSubscription(email);
	} catch (error) {
		console.error("subscribe/add failed", error);
		return Response.json(
			{ error: "Could not send the confirmation email." },
			{ status: 502 },
		);
	}
	// Same answer whether or not the email was already known.
	return Response.json({
		status: "PENDING",
		message: "Check your inbox to confirm.",
	});
}
