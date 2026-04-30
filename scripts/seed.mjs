import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

const { patientIntakeTemplate } = await import("../lib/printable-templates/patient-intake-template.ts");
const now = new Date().toISOString();
const templates = [{ ...patientIntakeTemplate, updatedAt: now }];

const dataDir = path.join(process.cwd(), "data");
await mkdir(dataDir, { recursive: true });
await writeFile(path.join(dataDir, "printable-templates.json"), `${JSON.stringify(templates, null, 2)}\n`);
console.log("[seed] Wrote data/printable-templates.json with sample PrintableTemplate entries.");
