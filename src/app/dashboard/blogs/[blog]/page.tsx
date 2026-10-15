import { notFound } from "next/navigation";
import {
	deleteBlogAction,
	setBlogStatusAction,
} from "@/src/features/blogs/actions/blogActions";
import { DeleteButton } from "@/src/core/ui/delete-button";
import { prisma } from "@/src/lib/prisma";
import { blogsFeature } from "@/src/features/blogs/config";

const button =
	"rounded-md border border-line-strong bg-surface px-3 py-1.5 text-sm font-medium hover:bg-background";

export default async function Blog({
	params,
}: {
	params: Promise<{ blog: string }>;
}) {
	const { blog: id } = await params;
	const blog = await prisma.blog.findUnique({
		where: { id },
		include: {
			postedBy: { select: { name: true, email: true } },
			editedBy: { select: { name: true, email: true } },
		},
	});
	if (!blog) notFound();

	const active = blog.status === "ACTIVE";

	return (
		<article className="mx-auto flex w-full max-w-2xl flex-col gap-6">
			<a href={blogsFeature.routes.index} className="text-sm text-muted">
				← All blogs
			</a>

			<header className="flex flex-col gap-3">
				<div className="flex items-start justify-between gap-4">
					<h1 className="text-2xl font-semibold">{blog.title}</h1>
					<span
						className={`shrink-0 rounded-full px-2 py-0.5 text-xs font-medium ${
							active ? "bg-success-soft text-success" : "bg-line text-muted"
						}`}
					>
						{active ? "Active" : "Inactive"}
					</span>
				</div>
				{blog.excerpt && <p className="text-muted">{blog.excerpt}</p>}
				<div className="flex flex-wrap items-center gap-2">
					<a href={blogsFeature.routes.edit(blog.id)} className={button}>
						Edit
					</a>
					<form
						action={setBlogStatusAction.bind(
							null,
							blog.id,
							active ? "INACTIVE" : "ACTIVE",
						)}
					>
						<button type="submit" className={button}>
							{active ? "Inactivate" : "Activate"}
						</button>
					</form>
					<DeleteButton
						action={deleteBlogAction.bind(null, blog.id)}
						title="Delete blog"
						className={`${button} border-danger text-danger`}
					>
						Delete <strong>{blog.title}</strong> permanently? This cannot be
						undone.
					</DeleteButton>
				</div>
			</header>

			{blog.imageUrl && (
				<img
					src={blog.imageUrl}
					alt=""
					className="w-full rounded-md border border-line object-cover"
				/>
			)}

			<div className="whitespace-pre-line leading-7">{blog.content}</div>

			<footer className="border-t border-line pt-4 text-xs text-muted">
				Posted by {blog.postedBy.name ?? blog.postedBy.email} on{" "}
				{blog.createdAt.toLocaleString("en-GB")}. Last edited by{" "}
				<span className="font-medium text-foreground">
					{blog.editedBy.name ?? blog.editedBy.email}
				</span>{" "}
				on {blog.editedAt.toLocaleString("en-GB")}.
			</footer>
		</article>
	);
}
