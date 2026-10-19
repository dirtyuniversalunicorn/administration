import { defineFeature } from "@/src/core/config/define-feature";

const base = "/dashboard/contact";
const api = "/api/contact";

export const contactFeature = defineFeature({
	id: "contact",
	pagePrefix: base,
	apiPrefix: api,
	nav: { label: "Contact", href: base, icon: "contact" },
	// Reading is public (the client-facing site shows it); add, edit and delete
	// are not listed, so they need a login.
	publicApi: [{ path: `${api}/get`, methods: ["GET"], cors: true }],
	routes: {
		index: base,
		/** Add / edit form for the contact information (same page for both). */
		edit: `${base}/edit`,
		api: {
			get: `${api}/get`,
			add: `${api}/add`,
			edit: `${api}/edit`,
			delete: `${api}/delete`,
		},
	},
});
