import { notFound } from "next/navigation";
import { appConfig } from "@/src/core/config/appConfig";
import { disabledFeatures } from "@/src/features/registry";

/**
 * Shown (with a 404 status) when someone opens a page of a feature that is
 * switched off. The proxy rewrites the feature's pages here; it needs a login,
 * like everything under /dashboard. Opening it for an enabled or unknown
 * feature is a plain 404.
 */
export default async function FeatureDisabled({
	params,
}: {
	params: Promise<{ feature: string }>;
}) {
	const { feature: id } = await params;
	const feature = disabledFeatures.find((f) => f.id === id);
	if (!feature) notFound();

	const label = feature.nav?.label ?? feature.id;

	return (
		<section className="mx-auto flex w-full max-w-xl flex-col gap-6">
			<h1 className="text-2xl font-semibold">The {label} feature is not enabled</h1>

			<div className="rounded-md border border-line bg-surface p-6 text-sm">
				<p>This feature is turned off for this site, so its pages and API are not available.</p>
			</div>

			<a href={appConfig.routes.home} className="text-sm text-muted">
				← Back to the dashboard
			</a>
		</section>
	);
}
