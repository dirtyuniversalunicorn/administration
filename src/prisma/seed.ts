// Populates the database with dummy data. Safe to run repeatedly (upserts).
// Run:  npm run db:seed
import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { hashPassword } from "better-auth/crypto";
import { PrismaClient } from "../generated/prisma-node/client";

const prisma = new PrismaClient({
	adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL }),
});

const ADMIN_EMAIL = (process.env.SEED_ADMIN_EMAIL ?? "admin@example.com").toLowerCase();

const items = [
	["painting", "oil on canvas"],
	["painting", "watercolor"],
	["painting", "acrylic on panel"],
	["sculpture", "bronze casting"],
	["sculpture", "carved marble"],
	["sculpture", "welded steel"],
	["photography", "35mm film"],
	["photography", "digital long exposure"],
	["drawing", "charcoal"],
	["drawing", "ink and pen"],
	["print", "linocut"],
	["print", "screen print"],
] as const;

const blogs = [
	{
		title: "Welcome to our new website",
		excerpt: "A short tour of what is new and where to find things.",
		content:
			"We have rebuilt the site from the ground up.\n\nThe new layout is faster, easier to read on a phone, and every page can be updated by our team without a developer.\n\nOver the coming weeks we will share more about the work behind the scenes. Stay tuned.",
	},
	{
		title: "Behind the scenes: our process",
		excerpt: "How a piece goes from first sketch to the finished work.",
		content:
			"Every piece starts as a rough sketch.\n\nFrom there we choose the materials, test the technique on a small sample, and only then begin the final work. It is slower than cutting corners, but the result is worth it.\n\nWe will post photos of each step in the next entries.",
	},
	{
		title: "Draft: autumn exhibition announcement",
		excerpt: "Not published yet.",
		content: "This is a draft that is hidden from the public site.\n\nOnce the dates are confirmed, set it to Active to publish it.",
	},
];

async function seedAdmin() {
	const existing = await prisma.user.findUnique({
		where: { email: ADMIN_EMAIL },
	});
	if (existing) return existing;

	// Gives you a working login: the password comes from SEED_ADMIN_PASSWORD, or
	// is generated and printed once below.
	const password = process.env.SEED_ADMIN_PASSWORD ?? crypto.randomUUID().replaceAll("-", "").slice(0, 16);
	const userId = crypto.randomUUID();

	const user = await prisma.user.create({
		data: {
			id: userId,
			email: ADMIN_EMAIL,
			name: "Admin",
			emailVerified: true,
			role: "ADMIN",
			accounts: {
				create: {
					id: crypto.randomUUID(),
					accountId: userId,
					providerId: "credential",
					password: await hashPassword(password),
				},
			},
		},
	});

	console.log(`Created admin user ${ADMIN_EMAIL}`);
	if (!process.env.SEED_ADMIN_PASSWORD) console.log(`Password: ${password}`);
	return user;
}

async function main() {
	const admin = await seedAdmin();

	for (const [i, [category, technique]] of items.entries()) {
		const id = `seed-item-${i + 1}`;
		const data = {
			postedById: admin.id,
			category,
			technique,
			// Stable placeholder image per item.
			imageUrl: `https://picsum.photos/seed/${id}/800/600`,
		};
		await prisma.item.upsert({
			where: { id },
			// Status and editedBy only on create, so re-running the seed never
			// overrides your changes. The last item starts INACTIVE to demo the hidden state.
			create: {
				id,
				...data,
				editedById: admin.id,
				...(i === items.length - 1 ? { status: "INACTIVE" as const, deactivatedAt: new Date() } : {}),
			},
			update: data,
		});
	}

	console.log(`Seeded ${items.length} items.`);

	for (const [i, blog] of blogs.entries()) {
		const id = `seed-blog-${i + 1}`;
		await prisma.blog.upsert({
			where: { id },
			create: {
				id,
				...blog,
				imageUrl: `https://picsum.photos/seed/${id}/1200/600`,
				postedById: admin.id,
				editedById: admin.id,
				// The last post starts INACTIVE to demo the hidden state.
				...(i === blogs.length - 1 ? { status: "INACTIVE" as const, deactivatedAt: new Date() } : {}),
			},
			// Create-only: re-running the seed never overwrites a post you edited.
			update: {},
		});
	}

	console.log(`Seeded ${blogs.length} blogs.`);
}

main()
	.catch((error) => {
		console.error(error);
		process.exitCode = 1;
	})
	.finally(() => prisma.$disconnect());
