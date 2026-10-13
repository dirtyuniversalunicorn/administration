import { notFound } from "next/navigation";
import { appConfig } from "@/src/core/config/appConfig";
import { updateItemAction } from "@/src/core/items/actions/itemActions";
import { ItemForm } from "@/src/core/items/components/item-form";
import { prisma } from "@/src/lib/prisma";

export default async function EditItem({
	params,
}: {
	params: Promise<{ item: string }>;
}) {
	const { item: id } = await params;
	const item = await prisma.item.findUnique({ where: { id } });
	if (!item) notFound();

	return (
		<section className="flex flex-col gap-6">
			<a href={appConfig.routes.items} className="text-sm text-slate-600">
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
