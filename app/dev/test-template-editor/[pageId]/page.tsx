import { notFound } from "next/navigation";
import { TemplateEditor } from "@/components/TemplateEditor";
import { getPrintableTemplate } from "@/lib/printable-templates/store";

export default async function TestTemplateEditorPage({
  params,
}: {
  params: Promise<{ pageId: string }>;
}) {
  const { pageId } = await params;
  const template = await getPrintableTemplate(pageId);

  if (!template) {
    notFound();
  }

  return <TemplateEditor initialTemplate={template} />;
}

