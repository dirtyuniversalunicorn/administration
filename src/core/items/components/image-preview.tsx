"use client";

import { HoverCard, IconButton, Image, Portal } from "@chakra-ui/react";
import { LuImage } from "react-icons/lu";

/**
 * Image icon with a large preview card on hover. The card is rendered in a
 * portal, so the table's scroll area can never clip it.
 */
export function ImagePreview({ src, alt }: { src: string; alt: string }) {
	return (
		<HoverCard.Root
			openDelay={80}
			closeDelay={80}
			positioning={{ placement: "right-start" }}
		>
			<HoverCard.Trigger asChild>
				<IconButton
					aria-label={`Preview of ${alt}`}
					size="xs"
					variant="outline"
				>
					<LuImage />
				</IconButton>
			</HoverCard.Trigger>
			<Portal>
				<HoverCard.Positioner>
					<HoverCard.Content p="2" w="32rem" maxW="60vw">
						<Image
							src={src}
							alt={alt}
							w="full"
							maxH="70vh"
							objectFit="contain"
							rounded="sm"
						/>
					</HoverCard.Content>
				</HoverCard.Positioner>
			</Portal>
		</HoverCard.Root>
	);
}
