import { Heading, Link, Stack } from "@chakra-ui/react";
import { appConfig } from "@/core/config/appConfig";
import { createItemAction } from "@/core/items/actions/itemActions";
import { ItemForm } from "@/core/items/components/item-form";

export default function NewItem() {
	return (
		<Stack gap="6">
			<Link href={appConfig.routes.items} color="fg.muted" fontSize="sm">
				← All items
			</Link>
			<Heading as="h1" size="2xl">
				Add item
			</Heading>
			<ItemForm action={createItemAction} submitLabel="Create item" />
		</Stack>
	);
}
