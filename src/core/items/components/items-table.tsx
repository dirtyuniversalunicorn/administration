"use client";

import {
	Badge,
	Button,
	Flex,
	Heading,
	HStack,
	Link,
	Span,
	Table,
	Text,
} from "@chakra-ui/react";
import { appConfig } from "@/core/config/appConfig";
import { setItemStatusAction } from "../actions/itemActions";
import { DeleteItemButton } from "./delete-item-button";
import { ImagePreview } from "./image-preview";

/** Plain, serializable row built by the server page (dates already formatted). */
export type ItemRow = {
	id: string;
	category: string;
	technique: string;
	imageUrl: string;
	status: "ACTIVE" | "INACTIVE";
	postedBy: string;
	created: string;
	edited: string;
};

export type ItemsFilter = "all" | "active" | "inactive";

const filters: { key: ItemsFilter; label: string }[] = [
	{ key: "all", label: "All" },
	{ key: "active", label: "Active" },
	{ key: "inactive", label: "Inactive" },
];

const filterHref = (key: ItemsFilter) =>
	key === "all"
		? appConfig.routes.items
		: `${appConfig.routes.items}?status=${key}`;

export function ItemsTable({
	items,
	filter,
}: {
	items: ItemRow[];
	filter: ItemsFilter;
}) {
	return (
		<Flex direction="column" gap="6">
			<Flex align="center" justify="space-between">
				<Heading as="h1" size="2xl">
					Items ({items.length})
				</Heading>
				<Button asChild colorPalette="brand">
					<a href={appConfig.routes.itemNew}>Add item</a>
				</Button>
			</Flex>

			<HStack gap="2">
				{filters.map((f) => (
					<Button
						key={f.key}
						asChild
						size="xs"
						rounded="full"
						colorPalette="brand"
						variant={filter === f.key ? "solid" : "outline"}
					>
						<a href={filterHref(f.key)}>{f.label}</a>
					</Button>
				))}
			</HStack>

			{items.length === 0 ? (
				<Text fontSize="sm" color="fg.muted">
					No items.
				</Text>
			) : (
				<Table.ScrollArea borderWidth="1px" rounded="md" bg="bg.panel">
					<Table.Root size="sm">
						<Table.Header>
							<Table.Row bg="bg.subtle">
								<Table.ColumnHeader>Image</Table.ColumnHeader>
								<Table.ColumnHeader>Category</Table.ColumnHeader>
								<Table.ColumnHeader>Technique</Table.ColumnHeader>
								<Table.ColumnHeader>Status</Table.ColumnHeader>
								<Table.ColumnHeader>Posted by</Table.ColumnHeader>
								<Table.ColumnHeader>Created</Table.ColumnHeader>
								<Table.ColumnHeader>Edited</Table.ColumnHeader>
								<Table.ColumnHeader>
									<Span srOnly>Actions</Span>
								</Table.ColumnHeader>
							</Table.Row>
						</Table.Header>
						<Table.Body>
							{items.map((item) => {
								const active = item.status === "ACTIVE";
								return (
									<Table.Row
										key={item.id}
										bg={active ? "bg.panel" : "bg.subtle"}
										color={active ? undefined : "fg.muted"}
									>
										<Table.Cell>
											<ImagePreview
												src={item.imageUrl}
												alt={`${item.category}, ${item.technique}`}
											/>
										</Table.Cell>
										<Table.Cell textTransform="capitalize">
											<Link
												href={appConfig.routes.item(item.id)}
												fontWeight="medium"
											>
												{item.category}
											</Link>
										</Table.Cell>
										<Table.Cell textTransform="capitalize">
											{item.technique}
										</Table.Cell>
										<Table.Cell>
											<Badge colorPalette={active ? "green" : "gray"}>
												{active ? "Active" : "Inactive"}
											</Badge>
										</Table.Cell>
										<Table.Cell>{item.postedBy}</Table.Cell>
										<Table.Cell>{item.created}</Table.Cell>
										<Table.Cell>{item.edited}</Table.Cell>
										<Table.Cell>
											<HStack justify="flex-end" gap="3">
												<Link href={appConfig.routes.itemEdit(item.id)}>
													Edit
												</Link>
												<form
													action={setItemStatusAction.bind(
														null,
														item.id,
														active ? "INACTIVE" : "ACTIVE",
													)}
												>
													<Button type="submit" size="xs" variant="plain">
														{active ? "Inactivate" : "Activate"}
													</Button>
												</form>
												<DeleteItemButton
													id={item.id}
													label={`${item.category}, ${item.technique}`}
												/>
											</HStack>
										</Table.Cell>
									</Table.Row>
								);
							})}
						</Table.Body>
					</Table.Root>
				</Table.ScrollArea>
			)}
		</Flex>
	);
}
