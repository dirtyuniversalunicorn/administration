"use client";

import { ChakraProvider } from "@chakra-ui/react";
import { useMemo } from "react";
import type { ThemeColors } from "@/core/config/appConfig";
import { ColorModeProvider, type ColorModeProviderProps } from "./color-mode";
import { createAppSystem } from "./system";

type Props = ColorModeProviderProps & { colors: ThemeColors };

export function Provider({ colors, ...props }: Props) {
	const system = useMemo(() => createAppSystem(colors), [colors]);

	return (
		<ChakraProvider value={system}>
			<ColorModeProvider {...props} />
		</ChakraProvider>
	);
}
