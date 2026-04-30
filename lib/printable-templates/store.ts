import { promises as fs } from "fs";
import path from "path";
import { samplePrintableTemplates } from "./sample";
import type { PrintableTemplate } from "./types";

const dataPath = path.join(process.cwd(), "data", "printable-templates.json");

async function readSeededTemplates(): Promise<PrintableTemplate[]> {
  try {
    const raw = await fs.readFile(dataPath, "utf8");
    const templates = JSON.parse(raw) as PrintableTemplate[];
    return templates.map((template) =>
      template.pageId === "patient-intake-form" ? samplePrintableTemplates[0] : template
    );
  } catch {
    return samplePrintableTemplates;
  }
}

export async function listPrintableTemplates(): Promise<PrintableTemplate[]> {
  const strapiUrl = process.env.STRAPI_API_URL;
  if (!strapiUrl) {
    return readSeededTemplates();
  }

  const response = await fetch(`${strapiUrl.replace(/\/$/, "")}/api/printable-templates`, {
    headers: process.env.STRAPI_API_TOKEN
      ? { Authorization: `Bearer ${process.env.STRAPI_API_TOKEN}` }
      : undefined,
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(`Strapi printable-template fetch failed: ${response.status}`);
  }

  const payload = await response.json();
  return (payload.data ?? []).map((entry: { attributes?: PrintableTemplate } & PrintableTemplate) =>
    entry.attributes ?? entry
  );
}

export async function getPrintableTemplate(pageId: string): Promise<PrintableTemplate | null> {
  const templates = await listPrintableTemplates();
  return templates.find((template) => template.pageId === pageId) ?? null;
}

export async function saveSeededTemplates(templates: PrintableTemplate[]) {
  await fs.mkdir(path.dirname(dataPath), { recursive: true });
  await fs.writeFile(dataPath, `${JSON.stringify(templates, null, 2)}\n`, "utf8");
}
