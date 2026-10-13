"use client";

import { Box, Container, Flex, HStack, Link, Text } from "@chakra-ui/react";
import type { ReactNode } from "react";
import { SignOutButton } from "@/core/auth/components/sign-out-button";
import { appConfig } from "@/core/config/appConfig";

/** Top bar (navigation, current user, sign out) and the content container. */
export function DashboardShell({
	email,
	children,
}: {
	email: string;
	children: ReactNode;
}) {
	return (
		<Box minH="100vh">
			<Flex
				as="header"
				align="center"
				justify="space-between"
				px="6"
				py="3"
				borderBottomWidth="1px"
				bg="bg.panel"
			>
				<HStack as="nav" gap="5" fontSize="sm" fontWeight="medium">
					{appConfig.nav.map((item) => (
						<Link key={item.href} href={item.href} variant="plain">
							{item.label}
						</Link>
					))}
				</HStack>
				<HStack gap="3" fontSize="sm">
					<Text color="fg.muted">{email}</Text>
					<SignOutButton />
				</HStack>
			</Flex>
			<Container as="main" maxW="5xl" px="6" py="10">
				{children}
			</Container>
		</Box>
	);
}
