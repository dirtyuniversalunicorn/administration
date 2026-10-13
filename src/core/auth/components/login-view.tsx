"use client";

import { Card, Center } from "@chakra-ui/react";
import { LoginForm } from "./login-form";

/** Centered sign-in card for the landing page. */
export function LoginView() {
	return (
		<Center minH="100vh" px="6">
			<Card.Root w="full" maxW="sm" bg="bg.panel">
				<Card.Header>
					<Card.Title>Sign in</Card.Title>
				</Card.Header>
				<Card.Body>
					<LoginForm />
				</Card.Body>
			</Card.Root>
		</Center>
	);
}
