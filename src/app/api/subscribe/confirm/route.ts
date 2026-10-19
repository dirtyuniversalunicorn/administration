import { confirmSubscription, isSubscriptionEnabled, subscriptionDisabledResponse } from "@/src/features/subscribe/subscribe";
import { isValidToken, resultRedirect } from "@/src/features/subscribe/tokens";

export const dynamic = "force-dynamic";

// Link from the confirmation email: ?token=...
export async function GET(request: Request) {
	if (!isSubscriptionEnabled()) return subscriptionDisabledResponse();

	const token = new URL(request.url).searchParams.get("token");
	const ok = isValidToken(token) && (await confirmSubscription(token));
	return resultRedirect(ok ? "confirmed" : "invalid");
}
