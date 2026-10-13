import { Box, Container, Flex, HStack, Link, Text } from "@chakra-ui/react";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { SignOutButton } from "@/core/auth/components/sign-out-button";
import { appConfig } from "@/core/config/appConfig";
import { auth } from "@/lib/auth";

export default async function DashboardLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	const session = await auth.api.getSession({ headers: await headers() });
	if (!session) redirect(appConfig.routes.login);

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
					<Text color="fg.muted">{session.user.email}</Text>
					<SignOutButton />
				</HStack>
			</Flex>
			<Container as="main" maxW="5xl" px="6" py="10">
				{children}
			</Container>
		</Box>
	);
}
