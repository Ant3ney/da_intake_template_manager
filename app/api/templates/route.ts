import { listPrintableTemplates, normalizePrintableTemplate, saveSeededTemplates } from "@/lib/printable-templates/store";
import type { PrintableTemplate } from "@/lib/printable-templates/types";

export async function GET() {
  return Response.json(await listPrintableTemplates());
}

export async function PUT(request: Request) {
  const incoming = (await request.json()) as PrintableTemplate;
  const templates = await listPrintableTemplates();
  const index = templates.findIndex((template) => template.pageId === incoming.pageId);
  const updated = normalizePrintableTemplate({ ...incoming, updatedAt: new Date().toISOString() });

  if (index === -1) {
    templates.push(updated);
  } else {
    templates[index] = updated;
  }

  await saveSeededTemplates(templates);
  return Response.json(updated);
}
