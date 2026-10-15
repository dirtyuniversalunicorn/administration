import { createBlogAction } from "@/src/features/blogs/actions/blogActions";
import { BlogForm } from "@/src/features/blogs/components/blog-form";
import { blogsFeature } from "@/src/features/blogs/config";

export default function NewBlog() {
	return (
		<section className="mx-auto flex w-full max-w-2xl flex-col gap-6">
			<a href={blogsFeature.routes.index} className="text-sm text-muted">
				← All blogs
			</a>
			<h1 className="text-2xl font-semibold">Add blog</h1>
			<BlogForm action={createBlogAction} submitLabel="Create blog" />
		</section>
	);
}
