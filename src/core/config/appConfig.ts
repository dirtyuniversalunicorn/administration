export const appConfig = {
  site: {
    name: "Administration",
    description: "Admin console",
    locale: "en",
  },

  routes: {
    /** Public landing page with the login form. */
    login: "/",
    /** Where an authenticated user lands after login. */
    home: "/dashboard",
    users: "/dashboard/users",
  },

  auth: {
    /**
     * Page path prefixes that require a session. Anything starting with one of
     * these (e.g. "/dashboard" and "/dashboard/users") redirects to
     * `routes.login` when there is no session cookie.
     */
    protectedPaths: ["/dashboard"],
    minPasswordLength: 8,
  },

  api: {
    /**
     * Anonymous (no login) API access, used by the client-facing app.
     * A trailing "/*" matches the whole subtree, otherwise the path is exact.
     * Every /api path NOT listed here needs a session cookie (admin only).
     * `cors: true` adds CORS headers so the client app's origin can call it.
     */
    public: [
      { path: "/api/auth/*", methods: ["GET", "POST"], cors: false }, // Better Auth does its own checks
      { path: "/api/subscribe/add", methods: ["POST"], cors: true },
      // Opened from links inside emails (plain browser navigation, no CORS needed).
      { path: "/api/subscribe/confirm", methods: ["GET"], cors: false },
      { path: "/api/subscribe/delete", methods: ["GET"], cors: false }, // unsubscribe
      { path: "/api/collection/get", methods: ["GET"], cors: true },
      { path: "/api/item/get", methods: ["GET"], cors: true },
    ] as { path: string; methods: string[]; cors: boolean }[],

    /** Always rejected (403), even with a session. Wins over `public`. */
    blocked: [] as string[],

    cors: {
      /** Origins of the client-facing app(s). "*" allows any origin. */
      allowedOrigins: ["*"],
      allowedHeaders: ["Content-Type"],
      maxAgeSeconds: 86400,
    },
  },

  subscription: {
    /**
     * Feature flag. false = subscriptions are off: every /api/subscribe/* route
     * answers 404, no subscription code runs and no email is sent.
     * (`as boolean` keeps TypeScript from narrowing the flag to the literal `false`.)
     */
    isEnabled: false as boolean,
    /** API path prefix owned by this feature; hidden entirely while disabled. */
    apiPrefix: "/api/subscribe",
    /**
     * Client-facing app. After a visitor clicks a link in an email they are sent
     * to `${clientAppUrl}${resultPath}?status=confirmed|unsubscribed|invalid`.
     * Override per environment with the CLIENT_APP_URL variable.
     */
    clientAppUrl: "http://localhost:3001",
    resultPath: "/subscription",
    confirmTtlHours: 48,
    /** Re-submitting a PENDING email within this window does not send another mail. */
    resendCooldownSeconds: 60,
  },

  email: {
    /** Must be an address on a domain verified with the email provider. */
    from: "Administration <no-reply@example.com>",
    confirmSubject: "Please confirm your subscription",
  },

  nav: [
    { label: "Dashboard", href: "/dashboard" },
    { label: "Users", href: "/dashboard/users" },
  ],
} as const;

export type AppConfig = typeof appConfig;
