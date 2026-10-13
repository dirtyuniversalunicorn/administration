"use client";

import { useState } from "react";
import { authClient } from "@/src/lib/auth-client";
import { appConfig } from "@/src/core/config/appConfig";

const input = "w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm";

export function LoginForm() {
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    setPending(true);
    setError("");
    const { error } = await authClient.signIn.email({
      email: String(data.get("email")),
      password: String(data.get("password")),
    });
    if (error) {
      setError(error.message ?? "Login failed.");
      setPending(false);
      return;
    }
    window.location.href = appConfig.routes.home;
  }

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-4">
      <input className={input} name="email" type="email" placeholder="Email" required />
      <input className={input} name="password" type="password" placeholder="Password" required />
      <button
        className="rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white disabled:opacity-50"
        disabled={pending}
      >
        {pending ? "Signing in..." : "Sign in"}
      </button>
      {error && <p className="text-sm text-red-600">{error}</p>}
    </form>
  );
}
