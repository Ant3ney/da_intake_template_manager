import { buildPrintableTemplateContext } from "@/lib/printable-templates/context";
import { getPrintableTemplate } from "@/lib/printable-templates/store";

export async function GET(_request: Request, context: RouteContext<"/api/templates/[pageId]/context">) {
  const { pageId } = await context.params;
  const template = await getPrintableTemplate(pageId);

  if (!template) {
    return Response.json({ error: `PrintableTemplate not found for pageId ${pageId}` }, { status: 404 });
  }

  return Response.json(buildPrintableTemplateContext(template));
}
