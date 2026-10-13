"use client";

import { usePathname } from "next/navigation";
import { type ReactNode, useState } from "react";
import { SignOutButton } from "@/src/core/auth/components/sign-out-button";
import { appConfig } from "@/src/core/config/appConfig";
import { SIDEBAR_COOKIE } from "./sidebar-cookie";

type NavIcon = (typeof appConfig.nav)[number]["icon"];

/** 20px outline icon. Decorative: the link or button next to it carries the label. */
function Icon({ children }: { children: ReactNode }) {
	return (
		<svg
			viewBox="0 0 24 24"
			className="h-5 w-5 shrink-0"
			fill="none"
			stroke="currentColor"
			strokeWidth="2"
			strokeLinecap="round"
			strokeLinejoin="round"
			aria-hidden="true"
		>
			{children}
		</svg>
	);
}

const icons: Record<NavIcon, ReactNode> = {
	dashboard: (
		<Icon>
			<path d="m3 10 9-7 9 7v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
			<path d="M9 22V12h6v10" />
		</Icon>
	),
	items: (
		<Icon>
			<rect x="3" y="3" width="18" height="18" rx="2" />
			<circle cx="9" cy="9" r="2" />
			<path d="m21 15-5-5L5 21" />
		</Icon>
	),
	users: (
		<Icon>
			<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
			<circle cx="9" cy="7" r="4" />
			<path d="M22 21v-2a4 4 0 0 0-3-3.87" />
			<path d="M16 3.13a4 4 0 0 1 0 7.75" />
		</Icon>
	),
	contact: (
		<Icon>
			<rect x="2" y="4" width="20" height="16" rx="2" />
			<path d="m22 7-10 6L2 7" />
		</Icon>
	),
};

function isActive(pathname: string, href: string) {
	// The dashboard home must match exactly, or it would light up on every page.
	if (href === appConfig.routes.home) return pathname === href;
	return pathname === href || pathname.startsWith(`${href}/`);
}

/** Collapsible left sidebar (navigation, user, sign out) and the centered content area. */
export function DashboardShell({
	email,
	defaultCollapsed,
	children,
}: {
	email: string;
	defaultCollapsed: boolean;
	children: ReactNode;
}) {
	const pathname = usePathname();
	const [collapsed, setCollapsed] = useState(defaultCollapsed);

	function toggle() {
		const next = !collapsed;
		setCollapsed(next);
		// biome-ignore lint/suspicious/noDocumentCookie: Cookie Store API is not available in every browser
		document.cookie = `${SIDEBAR_COOKIE}=${next ? "1" : "0"}; path=/; max-age=31536000; samesite=lax`;
	}

	return (
		<div className="flex min-h-screen bg-background text-foreground">
			<aside
				className={`sticky top-0 flex h-screen shrink-0 flex-col border-r border-line bg-surface transition-[width] duration-200 ${
					collapsed ? "w-16" : "w-60"
				}`}
			>
				<div
					className={`flex h-14 items-center border-b border-line px-3 ${
						collapsed ? "justify-center" : "justify-between"
					}`}
				>
					{!collapsed && (
						<span className="truncate px-1 font-semibold">
							{appConfig.site.name}
						</span>
					)}
					<button
						type="button"
						onClick={toggle}
						aria-expanded={!collapsed}
						aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
						title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
						className="rounded-md p-2 text-muted hover:bg-background hover:text-foreground"
					>
						<Icon>
							<rect x="3" y="3" width="18" height="18" rx="2" />
							<path d="M9 3v18" />
							<path d={collapsed ? "m14 9 3 3-3 3" : "m16 9-3 3 3 3"} />
						</Icon>
					</button>
				</div>

				<nav
					aria-label="Main"
					className="flex flex-1 flex-col gap-1 overflow-y-auto p-2"
				>
					{appConfig.nav.map((item) => {
						const active = isActive(pathname, item.href);
						return (
							<a
								key={item.href}
								href={item.href}
								title={item.label}
								aria-current={active ? "page" : undefined}
								className={`flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium ${
									active
										? "bg-primary text-primary-foreground"
										: "text-muted hover:bg-background hover:text-foreground"
								}`}
							>
								{icons[item.icon]}
								{!collapsed && <span className="truncate">{item.label}</span>}
							</a>
						);
					})}
				</nav>

				<div className="border-t border-line p-2">
					{!collapsed && (
						<p className="truncate px-3 py-1 text-xs text-muted" title={email}>
							{email}
						</p>
					)}
					<SignOutButton collapsed={collapsed} />
				</div>
			</aside>

			<main className="min-w-0 flex-1">
				<div className="mx-auto w-full max-w-5xl px-6 py-10">{children}</div>
			</main>
		</div>
	);
}
