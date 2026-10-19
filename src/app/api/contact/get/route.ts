import { guard } from "@/src/core/api";
import { getPublicContact } from "@/src/features/contact/queries";

export const dynamic = "force-dynamic";

/**
 * GET /api/contact/get   (public, CORS enabled for the client-facing site)
 * -> 200 { "contact": { email, phone, mobile, address, openingHours, updatedAt } }
 * -> 200 { "contact": null } when nothing has been added yet
 */
export function GET() {
	return guard(async () => Response.json({ contact: await getPublicContact() }));
}
