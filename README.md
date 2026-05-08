# Printable Intake Template Manager

This is a Next.js application for managing fixed-layout printable intake documents. The core entity is a `PrintableTemplate`: a single-page, letter-sized background image plus coordinate-based input overlays.

The project currently supports:

- A dashboard listing all available base templates.
- A GUI editor for positioning and configuring input overlays.
- Local seeded template storage in `data/printable-templates.json`.
- Optional Strapi-backed template storage when `STRAPI_API_URL` is configured.
- PDF and PNG render routes for blank and completed templates.
- A template catalog for adding new base templates over time.

## Useful Docs

- [Project architecture](docs/printable-template-manager.md)
- [TemplateEditor guide](docs/template-editor.md)
- [Updated build prompt](docs/updated-build-prompt.md)
- [Strapi collection notes](docs/strapi/printable-template.md)

## Commands

```bash
npm run dev
npm run build
npm run lint
npm run seed
```

`npm run dev` starts Next.js and, if a Strapi project exists at `./strapi`, starts Strapi too. Without Strapi, the app uses `data/printable-templates.json`.

## Main URLs

- Dashboard: `http://localhost:3000`
- Editor fallback: `/dev/test-template-editor`
- Editor for one template: `/dev/test-template-editor/[pageId]`
- All schemas: `/api/templates/schema`
