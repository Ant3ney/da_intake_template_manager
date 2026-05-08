import { renderTemplatePng, toRenderedDocument } from "@/lib/printable-templates/renderers";
import { listPrintableTemplates } from "@/lib/printable-templates/store";

export async function GET() {
  const templates = await listPrintableTemplates();
  const documents = await Promise.all(
    templates.map(async (template) => toRenderedDocument(template, "image/png", await renderTemplatePng(template))),
  );
  return Response.json(documents);
}
