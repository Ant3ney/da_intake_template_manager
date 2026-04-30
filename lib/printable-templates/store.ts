import { promises as fs } from "fs";
import path from "path";
import { defaultPlaceholderForInput } from "./placeholders";
import { samplePrintableTemplates } from "./sample";
import type { PrintableTemplate, TemplateInputDefinition } from "./types";

const dataPath = path.join(process.cwd(), "data", "printable-templates.json");

function withInputPlaceholder(input: TemplateInputDefinition): TemplateInputDefinition {
  return {
    ...input,
    placeholderText: input.placeholderText?.trim() || defaultPlaceholderForInput(input.typeId, input.label),
  };
}

function withTemplateInputPlaceholders(template: PrintableTemplate): PrintableTemplate {
  return {
    ...template,
    inputDefinitions: template.inputDefinitions.map(withInputPlaceholder),
  };
}

async function readSeededTemplates(): Promise<PrintableTemplate[]> {
  try {
    const raw = await fs.readFile(dataPath, "utf8");
    return (JSON.parse(raw) as PrintableTemplate[]).map(withTemplateInputPlaceholders);
  } catch {
    return samplePrintableTemplates.map(withTemplateInputPlaceholders);
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
    withTemplateInputPlaceholders(entry.attributes ?? entry)
  );
}

export async function getPrintableTemplate(pageId: string): Promise<PrintableTemplate | null> {
  const templates = await listPrintableTemplates();
  return templates.find((template) => template.pageId === pageId) ?? null;
}

export async function saveSeededTemplates(templates: PrintableTemplate[]) {
  await fs.mkdir(path.dirname(dataPath), { recursive: true });
  await fs.writeFile(
    dataPath,
    `${JSON.stringify(templates.map(withTemplateInputPlaceholders), null, 2)}\n`,
    "utf8",
  );
}
