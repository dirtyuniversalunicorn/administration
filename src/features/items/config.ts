import { defineFeature } from "@/src/core/config/define-feature";

const base = "/dashboard/items";
const api = "/api/item";

export const itemsFeature = defineFeature({
	id: "items",
	pagePrefix: base,
	apiPrefix: api,
	nav: { label: "Items", href: base, icon: "items" },
	// Reading is public (the client-facing site shows the active items); add, edit,
	// delete and status are not listed, so they need a login.
	publicApi: [{ path: `${api}/get`, methods: ["GET"], cors: true }],
	routes: {
		index: base,
		/** app/dashboard/items/[item] */
		detail: (id: string) => `${base}/${encodeURIComponent(id)}`,
		new: `${base}/new`,
		edit: (id: string) => `${base}/${encodeURIComponent(id)}/edit`,
		api: {
			get: `${api}/get`,
			add: `${api}/add`,
			edit: `${api}/edit`,
			delete: `${api}/delete`,
			status: `${api}/status`,
		},
	},
});
