# Packet Builder Integration With Template Manager

This document is for an outside Next.js project that needs to build a Packet Builder UI and communicate with the local Printable Intake Template Manager. The Template Manager is expected to be running at `http://localhost:3051`.

The Packet Builder should treat the Template Manager as the source of truth for printable page/template metadata. Packet Builder should not duplicate template definitions, overlay definitions, input schemas, or background image metadata except where storing packet membership metadata is necessary. Packet Builder should store only packet definitions and ordered page membership in its own project files.

Use `GET http://localhost:3051/api/templates/page-ids` as the first discovery call. This route returns a lightweight object with `pageIds` and `templates`. Each `templates` item includes `pageId`, `name`, `inputCount`, and `updatedAt`. This route is the fastest way to populate a list of all available printable pages.

Use `GET http://localhost:3051/api/templates/{pageId}/context` to retrieve the complete context for one printable page. This route returns the full normalized PrintableTemplate context for that page, including page metadata, page notes, input schemas, input notes, `questionText`, placeholder data, background image information, layout settings, display settings, and the complete normalized template object. Packet Builder should call this route for each page it needs to display in detail or store in packet page metadata.

The context route can also be queried with `GET http://localhost:3051/api/templates/context?pageId={pageId}`. Prefer the path route when the page ID is known. Use the query route only when it fits the calling code better.

Each page context contains `backgroundImage.src`. Convert that into an absolute URL by prefixing the Template Manager base URL. For example, if `backgroundImage.src` is `/template-assets/example.png`, the browser preview URL is `http://localhost:3051/template-assets/example.png`. This direct background asset is the simplest preview source and should be used for page cards whenever possible.

If a true rendered PNG preview is needed instead of the raw background asset, call `POST http://localhost:3051/api/templates/render/png` with JSON like `{ "pageId": "some-page-id", "inputValues": [] }`. The response is an `image/png` binary. This is useful if the preview should include rendered values, but for Packet Builder’s available-page cards and packet stack previews, the static background asset URL is usually enough.

There is also `GET http://localhost:3051/api/templates/blank/png`, which returns all blank pages as JSON documents with base64 PNG data. This can be expensive because it renders every template. Packet Builder should not use it as the default dashboard loading path unless it explicitly needs base64-rendered blank PNGs for every page at once.

The available page model inside Packet Builder should be derived from Template Manager context. A useful local shape is `pageId`, `title`, `inputCount`, `updatedAt`, `previewUrl`, `backgroundImage`, `layoutSettings`, `displaySettings`, `pageNotes`, and any other metadata needed by the UI. Use `metadata.name` or `template.name` as the title. Use `inputSchemas.length` or `metadata.inputCount` for input count. Use `http://localhost:3051` plus `backgroundImage.src` for `previewUrl`.

Packet Builder should implement file-based persistence in its own project. Store packet definitions in a local data file such as `data/packets.json`, or store one JSON file per packet under `data/packets/{packetId}.json`. Either approach is acceptable if the files are committed to Git. Do not use an external database for packet definitions.

A packet definition should include stable packet metadata such as `packetId`, `name`, `description`, `createdAt`, `updatedAt`, and an ordered `pages` array. Each page entry should include at least `pageId`, `order`, and optional packet-specific metadata such as `required`, `customLabel`, `notes`, or `sourceTemplateName`. The page entry may cache lightweight Template Manager metadata for display, but Template Manager remains the source of truth for current page context.

Packet Builder must expose `GET /api/packets`. This route should return all packet IDs and basic packet metadata. The response should be lightweight and suitable for a dashboard list. Include `packetId`, `name`, `description`, `createdAt`, `updatedAt`, `pageCount`, and the first few page IDs or preview metadata needed for the dashboard card stack.

Packet Builder must expose `GET /api/packets/[packetId]`. This route should return the full packet definition, including packet metadata, ordered page IDs, and metadata for each page in the packet. It should be enough for another local program to understand exactly which printable pages belong to the packet and in what order.

The Packet Builder dashboard should show all existing packets as cards. Each packet card should include an edit button or icon. The card should visually look like a stack of pages by using the first few page preview images from that packet. Use the Template Manager preview URL for each page, and offset each preview slightly left and downward from the one before it to create the stacked-paper effect.

The Packet Builder dashboard should also include a clear “new packet” action. Creating a new packet should make a new packet definition with a stable packet ID, a default name, timestamps, and an empty ordered pages list.

The packet editor should allow creating, renaming, editing, and organizing packet pages. It should show available printable pages as draggable cards. Each available page card should display the PNG preview, title, page ID, input count, and useful metadata from the Template Manager. The editor should allow dragging available pages into the packet, reordering pages inside the packet, removing pages from the packet, and adding the same page only when the product behavior intentionally allows duplicates.

Use a conventional drag-and-drop document builder UX. The left side can show available pages from Template Manager, and the right side can show the current packet’s ordered pages. Page cards in the packet should show order number, preview thumbnail, title, page ID, and a remove button. Reordering should update the ordered packet page array before saving.

Packet Builder should save packet changes through its own local file-backed API routes. The exact write routes are implementation-specific, but a practical set is `POST /api/packets` for create, `PUT /api/packets/[packetId]` for update, and `DELETE /api/packets/[packetId]` for delete. The required query routes remain `GET /api/packets` and `GET /api/packets/[packetId]`.

When implementing this in a brand-new default Next.js JavaScript project, keep the code plain and maintainable. Use a small Template Manager client module, for example `lib/templateManagerClient.js`, to centralize the base URL and fetch helpers. Use a small packet store module, for example `lib/packetStore.js`, to centralize file reads and writes. Keep API route handlers thin and delegate data logic to those modules.

Use `http://localhost:3051` as the default Template Manager base URL, but define it in one place so it can be changed later. A good default is `const TEMPLATE_MANAGER_BASE_URL = process.env.TEMPLATE_MANAGER_BASE_URL || "http://localhost:3051"`. This lets the project run locally without configuration while still allowing deployment changes.

The Packet Builder should fail gracefully if the Template Manager is not running. The dashboard/editor should show a clear connection error and should not delete or corrupt saved packet files. Packet editing of already-saved packets can still work from local packet data, but available page metadata and previews require the Template Manager to be reachable.

The key integration rule is simple: Packet Builder owns packets; Template Manager owns printable pages. Packet Builder stores ordered lists of Template Manager `pageId` values and packet-specific metadata. Template Manager provides page metadata, PNG preview sources, input schemas, notes, and render/context APIs.
