import Link from "next/link";
import { listPrintableTemplates } from "@/lib/printable-templates/store";

export default async function Home() {
  const templates = await listPrintableTemplates();

  return (
    <main className="home-shell">
      <section className="home-header">
        <p>Printable Intake Template Manager</p>
        <h1>Template schema, overlay editing, and render routes are available for development.</h1>
      </section>
      <section className="home-actions">
        <Link href="/dev/test-template-editor">Open TemplateEditor</Link>
        <a href="/api/templates/schema">View schema JSON</a>
        <a href="/api/templates/blank/png">View blank PNG documents JSON</a>
      </section>
      <section className="template-table">
        {templates.map((template) => (
          <article key={template.pageId}>
            <div>
              <h2>{template.name}</h2>
              <p>{template.pageId}</p>
            </div>
            <span>{template.inputDefinitions.length} inputs</span>
          </article>
        ))}
      </section>
    </main>
  );
}
