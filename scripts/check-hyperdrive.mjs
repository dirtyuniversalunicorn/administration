// Verifies that the Hyperdrive config used by this Worker has query caching
// DISABLED. With caching on, Hyperdrive serves stale SELECT results for up to
// ~75s after a write (and Better Auth session lookups too), so admin actions
// look like they did nothing. See README.md, "Hyperdrive: keep caching off".
//
// Usage:
//   npm run check:hyperdrive               fails only if caching is confirmed ON
//   npm run check:hyperdrive -- --strict   also fails if the check could not run
//   npm run check:hyperdrive -- --fix      turns caching off (changes your Cloudflare account)
import { execFileSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";

const args = new Set(process.argv.slice(2));
const root = fileURLToPath(new URL("..", import.meta.url));

/** Removes // and /* *​/ comments from JSONC without touching strings (URLs contain //). */
function stripJsonComments(text) {
	let out = "";
	let i = 0;
	while (i < text.length) {
		const c = text[i];
		const next = text[i + 1];
		if (c === '"') {
			let j = i + 1;
			while (j < text.length && text[j] !== '"') j += text[j] === "\\" ? 2 : 1;
			out += text.slice(i, j + 1);
			i = j + 1;
		} else if (c === "/" && next === "/") {
			while (i < text.length && text[i] !== "\n") i++;
		} else if (c === "/" && next === "*") {
			i = text.indexOf("*/", i + 2);
			i = i === -1 ? text.length : i + 2;
		} else {
			out += c;
			i++;
		}
	}
	return out.replace(/,(\s*[}\]])/g, "$1"); // trailing commas
}

function wrangler(...wranglerArgs) {
	return execFileSync(
		process.execPath,
		["node_modules/wrangler/bin/wrangler.js", ...wranglerArgs],
		{ cwd: root, encoding: "utf8", stdio: ["ignore", "pipe", "pipe"] },
	);
}

function cannotCheck(reason) {
	console.warn(`! Could not check Hyperdrive caching: ${reason}`);
	process.exit(args.has("--strict") ? 2 : 0);
}

const config = JSON.parse(stripJsonComments(readFileSync(`${root}wrangler.jsonc`, "utf8")));
const bindings = config.hyperdrive ?? [];
if (bindings.length === 0) cannotCheck("no hyperdrive binding in wrangler.jsonc");

let failed = false;
for (const { binding, id } of bindings) {
	let info;
	try {
		const output = wrangler("hyperdrive", "get", id);
		info = JSON.parse(output.slice(output.indexOf("{"), output.lastIndexOf("}") + 1));
	} catch (error) {
		cannotCheck(`${binding} (${id}): ${String(error.stderr || error.message).split("\n")[0]}`);
	}

	if (info.caching?.disabled === true) {
		console.log(`OK  ${binding} (${id}): caching is disabled.`);
		continue;
	}

	if (args.has("--fix")) {
		wrangler("hyperdrive", "update", id, "--caching-disabled=true");
		console.log(`FIXED ${binding} (${id}): caching is now disabled.`);
		continue;
	}

	failed = true;
	console.error(
		`FAIL ${binding} (${id}): caching is ENABLED, so reads can be stale for ~75s after a write.\n` +
			`     Fix: npx wrangler hyperdrive update ${id} --caching-disabled=true\n` +
			"     or:  npm run check:hyperdrive -- --fix",
	);
}
process.exit(failed ? 1 : 0);
