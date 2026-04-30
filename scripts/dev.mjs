import { spawn } from "node:child_process";
import { existsSync } from "node:fs";
import path from "node:path";

const children = [];

function run(label, command, args, cwd = process.cwd()) {
  console.log(`[dev] starting ${label}: ${command} ${args.join(" ")}`);
  const child = spawn(command, args, { cwd, stdio: "inherit", shell: process.platform === "win32" });
  children.push(child);
  child.on("exit", (code) => {
    if (code && code !== 0) {
      console.error(`[dev] ${label} exited with code ${code}`);
      process.exitCode = code;
    }
  });
}

run("Next.js", "next", ["dev"]);

const strapiDir = path.join(process.cwd(), "strapi");
if (existsSync(path.join(strapiDir, "package.json"))) {
  run("Strapi", "npm", ["run", "develop"], strapiDir);
} else {
  console.log("[dev] Strapi project not found at ./strapi; using seeded local PrintableTemplate store.");
}

process.on("SIGINT", () => {
  for (const child of children) child.kill("SIGINT");
  process.exit();
});
