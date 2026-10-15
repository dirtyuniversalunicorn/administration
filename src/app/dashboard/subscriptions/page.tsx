import { appConfig } from "@/src/core/config/appConfig";

export default async function Subscriptions() {
	if (!appConfig.features.subscribe) return <p>This feature is not enabled.</p>
	return <p>Subscription page</p>;
}
