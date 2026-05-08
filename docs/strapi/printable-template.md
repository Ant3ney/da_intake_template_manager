# Strapi printable-template collection

Create one collection type named `printable-template`.

Recommended fields:

- `pageId`: UID or string, unique and required.
- `name`: string, required.
- `backgroundImage`: JSON, required. Stores `{ src, widthPx, heightPx, mimeType }`.
- `html`: long text, optional legacy field.
- `css`: long text, optional legacy field.
- `javascript`: long text, optional legacy field.
- `inputDefinitions`: JSON, required. Stores `TemplateInputDefinition[]`.
- `layoutSettings`: JSON, required. Stores paper size and dimensions.
- `displaySettings`: JSON, required.
- `sourceAssetPath`: string.

The static printable base is now the image referenced by `backgroundImage.src`.
Do not rely on `html`, `css`, or `javascript` for new templates.

The Next.js repository layer reads `STRAPI_API_URL/api/printable-templates` when
`STRAPI_API_URL` is set. Without that variable it falls back to
`data/printable-templates.json`, which is populated by `npm run seed`.
