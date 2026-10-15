import {
	isSubscriptionEnabled,
	subscriptionDisabledResponse,
	unsubscribeByToken,
} from "@/src/features/subscribe/subscribe";
import { isValidToken, resultRedirect } from "@/src/features/subscribe/tokens";

export const dynamic = "force-dynamic";

// Unsubscribe link inside emails: ?token=<unsubscribeToken>.
// Soft delete: the row is kept, its status becomes INACTIVE.
export async function GET(request: Request) {
	if (!isSubscriptionEnabled()) return subscriptionDisabledResponse();

	const token = new URL(request.url).searchParams.get("token");
	const ok = isValidToken(token) && (await unsubscribeByToken(token));
	return resultRedirect(ok ? "unsubscribed" : "invalid");
}
