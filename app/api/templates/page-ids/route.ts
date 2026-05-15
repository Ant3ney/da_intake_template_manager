import { listPrintableTemplates } from "@/lib/printable-templates/store";

export async function GET() {
  const templates = await listPrintableTemplates();

  return Response.json({
    pageIds: templates.map((template) => template.pageId),
    templates: templates.map((template) => ({
      pageId: template.pageId,
      name: template.name,
      inputCount: template.inputDefinitions.length,
      updatedAt: template.updatedAt,
    })),
  });
}
