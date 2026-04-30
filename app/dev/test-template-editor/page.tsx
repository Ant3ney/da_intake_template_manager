import { TemplateEditor } from "@/components/TemplateEditor";
import { listPrintableTemplates } from "@/lib/printable-templates/store";

export default async function TestTemplateEditorPage() {
  const templates = await listPrintableTemplates();
  return <TemplateEditor initialTemplate={templates[0]} />;
}
