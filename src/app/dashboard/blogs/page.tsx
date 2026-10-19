import { ApiButton } from "@/src/core/ui/api-button";
import { DeleteButton } from "@/src/core/ui/delete-button";
import { blogsFeature } from "@/src/features/blogs/config";
import { prisma } from "@/src/lib/prisma";

const th = "px-3 py-2 text-left font-medium text-muted";
const td = "px-3 py-2";

const filters = [
	{ key: "all", label: "All" },
	{ key: "active", label: "Active" },
	{ key: "inactive", label: "Inactive" },
] as const;

export default async function Blogs({ searchParams }: { searchParams: Promise<{ status?: string }> }) {
	const { status } = await searchParams;
	const filter = status === "active" || status === "inactive" ? status : "all";

	const blogs = await prisma.blog.findMany({
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
				<h1 className="text-2xl font-semibold">Blogs ({blogs.length})</h1>
				<a href={blogsFeature.routes.new} className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground">
					Add blog
				</a>
			</div>

			<nav className="flex gap-2 text-sm">
				{filters.map((f) => (
					<a
						key={f.key}
						href={f.key === "all" ? blogsFeature.routes.index : `${blogsFeature.routes.index}?status=${f.key}`}
						className={`rounded-full border px-3 py-1 ${filter === f.key ? "border-primary bg-primary text-primary-foreground" : "border-line-strong bg-surface hover:bg-background"}`}
					>
						{f.label}
					</a>
				))}
			</nav>

			{blogs.length === 0 ? (
				<p className="text-sm text-muted">{filter === "all" ? "No blogs yet. Add the first one." : "No blogs with this status."}</p>
			) : (
				<table className="w-full border-collapse rounded-md border border-line bg-surface text-sm">
					<thead className="border-b border-line bg-background">
						<tr>
							<th className={th}>Title</th>
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
						{blogs.map((blog) => {
							const active = blog.status === "ACTIVE";
							return (
								<tr key={blog.id} className={active ? "" : "bg-background text-muted"}>
									<td className={`${td} max-w-xs`}>
										<a href={blogsFeature.routes.detail(blog.id)} className="font-medium hover:underline">
											{blog.title}
										</a>
										{blog.excerpt && <span className="line-clamp-1 block text-xs text-muted">{blog.excerpt}</span>}
									</td>
									<td className={td}>
										<span className={`rounded-full px-2 py-0.5 text-xs font-medium ${active ? "bg-success-soft text-success" : "bg-line text-muted"}`}>{active ? "Active" : "Inactive"}</span>
									</td>
									<td className={td}>{blog.postedBy.name ?? blog.postedBy.email}</td>
									<td className={td}>{blog.createdAt.toLocaleDateString("en-GB")}</td>
									<td className={td} title={blog.editedAt.toLocaleString("en-GB")}>
										{blog.editedAt.toLocaleDateString("en-GB")}
										<span className="block text-xs text-muted">by {blog.editedBy.name ?? blog.editedBy.email}</span>
									</td>
									<td className={td}>
										<div className="flex items-center justify-end gap-4">
											<a href={blogsFeature.routes.edit(blog.id)} className="text-foreground hover:underline">
												Edit
											</a>
											<ApiButton url={blogsFeature.routes.api.status} body={{ id: blog.id, status: active ? "INACTIVE" : "ACTIVE" }}>
												{active ? "Inactivate" : "Activate"}
											</ApiButton>
											<DeleteButton url={blogsFeature.routes.api.delete} body={{ id: blog.id }} title="Delete blog">
												Delete <strong>{blog.title}</strong> permanently? This cannot be undone.
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
