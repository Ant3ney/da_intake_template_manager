import { promises as fs } from "fs";
import path from "path";
import { defaultPlaceholderForInput } from "./placeholders";
import { samplePrintableTemplates } from "./sample";
import type { PrintableTemplate, TemplateInputDefinition } from "./types";

const dataPath = path.join(process.cwd(), "data", "printable-templates.json");

function withInputPlaceholder(input: TemplateInputDefinition): TemplateInputDefinition {
  const checkOptions = input.checkOptions?.map((option) => ({
    ...option,
    textPlaceholderText: option.textPlaceholderText?.trim() || (option.isOtherOption ? "Other" : undefined),
    textBoxBounds:
      option.textBoxBounds ??
      (option.isOtherOption
        ? {
            ...option.bounds,
            xPercent: Math.min(84, option.bounds.xPercent + option.bounds.widthPercent + 1.2),
            widthPercent: 16,
            heightPercent: Math.max(option.bounds.heightPercent, 2.2),
          }
        : undefined),
  }));

  return {
    ...input,
    notes: input.notes ?? "",
    placeholderText: input.placeholderText?.trim() || defaultPlaceholderForInput(input.typeId, input.label),
    checkOptions,
  };
}

export function normalizePrintableTemplate(template: PrintableTemplate): PrintableTemplate {
  return {
    ...template,
    notes: template.notes ?? "",
    inputDefinitions: template.inputDefinitions.map(withInputPlaceholder),
  };
}

async function readSeededTemplates(): Promise<PrintableTemplate[]> {
  try {
    const raw = await fs.readFile(dataPath, "utf8");
    return (JSON.parse(raw) as PrintableTemplate[]).map(normalizePrintableTemplate);
  } catch {
    return samplePrintableTemplates.map(normalizePrintableTemplate);
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
    normalizePrintableTemplate(entry.attributes ?? entry)
  );
}

export async function getPrintableTemplate(pageId: string): Promise<PrintableTemplate | null> {
  const templates = await listPrintableTemplates();
  return templates.find((template) => template.pageId === pageId) ?? null;
}

export async function getPrintableTemplateByIdentifier(identifier: string): Promise<PrintableTemplate | null> {
  const normalizedIdentifier = identifier.trim();
  if (!normalizedIdentifier) return null;

  const templates = await listPrintableTemplates();
  return (
    templates.find(
      (template) =>
        template.pageId === normalizedIdentifier ||
        template.name === normalizedIdentifier ||
        template.backgroundImage.src === normalizedIdentifier ||
        template.sourceAssetPath === normalizedIdentifier,
    ) ?? null
  );
}

export async function saveSeededTemplates(templates: PrintableTemplate[]) {
  await fs.mkdir(path.dirname(dataPath), { recursive: true });
  await fs.writeFile(
    dataPath,
    `${JSON.stringify(templates.map(normalizePrintableTemplate), null, 2)}\n`,
    "utf8",
  );
}
