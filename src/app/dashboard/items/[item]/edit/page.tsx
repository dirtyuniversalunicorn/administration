import { Heading, Link, Stack } from "@chakra-ui/react";
import { notFound } from "next/navigation";
import { appConfig } from "@/core/config/appConfig";
import { updateItemAction } from "@/core/items/actions/itemActions";
import { ItemForm } from "@/core/items/components/item-form";
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
		<Stack gap="6">
			<Link href={appConfig.routes.items} color="fg.muted" fontSize="sm">
				← All items
			</Link>
			<Heading as="h1" size="2xl">
				Edit item
			</Heading>
			<ItemForm
				action={updateItemAction.bind(null, item.id)}
				submitLabel="Save changes"
				defaults={{
					category: item.category,
					technique: item.technique,
					imageUrl: item.imageUrl,
				}}
			/>
		</Stack>
	);
}
