import { ApiButton } from "@/src/core/ui/api-button";
import { DeleteButton } from "@/src/core/ui/delete-button";
import { ImagePreview } from "@/src/features/items/components/image-preview";
import { itemsFeature } from "@/src/features/items/config";
import { prisma } from "@/src/lib/prisma";

const th = "px-3 py-2 text-left font-medium text-muted";
const td = "px-3 py-2";

const filters = [
	{ key: "all", label: "All" },
	{ key: "active", label: "Active" },
	{ key: "inactive", label: "Inactive" },
] as const;

export default async function Items({ searchParams }: { searchParams: Promise<{ status?: string }> }) {
	const { status } = await searchParams;
	const filter = status === "active" || status === "inactive" ? status : "all";

	const items = await prisma.item.findMany({
		where: filter === "all" ? {} : { status: filter.toUpperCase() as "ACTIVE" | "INACTIVE" },
		orderBy: { createdAt: "desc" },
		include: {
			postedBy: { select: { name: true, email: true } },
			editedBy: { select: { name: true, email: true } },
		},
	});

	return (
		<section className="flex flex-col gap-6">
			<div className="flex items-center justify-between">
				<h1 className="text-2xl font-semibold">Items ({items.length})</h1>
				<a href={itemsFeature.routes.new} className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground">
					Add item
				</a>
			</div>

			<nav className="flex gap-2 text-sm">
				{filters.map((f) => (
					<a
						key={f.key}
						href={f.key === "all" ? itemsFeature.routes.index : `${itemsFeature.routes.index}?status=${f.key}`}
						className={`rounded-full border px-3 py-1 ${filter === f.key ? "border-primary bg-primary text-primary-foreground" : "border-line-strong bg-surface hover:bg-background"}`}
					>
						{f.label}
					</a>
				))}
			</nav>

			{items.length === 0 ? (
				<p className="text-sm text-muted">No items.</p>
			) : (
				<table className="w-full border-collapse rounded-md border border-line bg-surface text-sm">
					<thead className="border-b border-line bg-background">
						<tr>
							<th className={th}>Image</th>
							<th className={th}>Category</th>
							<th className={th}>Technique</th>
							<th className={th}>Status</th>
							<th className={th}>Posted by</th>
							<th className={th}>Created</th>
							<th className={th}>Last edit</th>
							<th className={th}>
								<span className="sr-only">Actions</span>
							</th>
						</tr>
					</thead>
					<tbody className="divide-y divide-line">
						{items.map((item) => {
							const active = item.status === "ACTIVE";
							return (
								<tr key={item.id} className={active ? "" : "bg-background text-muted"}>
									<td className={td}>
										<ImagePreview src={item.imageUrl} alt={`${item.category}, ${item.technique}`} />
									</td>
									<td className={`${td} capitalize`}>
										<a href={itemsFeature.routes.detail(item.id)} className="font-medium hover:underline">
											{item.category}
										</a>
									</td>
									<td className={`${td} capitalize`}>{item.technique}</td>
									<td className={td}>
										<span className={`rounded-full px-2 py-0.5 text-xs font-medium ${active ? "bg-success-soft text-success" : "bg-line text-muted"}`}>{active ? "Active" : "Inactive"}</span>
									</td>
									<td className={td}>{item.postedBy.name ?? item.postedBy.email}</td>
									<td className={td}>{item.createdAt.toLocaleDateString("en-GB")}</td>
									<td className={td} title={item.editedAt.toLocaleString("en-GB")}>
										{item.editedAt.toLocaleDateString("en-GB")}
										<span className="block text-xs text-muted">by {item.editedBy.name ?? item.editedBy.email}</span>
									</td>
									<td className={td}>
										<div className="flex items-center justify-end gap-4">
											<a href={itemsFeature.routes.edit(item.id)} className="text-foreground hover:underline">
												Edit
											</a>
											<ApiButton url={itemsFeature.routes.api.status} body={{ id: item.id, status: active ? "INACTIVE" : "ACTIVE" }}>
												{active ? "Inactivate" : "Activate"}
											</ApiButton>
											<DeleteButton url={itemsFeature.routes.api.delete} body={{ id: item.id }} title="Delete item">
												Delete{" "}
												<strong>
													{item.category}, {item.technique}
												</strong>{" "}
												permanently? This cannot be undone.
											</DeleteButton>
										</div>
									</td>
								</tr>
							);
						})}
					</tbody>
				</table>
			)}
		</section>
	);
}
