import { defineFeature } from "@/src/core/config/define-feature";

const base = "/dashboard/subscriptions";

export const subscribeFeature = defineFeature({
	id: "subscribe",
	pagePrefix: base,
	apiPrefix: "/api/subscribe",
	nav: { label: "Subscriptions", href: base, icon: "subscriptions" },
	publicApi: [
		{ path: "/api/subscribe/add", methods: ["POST"], cors: true },
		// Opened from links inside emails (plain browser navigation, no CORS needed).
		{ path: "/api/subscribe/confirm", methods: ["GET"], cors: false },
		{ path: "/api/subscribe/delete", methods: ["GET"], cors: false }, // unsubscribe
	],
	routes: { index: base },
	settings: {
		/**
		 * Client-facing app. After a visitor clicks a link in an email they are sent
		 * to `${clientAppUrl}${resultPath}?status=confirmed|unsubscribed|invalid`.
		 * Override per environment with the CLIENT_APP_URL variable.
		 */
		clientFacingApp: process.env.CLIENT_FACING_APP,
		resultPath: "/subscription",
		confirmTtlHours: 48,
		/** Re-submitting a PENDING email within this window does not send another mail. */
		resendCooldownSeconds: 60,
		confirmSubject: "Please confirm your subscription",
	},
});
