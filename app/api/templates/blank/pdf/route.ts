import { renderTemplatePdf, toRenderedDocument } from "@/lib/printable-templates/renderers";
import { listPrintableTemplates } from "@/lib/printable-templates/store";

export async function GET() {
  const templates = await listPrintableTemplates();
  return Response.json(
    templates.map((template) => toRenderedDocument(template, "application/pdf", renderTemplatePdf(template))),
  );
}
