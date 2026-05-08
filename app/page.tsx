import Link from "next/link";
import { listPrintableTemplates } from "@/lib/printable-templates/store";

export const dynamic = "force-dynamic";

export default async function Home() {
  const templates = await listPrintableTemplates();

  return (
    <main className="home-shell">
      <section className="home-header">
        <p>Printable Intake Template Manager</p>
        <h1>Template schema, overlay editing, and render routes are available for development.</h1>
      </section>
      <section className="home-actions">
        <a href="/api/templates/schema">View schema JSON</a>
        <a href="/api/templates/blank/png">View blank PNG documents JSON</a>
      </section>
      <section className="template-table">
        <div className="template-table-header">
          <h2>Base templates</h2>
          <p>Select a base template to edit its input overlays.</p>
        </div>
        {templates.map((template) => (
          <Link
            className="template-option"
            href={`/dev/test-template-editor/${encodeURIComponent(template.pageId)}`}
            key={template.pageId}
          >
            <div>
              <h2>{template.name}</h2>
              <p>{template.pageId}</p>
            </div>
            <div className="template-actions">
              <span>{template.inputDefinitions.length} inputs</span>
              <span className="template-edit-button">Edit overlays</span>
            </div>
          </Link>
        ))}
      </section>
    </main>
  );
}
