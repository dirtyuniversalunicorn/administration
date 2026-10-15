import { defineFeature } from "@/src/core/config/feature";

const base = "/dashboard/contact";

export const contactFeature = defineFeature({
	id: "contact",
	pagePrefix: base,
	apiPrefix: "/api/contact",
	nav: { label: "Contact", href: base, icon: "contact" },
	routes: {
		index: base,
		/** Add / edit form for the contact information (same page for both). */
		edit: `${base}/edit`,
	},
});
