import { defineFeature } from "@/src/core/config/feature";

const base = "/dashboard/translations";

export const translationsFeature = defineFeature({
	id: "translations",
	pagePrefix: base,
	nav: { label: "Translations", href: base, icon: "translations" },
	routes: { index: base },
});
