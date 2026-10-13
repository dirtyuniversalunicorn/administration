import { appConfig } from "@/src/core/config/appConfig";
import { prisma } from "@/src/lib/prisma";

export default async function Items() {
	const items = await prisma.item.findMany({
		orderBy: { createdAt: "desc" },
		include: { postedBy: { select: { name: true } } },
	});

	return (
		<section className="flex flex-col gap-6">
			<h1 className="text-2xl font-semibold">Items ({items.length})</h1>
			{items.length === 0 ? (
				<p className="text-sm text-slate-600">No items yet.</p>
			) : (
				<ul className="grid gap-4 sm:grid-cols-2">
					{items.map((item) => (
						<li key={item.id}>
							<a
								href={appConfig.routes.item(item.id)}
								className="flex flex-col overflow-hidden rounded-md border border-slate-200 bg-white hover:border-slate-400"
							>
								<img
									src={item.imageUrl}
									alt={`${item.category}, ${item.technique}`}
									className="aspect-[4/3] w-full object-cover"
									loading="lazy"
								/>
								<div className="flex flex-col gap-1 p-3 text-sm">
									<span className="font-medium capitalize">
										{item.category}
									</span>
									<span className="text-slate-600">{item.technique}</span>
									<span className="text-slate-500">
										{item.postedBy.name ?? "—"} ·{" "}
										{item.createdAt.toLocaleDateString("en-GB")}
									</span>
								</div>
							</a>
						</li>
					))}
				</ul>
			)}
		</section>
	);
}
