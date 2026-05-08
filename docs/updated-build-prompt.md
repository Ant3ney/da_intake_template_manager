# Updated Build Prompt

This prompt reflects the new image-backed PrintableTemplate architecture.

```text
Build inside an existing Next.js App Router project. This project uses a newer Next.js version with changed conventions, so read the relevant local docs in node_modules/next/dist/docs before changing routing, page props, route handlers, or caching behavior.

The system is a Printable Intake Template Manager for fixed-layout printable intake documents. The core entity is PrintableTemplate. A PrintableTemplate is a single-page letter-sized printable document backed by a static image plus editable coordinate-based input overlays.

Do not convert intake form images into recreated HTML/CSS/JS templates. The incoming form image is the static printable background.

A PrintableTemplate must include:
- pageId: stable unique identifier.
- name: display name.
- backgroundImage: { src, widthPx, heightPx, mimeType }.
- inputDefinitions: TemplateInputDefinition[].
- layoutSettings: paper size and dimensions, currently letter 8.5 x 11.
- displaySettings: base display options such as background color.
- sourceAssetPath: optional source/permanent asset path.
- updatedAt: ISO timestamp.

html, css, and javascript may exist only as optional legacy fields. New templates should not rely on them.

Incoming template images are placed in ai_context/inbox_template. This is only an inbox. When a new image is added, copy it into a permanent app-served asset location such as public/template-assets. PrintableTemplate.backgroundImage.src must point at the permanent asset, not ai_context/inbox_template.

The dashboard at / must list every available base template. Each base template must have an obvious button or full-row link that opens the template in the editor at /dev/test-template-editor/[pageId]. The dashboard must render dynamically so new local templates are visible without static-page caching hiding them.

The editor is called TemplateEditor. It places TemplateInputOverlays over the template background image. Overlay geometry must be stored as percentages in TemplateInputBounds:
- xPercent
- yPercent
- widthPercent
- heightPercent

The editor must support:
- Adding inputs.
- Removing selected inputs.
- Selecting inputs.
- Dragging overlays.
- Resizing overlays.
- Numeric bounds editing.
- Label editing.
- Placeholder editing.
- Type editing.
- Font size editing.
- Date format editing.
- White background toggle.
- Checkbox/radio check option editing.
- Checkbox/radio "Other" option editing with separate text box bounds.
- Saving the edited template.
- Opening rendered PDF and PNG previews.

Supported TemplateInputTypeId values:
- textArea
- textLine
- date
- phoneNumber
- firstName
- lastName
- email
- number
- checkbox
- radio
- signature
- initials

The visual rule is strict: what the admin sees in TemplateEditor must match what appears in rendered PDF and PNG output. The editor, PDF renderer, and PNG renderer must use the same background image and the same percentage overlay bounds.

Data should be served through a repository layer. If STRAPI_API_URL is set, templates are read from Strapi. If it is not set, templates are read from data/printable-templates.json. If the local JSON file is missing, use the template catalog fallback.

The Strapi collection type is printable-template. It should store pageId, name, backgroundImage, inputDefinitions, layoutSettings, displaySettings, sourceAssetPath, and updatedAt.

API routes:
- GET /api/templates returns all PrintableTemplates.
- PUT /api/templates upserts one PrintableTemplate into the local JSON store.
- GET /api/templates/schema returns TemplateInputSchema[] for all templates.
- GET /api/templates/[pageId]/schema returns TemplateInputSchema for one template.
- POST /api/templates/render/pdf returns a single completed PDF for a pageId and inputValues.
- POST /api/templates/render/png returns a single completed PNG for a pageId and inputValues.
- POST /api/templates/render-batch/pdf returns an array of rendered PDF documents.
- POST /api/templates/render-batch/png returns an array of rendered PNG documents.
- GET /api/templates/blank/pdf returns all blank template PDFs as base64 JSON documents.
- GET /api/templates/blank/png returns all blank template PNGs as base64 JSON documents.

Render requests use:
{
  "pageId": "template-id",
  "inputValues": [
    { "inputId": "name", "value": "Example" }
  ]
}

For each new template:
1. Inspect ai_context/inbox_template for the incoming image.
2. Copy the image into public/template-assets with a stable filename.
3. Create or update a template module in lib/printable-templates/templates.
4. Set backgroundImage metadata to the permanent image path and dimensions.
5. Add initial inputDefinitions for visible blanks.
6. Register the template in lib/printable-templates/templates/index.ts.
7. Run npm run seed or otherwise update data/printable-templates.json.
8. Verify the template appears on the dashboard.
9. Verify the template opens in the editor.
10. Verify /api/templates/[pageId]/schema returns expected inputs.
11. Verify POST /api/templates/render/pdf and POST /api/templates/render/png use the background image plus overlays.

Testing requirements:
- npm run lint must pass.
- npm run build must pass.
- The template must appear on the dashboard.
- The editor preview image must match rendered PDF/PNG background.
- Overlay values must render at the same positions shown in the editor.

Recommended next improvements:
- Add zoom controls.
- Add keyboard nudging.
- Add grid/snap tools.
- Add a background-image replacement workflow.
- Add Strapi write support.
- Add visual regression screenshots for editor/PDF/PNG alignment.
```

