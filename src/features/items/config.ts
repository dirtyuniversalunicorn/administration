import { defineFeature } from "@/src/core/config/feature";

const base = "/dashboard/items";

export const itemsFeature = defineFeature({
	id: "items",
	pagePrefix: base,
	apiPrefix: "/api/item",
	nav: { label: "Items", href: base, icon: "items" },
	publicApi: [{ path: "/api/item/get", methods: ["GET"], cors: true }],
	routes: {
		index: base,
		/** app/dashboard/items/[item] */
		detail: (id: string) => `${base}/${encodeURIComponent(id)}`,
		new: `${base}/new`,
		edit: (id: string) => `${base}/${encodeURIComponent(id)}/edit`,
	},
});
