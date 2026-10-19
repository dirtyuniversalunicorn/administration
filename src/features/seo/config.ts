import { defineFeature } from "@/src/core/config/define-feature";

const base = "/dashboard/seo";

export const seoFeature = defineFeature({
	id: "seo",
	pagePrefix: base,
	nav: { label: "SEO", href: base, icon: "seo" },
	routes: { index: base },
});
