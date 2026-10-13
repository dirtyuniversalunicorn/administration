/**
 * Cookie that remembers whether the sidebar is collapsed. Lives in its own
 * (non-client) module because the server layout reads it: a constant exported
 * from a "use client" file reaches server code as a reference, not a string.
 */
export const SIDEBAR_COOKIE = "sidebar-collapsed";
