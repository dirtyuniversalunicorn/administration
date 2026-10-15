import { createBlogAction } from "@/src/core/blogs/actions/blogActions";
import { BlogForm } from "@/src/core/blogs/components/blog-form";
import { appConfig } from "@/src/core/config/appConfig";

export default function NewBlog() {
	return (
		<section className="mx-auto flex w-full max-w-2xl flex-col gap-6">
			<a href={appConfig.routes.blogs} className="text-sm text-muted">
				← All blogs
			</a>
			<h1 className="text-2xl font-semibold">Add blog</h1>
			<BlogForm action={createBlogAction} submitLabel="Create blog" />
		</section>
	);
}
