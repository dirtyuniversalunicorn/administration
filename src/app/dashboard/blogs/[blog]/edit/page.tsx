import { notFound } from "next/navigation";
import { currentUser } from "@/src/core/auth/session";
import { NoAccess } from "@/src/core/ui/no-access";
import { BlogForm } from "@/src/features/blogs/components/blog-form";
import { blogsFeature } from "@/src/features/blogs/config";
import { prisma } from "@/src/lib/prisma";

export default async function EditBlog({ params }: { params: Promise<{ blog: string }> }) {
	if (!(await currentUser()).can("write")) return <NoAccess />;
	const { blog: id } = await params;
	const blog = await prisma.blog.findUnique({ where: { id } });
	if (!blog) notFound();

	return (
		<section className="mx-auto flex w-full max-w-2xl flex-col gap-6">
			<a href={blogsFeature.routes.detail(blog.id)} className="text-sm text-muted">
				← Back to blog
			</a>
			<h1 className="text-2xl font-semibold">Edit blog</h1>
			<BlogForm
				mode="edit"
				id={blog.id}
				defaults={{
					title: blog.title,
					excerpt: blog.excerpt,
					content: blog.content,
					imageUrl: blog.imageUrl,
				}}
			/>
		</section>
	);
}
