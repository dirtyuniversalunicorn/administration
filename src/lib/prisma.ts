import { env } from "cloudflare:workers";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../generated/prisma/client";

// Cloudflare Workers can't reuse a database connection across requests (the
// request that opened it owns the I/O; reusing it elsewhere hangs and the
// runtime cancels the request). So build a fresh client + pool on each use
// instead of one module-level singleton. Hyperdrive pools the real connections
// on Cloudflare's side, so a new client per use stays cheap.
function createClient() {
  const adapter = new PrismaPg({ connectionString: env.HYPERDRIVE.connectionString, max: 1 });
  return new PrismaClient({ adapter });
}

const prisma = new Proxy({} as PrismaClient, {
  get(_target, prop) {
    const client = createClient();
    const value = Reflect.get(client, prop);
    return typeof value === "function" ? value.bind(client) : value;
  },
});

export { prisma };
