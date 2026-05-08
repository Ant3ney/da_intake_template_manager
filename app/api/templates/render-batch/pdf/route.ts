import { renderTemplatePdf, toRenderedDocument } from "@/lib/printable-templates/renderers";
import { getPrintableTemplate } from "@/lib/printable-templates/store";
import type { TemplatePageRenderRequest } from "@/lib/printable-templates/types";

export async function POST(request: Request) {
  const body = (await request.json()) as { pageRenderRequests: TemplatePageRenderRequest[] };
  const documents = [];

  for (const pageRequest of body.pageRenderRequests ?? []) {
    const template = await getPrintableTemplate(pageRequest.pageId);
    if (!template) continue;
    documents.push(
      toRenderedDocument(template, "application/pdf", await renderTemplatePdf(template, pageRequest.inputValues ?? [])),
    );
  }

  return Response.json(documents);
}
