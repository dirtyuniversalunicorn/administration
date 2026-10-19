import { currentUser } from "@/src/core/auth/session";
import { NoAccess } from "@/src/core/ui/no-access";
import { BlogForm } from "@/src/features/blogs/components/blog-form";
import { blogsFeature } from "@/src/features/blogs/config";

export default async function NewBlog() {
	if (!(await currentUser()).can("write")) return <NoAccess />;
	return (
		<section className="mx-auto flex w-full max-w-2xl flex-col gap-6">
			<a href={blogsFeature.routes.index} className="text-sm text-muted">
				← All blogs
			</a>
			<h1 className="text-2xl font-semibold">Add blog</h1>
			<BlogForm mode="add" />
		</section>
	);
}
