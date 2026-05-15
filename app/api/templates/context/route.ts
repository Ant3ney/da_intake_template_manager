import { buildPrintableTemplateContext } from "@/lib/printable-templates/context";
import { getPrintableTemplateByIdentifier } from "@/lib/printable-templates/store";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const identifier = url.searchParams.get("identifier") ?? url.searchParams.get("pageId") ?? "";
  const template = await getPrintableTemplateByIdentifier(identifier);

  if (!template) {
    return Response.json(
      {
        error: "PrintableTemplate not found.",
        acceptedQueryParams: ["identifier", "pageId"],
      },
      { status: 404 },
    );
  }

  return Response.json(buildPrintableTemplateContext(template));
}
