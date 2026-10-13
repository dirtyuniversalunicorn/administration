import {
	Box,
	Flex,
	Heading,
	Stack,
	StackSeparator,
	Text,
} from "@chakra-ui/react";
import { RegisterForm } from "@/core/auth/components/register-form";
import { prisma } from "@/lib/prisma";

export default async function Users() {
	const users = await prisma.user.findMany({
		select: { id: true, name: true, email: true, createdAt: true },
		orderBy: { createdAt: "desc" },
	});

	return (
		<Stack gap="6" maxW="xl">
			<Heading as="h1" size="2xl">
				Register user
			</Heading>
			<RegisterForm />

			<Heading as="h2" size="xl">
				Users ({users.length})
			</Heading>
			{users.length === 0 ? (
				<Text fontSize="sm" color="fg.muted">
					No users yet.
				</Text>
			) : (
				<Stack
					gap="0"
					borderWidth="1px"
					rounded="md"
					bg="bg.panel"
					separator={<StackSeparator />}
				>
					{users.map((user) => (
						<Flex
							key={user.id}
							align="center"
							justify="space-between"
							gap="4"
							px="4"
							py="3"
							fontSize="sm"
						>
							<Box>
								<Text fontWeight="medium">{user.name ?? "—"}</Text>
								<Text color="fg.muted">{user.email}</Text>
							</Box>
							<Text color="fg.muted">
								{user.createdAt.toLocaleDateString("en-GB")}
							</Text>
						</Flex>
					))}
				</Stack>
			)}
		</Stack>
	);
}
