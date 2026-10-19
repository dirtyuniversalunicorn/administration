/*
 * Roles and what they may do. Pure (no server-only imports), so pages and
 * client components can use it to hide controls; the API routes enforce it
 * with requirePermission() in core/api.ts.
 *
 *   USER    read only
 *   EDITOR  read, create, edit (including activate / inactivate content)
 *   ADMIN   everything: delete content, manage users and roles
 */

export const roles = ["ADMIN", "EDITOR", "USER"] as const;

export type Role = (typeof roles)[number];

/** "write" = create, edit and change status of content. "delete" = delete content. "users" = create users, change their status and role. */
export type Permission = "write" | "delete" | "users";

const grants: Record<Role, readonly Permission[]> = {
	ADMIN: ["write", "delete", "users"],
	EDITOR: ["write"],
	USER: [],
};

export const roleLabel: Record<Role, string> = { ADMIN: "Admin", EDITOR: "Editor", USER: "User" };

/** Whether a role may do something. An unknown or missing role may do nothing. */
export function can(role: string | null | undefined, permission: Permission): boolean {
	return !!role && role in grants && grants[role as Role].includes(permission);
}
