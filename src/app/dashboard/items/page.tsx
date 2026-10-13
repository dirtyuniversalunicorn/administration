import {
	type ItemsFilter,
	ItemsTable,
} from "@/core/items/components/items-table";
import { prisma } from "@/lib/prisma";

export default async function Items({
	searchParams,
}: {
	searchParams: Promise<{ status?: string }>;
}) {
	const { status } = await searchParams;
	const filter: ItemsFilter =
		status === "active" || status === "inactive" ? status : "all";

	const items = await prisma.item.findMany({
		where:
			filter === "all"
				? {}
				: { status: filter.toUpperCase() as "ACTIVE" | "INACTIVE" },
		orderBy: { createdAt: "desc" },
		include: { postedBy: { select: { name: true, email: true } } },
	});

	return (
		<ItemsTable
			filter={filter}
			items={items.map((item) => ({
				id: item.id,
				category: item.category,
				technique: item.technique,
				imageUrl: item.imageUrl,
				status: item.status,
				postedBy: item.postedBy.name ?? item.postedBy.email,
				created: item.createdAt.toLocaleDateString("en-GB"),
				edited: item.editedAt.toLocaleDateString("en-GB"),
			}))}
		/>
	);
}
