import { appConfig } from "@/core/config/appConfig";
import { createItemAction } from "@/core/items/actions/itemActions";
import { ItemForm } from "@/core/items/components/item-form";
import { BackLink, PageStack, PageTitle } from "@/core/ui/page-parts";

export default function NewItem() {
	return (
		<PageStack>
			<BackLink href={appConfig.routes.items}>← All items</BackLink>
			<PageTitle>Add item</PageTitle>
			<ItemForm action={createItemAction} submitLabel="Create item" />
		</PageStack>
	);
}
