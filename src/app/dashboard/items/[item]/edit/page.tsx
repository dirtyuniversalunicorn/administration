import { notFound } from "next/navigation";
import { currentUser } from "@/src/core/auth/session";
import { NoAccess } from "@/src/core/ui/no-access";
import { ItemForm } from "@/src/features/items/components/item-form";
import { itemsFeature } from "@/src/features/items/config";
import { prisma } from "@/src/lib/prisma";

export default async function EditItem({ params }: { params: Promise<{ item: string }> }) {
	if (!(await currentUser()).hasPermission("write")) return <NoAccess />;
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
				mode="edit"
				id={item.id}
				defaults={{
					category: item.category,
					technique: item.technique,
					imageUrl: item.imageUrl,
				}}
			/>
		</section>
	);
}
