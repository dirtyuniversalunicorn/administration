import { revalidatePath } from "next/cache";

/** The page paths of a feature (`xFeature.routes`) that `refresh` knows about. Extra routes are ignored. */
type PageRoutes = {
	index: string;
	detail?: string | ((id: string) => string);
	edit?: string | ((id: string) => string);
};

/**
 * Drops the cached dashboard pages of a feature so they show a change: its
 * list page, plus its detail and edit pages when an `id` is given (a route
 * that is a fixed path, like contact's edit page, is always dropped).
 *
 *   refresh(blogsFeature.routes);        // after creating
 *   refresh(blogsFeature.routes, id);    // after editing, deleting, changing status
 */
export function refresh(routes: PageRoutes, id?: string) {
	revalidatePath(routes.index);
	for (const route of [routes.detail, routes.edit]) {
		if (typeof route === "string") revalidatePath(route);
		else if (route && id) revalidatePath(route(id));
	}
}
