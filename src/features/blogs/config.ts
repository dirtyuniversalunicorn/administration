import { defineFeature } from "@/src/core/config/feature";

const base = "/dashboard/blogs";

export const blogsFeature = defineFeature({
	id: "blogs",
	pagePrefix: base,
	nav: { label: "Blogs", href: base, icon: "blogs" },
	routes: {
		index: base,
		/** app/dashboard/blogs/[blog] */
		detail: (id: string) => `${base}/${encodeURIComponent(id)}`,
		new: `${base}/new`,
		edit: (id: string) => `${base}/${encodeURIComponent(id)}/edit`,
	},
});
