import { notFound } from "next/navigation";
import { appConfig } from "@/core/config/appConfig";
import { updateItemAction } from "@/core/items/actions/itemActions";
import { ItemForm } from "@/core/items/components/item-form";
import { BackLink, PageStack, PageTitle } from "@/core/ui/page-parts";
import { prisma } from "@/lib/prisma";

export default async function EditItem({
	params,
}: {
	params: Promise<{ item: string }>;
}) {
	const { item: id } = await params;
	const item = await prisma.item.findUnique({ where: { id } });
	if (!item) notFound();

	return (
		<PageStack>
			<BackLink href={appConfig.routes.items}>← All items</BackLink>
			<PageTitle>Edit item</PageTitle>
			<ItemForm
				action={updateItemAction.bind(null, item.id)}
				submitLabel="Save changes"
				defaults={{
					category: item.category,
					technique: item.technique,
					imageUrl: item.imageUrl,
				}}
			/>
		</PageStack>
	);
}
