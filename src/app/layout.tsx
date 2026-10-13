import type { Metadata } from "next";
import { Provider } from "@/components/ui/provider";
import { appConfig } from "@/core/config/appConfig";
import { getThemeColors } from "@/core/config/theme";

export const metadata: Metadata = {
	title: appConfig.site.name,
	description: appConfig.site.description,
};

export default function RootLayout({
	children,
}: Readonly<{ children: React.ReactNode }>) {
	return (
		<html lang={appConfig.site.locale} suppressHydrationWarning>
			<body>
				{/* Themes are light-only for now, so dark mode is switched off. */}
				<Provider
					colors={getThemeColors()}
					forcedTheme="light"
					defaultTheme="light"
				>
					{children}
				</Provider>
			</body>
		</html>
	);
}
