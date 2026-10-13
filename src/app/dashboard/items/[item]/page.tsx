import { notFound } from "next/navigation";
import { ItemDetail } from "@/core/items/components/item-detail";
import { prisma } from "@/lib/prisma";

export default async function Item({
	params,
}: {
	params: Promise<{ item: string }>;
}) {
	const { item: id } = await params;
	const item = await prisma.item.findUnique({
		where: { id },
		include: { postedBy: { select: { name: true, email: true } } },
	});
	if (!item) notFound();

	return (
		<ItemDetail
			item={{
				category: item.category,
				technique: item.technique,
				imageUrl: item.imageUrl,
				status: item.status,
				postedBy: item.postedBy.name ?? item.postedBy.email,
				created: item.createdAt.toLocaleString("en-GB"),
				edited: item.editedAt.toLocaleString("en-GB"),
			}}
		/>
	);
}
