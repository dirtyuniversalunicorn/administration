import { createAuthClient } from "better-auth/react";

// Same-origin: baseURL is inferred, so it works in dev and in production.
export const authClient = createAuthClient();
