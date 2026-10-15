import { notFound } from "next/navigation";
import { updateItemAction } from "@/src/features/items/actions/itemActions";
import { ItemForm } from "@/src/features/items/components/item-form";
import { prisma } from "@/src/lib/prisma";
import { itemsFeature } from "@/src/features/items/config";

export default async function EditItem({
	params,
}: {
	params: Promise<{ item: string }>;
}) {
	const { item: id } = await params;
	const item = await prisma.item.findUnique({ where: { id } });
	if (!item) notFound();

	return (
		<section className="mx-auto flex w-full max-w-xl flex-col gap-6">
			<a href={itemsFeature.routes.index} className="text-sm text-muted">
				← All items
			</a>
			<h1 className="text-2xl font-semibold">Edit item</h1>
			<ItemForm
				action={updateItemAction.bind(null, item.id)}
				submitLabel="Save changes"
				defaults={{
					category: item.category,
					technique: item.technique,
					imageUrl: item.imageUrl,
				}}
			/>
		</section>
	);
}
