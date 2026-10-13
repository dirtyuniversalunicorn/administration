"use client";

import { Heading, Link, Stack, type StackProps } from "@chakra-ui/react";
import type { ReactNode } from "react";

/*
 * Chakra must only be imported from client components: when a server component
 * imports it, the RSC dev server loads a second, raw copy of the package in the
 * browser, which has its own React context and crashes hydration ("forgot to
 * wrap component within ChakraProvider"). Server pages use these wrappers instead.
 */

export function PageStack(props: StackProps) {
	return <Stack gap="6" {...props} />;
}

export function PageTitle({ children }: { children: ReactNode }) {
	return (
		<Heading as="h1" size="2xl">
			{children}
		</Heading>
	);
}

export function SectionTitle({ children }: { children: ReactNode }) {
	return (
		<Heading as="h2" size="xl">
			{children}
		</Heading>
	);
}

export function BackLink({
	href,
	children,
}: {
	href: string;
	children: ReactNode;
}) {
	return (
		<Link href={href} color="fg.muted" fontSize="sm">
			{children}
		</Link>
	);
}
