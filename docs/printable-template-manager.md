# Printable Template Manager Architecture

## Purpose

The Printable Intake Template Manager manages fixed-layout, print-ready intake documents. Each document is represented by a `PrintableTemplate`, which combines:

- Static base image: `backgroundImage`.
- A fixed paper layout: currently letter size, `8.5in x 11in`.
- A list of coordinate-based input overlays: `inputDefinitions`.
- Rendering metadata: `displaySettings`, `sourceAssetPath`, and `updatedAt`.

The system is designed for forms where the printed layout must stay stable, while values can be injected later into named fields.

## Current Project Shape

Key files:

- `app/page.tsx`: dashboard listing every base template.
- `app/dev/test-template-editor/page.tsx`: fallback route that redirects to the first available template.
- `app/dev/test-template-editor/[pageId]/page.tsx`: loads a specific template into the editor.
- `components/TemplateEditor.tsx`: GUI overlay editor.
- `lib/printable-templates/types.ts`: core data model.
- `lib/printable-templates/store.ts`: Strapi/local data access.
- `lib/printable-templates/renderers.ts`: PDF/PNG rendering.
- `lib/printable-templates/templates/index.ts`: template catalog.
- `data/printable-templates.json`: local seed/edit store used when Strapi is not configured.
- `ai_context/inbox_template`: incoming source images/materials for new templates.

## Data Model

`PrintableTemplate`:

```ts
type PrintableTemplate = {
  pageId: string;
  name: string;
  backgroundImage: {
    src: string;
    widthPx: number;
    heightPx: number;
    mimeType: "image/png" | "image/jpeg" | "image/webp";
  };
  html?: string;
  css?: string;
  javascript?: string;
  inputDefinitions: TemplateInputDefinition[];
  layoutSettings: {
    paperSize: "letter";
    widthIn: number;
    heightIn: number;
  };
  displaySettings: {
    backgroundColor: string;
  };
  sourceAssetPath?: string;
  updatedAt: string;
};
```

`TemplateInputDefinition`:

```ts
type TemplateInputDefinition = {
  inputId: string;
  typeId: TemplateInputTypeId;
  label: string;
  placeholderText?: string;
  bounds: TemplateInputBounds;
  checkOptions?: TemplateCheckOption[];
  displaySettings: TemplateInputDisplaySettings;
  required?: boolean;
};
```

`TemplateInputBounds` stores overlay geometry as percentages:

```ts
type TemplateInputBounds = {
  xPercent: number;
  yPercent: number;
  widthPercent: number;
  heightPercent: number;
};
```

All overlay coordinates are relative to the rendered template page. This lets the editor scale the page visually while preserving print coordinates.

## Supported Input Types

Defined in `lib/printable-templates/types.ts`:

- `textArea`
- `textLine`
- `date`
- `phoneNumber`
- `firstName`
- `lastName`
- `email`
- `number`
- `checkbox`
- `radio`
- `signature`
- `initials`

## Template Storage

The storage layer is in `lib/printable-templates/store.ts`.

Behavior:

- If `STRAPI_API_URL` is not set, templates are loaded from `data/printable-templates.json`.
- If local data cannot be read, the app falls back to `samplePrintableTemplates`.
- If `STRAPI_API_URL` is set, templates are loaded from Strapi at `/api/printable-templates`.
- Editor saves call `PUT /api/templates`, which currently writes to the local seeded JSON store.

Important current limitation:

- Saving from the editor writes the whole template into `data/printable-templates.json`, including any user edits. Running `npm run seed` overwrites that file from the catalog.

## Template Catalog

Base templates are registered in:

```txt
lib/printable-templates/templates/index.ts
```

Current templates:

- `patient-intake-form`
- `spa-intake-internal`

Each template should live in its own module under `lib/printable-templates/templates/`.

## Dashboard

The dashboard is `app/page.tsx`.

It calls `listPrintableTemplates()` and renders each template as a clickable base-template option. Each item links to:

```txt
/dev/test-template-editor/[pageId]
```

The dashboard is configured as dynamic so newly added templates show up without being hidden by static prerendering.

## API Routes

Template CRUD/data:

- `GET /api/templates`: returns all templates.
- `PUT /api/templates`: upserts one template into the local seeded store.

Schema:

- `GET /api/templates/schema`: returns every template’s input schema.
- `GET /api/templates/[pageId]/schema`: returns one template’s input schema.

Rendering:

- `POST /api/templates/render/pdf`: returns one completed PDF.
- `POST /api/templates/render/png`: returns one completed PNG.
- `POST /api/templates/render-batch/pdf`: returns JSON array of rendered PDF documents.
- `POST /api/templates/render-batch/png`: returns JSON array of rendered PNG documents.
- `GET /api/templates/blank/pdf`: returns JSON array of all blank template PDFs.
- `GET /api/templates/blank/png`: returns JSON array of all blank template PNGs.

Render request:

```json
{
  "pageId": "spa-intake-internal",
  "inputValues": [
    { "inputId": "name", "value": "Test Client" }
  ]
}
```

Batch render request:

```json
{
  "pageRenderRequests": [
    {
      "pageId": "patient-intake-form",
      "inputValues": []
    }
  ]
}
```

## Rendering Implementation

`lib/printable-templates/renderers.ts` renders the template background image and overlays from the same percentage coordinates used in the editor.

PDF:

- Creates a PDF document with a single page.
- Embeds the template `backgroundImage` as the full-page background.
- Draws input values over the base using `TemplateInputDefinition.bounds`.
- Supports text values, date formatting, simple check marks, checkbox/radio options, and "Other" text boxes.

PNG:

- Uses the template `backgroundImage` as the base.
- Composites SVG-rendered text/check overlays over the image using the same percentage bounds.

The editor, PDF renderer, and PNG renderer now share the same image background source.

## Current Template Creation Workflow

1. Put the source image or source material in `ai_context/inbox_template`.
2. Create a new module under `lib/printable-templates/templates/`.
3. Copy the image into `public/template-assets`.
4. Build a `PrintableTemplate` with `backgroundImage` metadata pointing at that permanent asset.
5. Add initial `inputDefinitions`.
6. Register it in `lib/printable-templates/templates/index.ts`.
7. Run `npm run seed` or update `data/printable-templates.json`.
8. Open the dashboard and edit overlays.
9. Use the editor’s PDF/PNG buttons and API routes to verify output.

## Recommended Next Direction

Future work should focus on better overlay authoring tools: zoom, grid snapping, nudging, source-image replacement, and stronger Strapi write support.
