import type { Metadata } from "next";
import { appConfig } from "@/src/core/config/appConfig";
import "./globals.css";

export const metadata: Metadata = {
  title: appConfig.site.name,
  description: appConfig.site.description,
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang={appConfig.site.locale}>
      <body>{children}</body>
    </html>
  );
}
