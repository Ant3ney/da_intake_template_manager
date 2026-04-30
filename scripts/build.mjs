import { spawnSync } from "node:child_process";
import { existsSync } from "node:fs";
import path from "node:path";

function run(label, command, args, cwd = process.cwd()) {
  console.log(`[build] building ${label}: ${command} ${args.join(" ")}`);
  const result = spawnSync(command, args, { cwd, stdio: "inherit", shell: process.platform === "win32" });
  if (result.status !== 0) {
    console.error(`[build] ${label} failed with code ${result.status}`);
    process.exit(result.status ?? 1);
  }
}

run("Next.js", "next", ["build"]);

const strapiDir = path.join(process.cwd(), "strapi");
if (existsSync(path.join(strapiDir, "package.json"))) {
  run("Strapi", "npm", ["run", "build"], strapiDir);
} else {
  console.log("[build] Strapi project not found at ./strapi; skipped Strapi build.");
}
