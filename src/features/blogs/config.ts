import { defineFeature } from "@/src/core/config/define-feature";

const base = "/dashboard/blogs";
const api = "/api/blog";

export const blogsFeature = defineFeature({
	id: "blogs",
	pagePrefix: base,
	apiPrefix: api,
	nav: { label: "Blogs", href: base, icon: "blogs" },
	// Reading is public (the client-facing site shows the active blogs); add, edit,
	// delete and status are not listed, so they need a login.
	publicApi: [{ path: `${api}/get`, methods: ["GET"], cors: true }],
	routes: {
		index: base,
		/** app/dashboard/blogs/[blog] */
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
