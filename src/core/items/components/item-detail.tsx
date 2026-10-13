"use client";

import { DataList, Image, Link, Stack } from "@chakra-ui/react";
import { appConfig } from "@/core/config/appConfig";

export type ItemDetailData = {
	category: string;
	technique: string;
	imageUrl: string;
	status: "ACTIVE" | "INACTIVE";
	postedBy: string;
	created: string;
	edited: string;
};

export function ItemDetail({ item }: { item: ItemDetailData }) {
	const rows: [string, string][] = [
		["Category", item.category],
		["Technique", item.technique],
		["Status", item.status === "ACTIVE" ? "Active" : "Inactive"],
		["Posted by", item.postedBy],
		["Created", item.created],
		["Edited", item.edited],
	];

	return (
		<Stack gap="6">
			<Link href={appConfig.routes.items} color="fg.muted" fontSize="sm">
				← All items
			</Link>
			<Image
				src={item.imageUrl}
				alt={`${item.category}, ${item.technique}`}
				w="full"
				rounded="md"
				borderWidth="1px"
			/>
			<DataList.Root orientation="horizontal">
				{rows.map(([label, value]) => (
					<DataList.Item key={label}>
						<DataList.ItemLabel>{label}</DataList.ItemLabel>
						<DataList.ItemValue textTransform="capitalize">
							{value}
						</DataList.ItemValue>
					</DataList.Item>
				))}
			</DataList.Root>
		</Stack>
	);
}
