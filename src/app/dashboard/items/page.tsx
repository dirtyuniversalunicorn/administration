import { appConfig } from "@/src/core/config/appConfig";
import { DeleteItemButton } from "@/src/core/items/components/delete-item-button";
import { ImagePreview } from "@/src/core/items/components/image-preview";
import { prisma } from "@/src/lib/prisma";

const th = "px-3 py-2 text-left font-medium text-slate-600";
const td = "px-3 py-2";

export default async function Items() {
	const items = await prisma.item.findMany({
		orderBy: { createdAt: "desc" },
		include: { postedBy: { select: { name: true, email: true } } },
	});

	return (
		<section className="flex flex-col gap-6">
			<div className="flex items-center justify-between">
				<h1 className="text-2xl font-semibold">Items ({items.length})</h1>
				<a
					href={appConfig.routes.itemNew}
					className="rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white"
				>
					Add item
				</a>
			</div>

			{items.length === 0 ? (
				<p className="text-sm text-slate-600">No items yet.</p>
			) : (
				<table className="w-full border-collapse rounded-md border border-slate-200 bg-white text-sm">
					<thead className="border-b border-slate-200 bg-slate-50">
						<tr>
							<th className={th}>Image</th>
							<th className={th}>Category</th>
							<th className={th}>Technique</th>
							<th className={th}>Posted by</th>
							<th className={th}>Created</th>
							<th className={th}>Edited</th>
							<th className={th}>
								<span className="sr-only">Actions</span>
							</th>
						</tr>
					</thead>
					<tbody className="divide-y divide-slate-200">
						{items.map((item) => (
							<tr key={item.id}>
								<td className={td}>
									<ImagePreview
										src={item.imageUrl}
										alt={`${item.category}, ${item.technique}`}
									/>
								</td>
								<td className={`${td} capitalize`}>
									<a
										href={appConfig.routes.item(item.id)}
										className="font-medium hover:underline"
									>
										{item.category}
									</a>
								</td>
								<td className={`${td} capitalize`}>{item.technique}</td>
								<td className={td}>
									{item.postedBy.name ?? item.postedBy.email}
								</td>
								<td className={td}>
									{item.createdAt.toLocaleDateString("en-GB")}
								</td>
								<td className={td}>
									{item.editedAt.toLocaleDateString("en-GB")}
								</td>
								<td className={td}>
									<div className="flex items-center justify-end gap-4">
										<a
											href={appConfig.routes.itemEdit(item.id)}
											className="text-slate-700 hover:underline"
										>
											Edit
										</a>
										<DeleteItemButton
											id={item.id}
											label={`${item.category}, ${item.technique}`}
										/>
									</div>
								</td>
							</tr>
						))}
					</tbody>
				</table>
			)}
		</section>
	);
}
