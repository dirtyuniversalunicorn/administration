import { defineFeature } from "@/src/core/config/feature";

const base = "/dashboard/website";

export const websiteFeature = defineFeature({
	id: "website",
	pagePrefix: base,
	nav: { label: "Website", href: base, icon: "website" },
	routes: { index: base },
});
