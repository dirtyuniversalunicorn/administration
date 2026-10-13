"use client";

import { Box, Flex, Stack, StackSeparator, Text } from "@chakra-ui/react";
import { SectionTitle } from "@/core/ui/page-parts";

export type UserRow = {
	id: string;
	name: string | null;
	email: string;
	created: string;
};

export function UsersList({ users }: { users: UserRow[] }) {
	return (
		<Stack gap="6">
			<SectionTitle>Users ({users.length})</SectionTitle>
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
							<Text color="fg.muted">{user.created}</Text>
						</Flex>
					))}
				</Stack>
			)}
		</Stack>
	);
}
