import { currentUser } from "@/src/core/auth/session";
import { NoAccess } from "@/src/core/ui/no-access";
import { ItemForm } from "@/src/features/items/components/item-form";
import { itemsFeature } from "@/src/features/items/config";

export default async function NewItem() {
	if (!(await currentUser()).hasPermission("write")) return <NoAccess />;
	return (
		<section className="mx-auto flex w-full max-w-xl flex-col gap-6">
			<a href={itemsFeature.routes.index} className="text-sm text-muted">
				← All items
			</a>
			<h1 className="text-2xl font-semibold">Add item</h1>
			<ItemForm mode="add" />
		</section>
	);
}
