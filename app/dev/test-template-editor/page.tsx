import { redirect } from "next/navigation";
import { listPrintableTemplates } from "@/lib/printable-templates/store";

export default async function TestTemplateEditorPage() {
  const templates = await listPrintableTemplates();

  if (!templates[0]) {
    return null;
  }

  redirect(`/dev/test-template-editor/${encodeURIComponent(templates[0].pageId)}`);
}
