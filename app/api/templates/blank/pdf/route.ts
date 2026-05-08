import { renderTemplatePdf, toRenderedDocument } from "@/lib/printable-templates/renderers";
import { listPrintableTemplates } from "@/lib/printable-templates/store";

export async function GET() {
  const templates = await listPrintableTemplates();
  const documents = await Promise.all(
    templates.map(async (template) => toRenderedDocument(template, "application/pdf", await renderTemplatePdf(template))),
  );
  return Response.json(documents);
}
