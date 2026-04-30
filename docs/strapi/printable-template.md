# Strapi printable-template collection

Create one collection type named `printable-template`.

Recommended fields:

- `pageId`: UID or string, unique and required.
- `name`: string, required.
- `html`: rich text or long text, required.
- `css`: long text, required.
- `javascript`: long text.
- `inputDefinitions`: JSON, required. Stores `TemplateInputDefinition[]`.
- `layoutSettings`: JSON, required. Stores paper size and dimensions.
- `displaySettings`: JSON, required.
- `sourceAssetPath`: string.

The Next.js repository layer reads `STRAPI_API_URL/api/printable-templates` when
`STRAPI_API_URL` is set. Without that variable it falls back to
`data/printable-templates.json`, which is populated by `npm run seed`.
