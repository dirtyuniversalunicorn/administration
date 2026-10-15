import { createItemAction } from "@/src/features/items/actions/itemActions";
import { ItemForm } from "@/src/features/items/components/item-form";
import { itemsFeature } from "@/src/features/items/config";

export default function NewItem() {
	return (
		<section className="mx-auto flex w-full max-w-xl flex-col gap-6">
			<a href={itemsFeature.routes.index} className="text-sm text-muted">
				← All items
			</a>
			<h1 className="text-2xl font-semibold">Add item</h1>
			<ItemForm action={createItemAction} submitLabel="Create item" />
		</section>
	);
}
