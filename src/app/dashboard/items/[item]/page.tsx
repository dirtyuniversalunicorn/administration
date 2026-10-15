import { notFound } from "next/navigation";
import { prisma } from "@/src/lib/prisma";
import { itemsFeature } from "@/src/features/items/config";

export default async function Item({
	params,
}: {
	params: Promise<{ item: string }>;
}) {
	const { item: id } = await params;
	const item = await prisma.item.findUnique({
		where: { id },
		include: {
			postedBy: { select: { name: true, email: true } },
			editedBy: { select: { name: true, email: true } },
		},
	});
	if (!item) notFound();

	const rows: [string, string][] = [
		["Category", item.category],
		["Technique", item.technique],
		["Status", item.status === "ACTIVE" ? "Active" : "Inactive"],
		["Posted by", item.postedBy.name ?? item.postedBy.email],
		["Created", item.createdAt.toLocaleString("en-GB")],
		[
			"Last edited",
			`${item.editedBy.name ?? item.editedBy.email} · ${item.editedAt.toLocaleString("en-GB")}`,
		],
	];

	return (
		<section className="mx-auto flex w-full max-w-2xl flex-col gap-6">
			<a href={itemsFeature.routes.index} className="text-sm text-muted">
				← All items
			</a>
			<img
				src={item.imageUrl}
				alt={`${item.category}, ${item.technique}`}
				className="w-full rounded-md border border-line object-cover"
			/>
			<dl className="grid grid-cols-[8rem_1fr] gap-y-2 text-sm">
				{rows.map(([label, value]) => (
					<div key={label} className="contents">
						<dt className="text-muted">{label}</dt>
						<dd className="capitalize">{value}</dd>
					</div>
				))}
			</dl>
		</section>
	);
}
