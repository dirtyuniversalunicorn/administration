import { notFound } from "next/navigation";
import { appConfig } from "@/src/core/config/appConfig";
import { prisma } from "@/src/lib/prisma";

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

	const rows: [string, string][] = [
		["Category", item.category],
		["Technique", item.technique],
		["Posted by", item.postedBy.name ?? item.postedBy.email],
		["Created", item.createdAt.toLocaleString("en-GB")],
		["Edited", item.editedAt.toLocaleString("en-GB")],
	];

	return (
		<section className="flex flex-col gap-6">
			<a href={appConfig.routes.items} className="text-sm text-slate-600">
				← All items
			</a>
			<img
				src={item.imageUrl}
				alt={`${item.category}, ${item.technique}`}
				className="w-full rounded-md border border-slate-200 object-cover"
			/>
			<dl className="grid grid-cols-[8rem_1fr] gap-y-2 text-sm">
				{rows.map(([label, value]) => (
					<div key={label} className="contents">
						<dt className="text-slate-500">{label}</dt>
						<dd className="capitalize">{value}</dd>
					</div>
				))}
			</dl>
		</section>
	);
}
