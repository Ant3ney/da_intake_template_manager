import { listPrintableTemplates } from "@/lib/printable-templates/store";

export async function GET() {
  const templates = await listPrintableTemplates();
  return Response.json(
    templates.map((template) => ({
      pageId: template.pageId,
      inputs: template.inputDefinitions,
    })),
  );
}
