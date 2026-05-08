import { renderTemplatePng } from "@/lib/printable-templates/renderers";
import { getPrintableTemplate } from "@/lib/printable-templates/store";
import type { TemplatePageRenderRequest } from "@/lib/printable-templates/types";

export async function POST(request: Request) {
  const body = (await request.json()) as TemplatePageRenderRequest;
  const template = await getPrintableTemplate(body.pageId);
  if (!template) {
    return Response.json({ error: `PrintableTemplate not found for pageId ${body.pageId}` }, { status: 404 });
  }

  return new Response(new Uint8Array(await renderTemplatePng(template, body.inputValues ?? [])), {
    headers: {
      "Content-Type": "image/png",
      "Content-Disposition": `inline; filename="${template.pageId}.png"`,
    },
  });
}
