import { appConfig } from "@/src/core/config/appConfig";
import { createItemAction } from "@/src/core/items/actions/itemActions";
import { ItemForm } from "@/src/core/items/components/item-form";

export default function NewItem() {
	return (
		<section className="mx-auto flex w-full max-w-xl flex-col gap-6">
			<a href={appConfig.routes.items} className="text-sm text-muted">
				← All items
			</a>
			<h1 className="text-2xl font-semibold">Add item</h1>
			<ItemForm action={createItemAction} submitLabel="Create item" />
		</section>
	);
}
