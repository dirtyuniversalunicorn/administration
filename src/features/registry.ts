import { createAccessRules } from "@/src/core/config/access";
import { appConfig, isFeatureEnabled } from "@/src/core/config/appConfig";
import type {
	FeatureDefinition,
	FeatureId,
	NavEntry,
} from "@/src/core/config/feature";
import { blogsFeature } from "./blogs/config";
import { contactFeature } from "./contact/config";
import { itemsFeature } from "./items/config";
import { seoFeature } from "./seo/config";
import { subscribeFeature } from "./subscribe/config";
import { translationsFeature } from "./translations/config";
import { websiteFeature } from "./website/config";

/*
 * The one place that lists every feature. It composes their configs with the
 * on/off flags in appConfig.features and hands core plain data (sidebar
 * entries, access rules), so core never imports a feature.
 *
 * Only import this from the app layer (proxy.ts, app/**). Feature configs are
 * free of server-only code, so this file is safe in the proxy.
 */

type AnyFeature = FeatureDefinition<unknown, unknown>;

export const allFeatures: AnyFeature[] = [
	itemsFeature,
	blogsFeature,
	contactFeature,
	subscribeFeature,
	translationsFeature,
	websiteFeature,
	seoFeature,
];

// A flag without a feature is a mistake worth failing loudly on (it is pure
// computation on static data, so it behaves the same in dev, build and prod).
for (const id of Object.keys(appConfig.features) as FeatureId[]) {
	if (!allFeatures.some((feature) => feature.id === id)) {
		throw new Error(
			`appConfig.features.${id} has no matching feature in src/features/registry.ts`,
		);
	}
}

export const enabledFeatures = allFeatures.filter((f) =>
	isFeatureEnabled(f.id),
);
export const disabledFeatures = allFeatures.filter(
	(f) => !isFeatureEnabled(f.id),
);

const dashboardNav: NavEntry = {
	label: "Dashboard",
	href: appConfig.routes.home,
	icon: "dashboard",
};
const usersNav: NavEntry = {
	label: "Users",
	href: appConfig.routes.users,
	icon: "users",
};

/** Sidebar order: core pages and features interleaved as listed here. */
const sidebar: (NavEntry | AnyFeature)[] = [
	dashboardNav,
	itemsFeature,
	blogsFeature,
	usersNav,
	contactFeature,
	subscribeFeature,
	translationsFeature,
	websiteFeature,
	seoFeature,
];

/** Sidebar entries, with disabled features left out. */
export const nav: NavEntry[] = sidebar.flatMap((entry) => {
	if (!("id" in entry)) return [entry];
	return isFeatureEnabled(entry.id) && entry.nav ? [entry.nav] : [];
});

export const accessRules = createAccessRules({
	protectedPaths: appConfig.auth.protectedPaths,
	publicApi: [
		...appConfig.api.public,
		...enabledFeatures.flatMap((f) => f.publicApi ?? []),
	],
	blockedApi: appConfig.api.blocked,
	disabledApiPrefixes: disabledFeatures.flatMap((f) =>
		f.apiPrefix ? [f.apiPrefix] : [],
	),
	disabledPages: disabledFeatures.flatMap((f) =>
		f.pagePrefix ? [{ prefix: f.pagePrefix, id: f.id }] : [],
	),
	cors: appConfig.api.cors,
});
