import type { PrintableTemplate, TemplateInputDefinition, TemplateInputTypeId } from "../types";

const lineField = (
  inputId: string,
  label: string,
  xPercent: number,
  yPercent: number,
  widthPercent: number,
  heightPercent: number,
  typeId: TemplateInputTypeId = "textLine",
  fontSizePt = 10,
): TemplateInputDefinition => ({
  inputId,
  typeId,
  label,
  bounds: { xPercent, yPercent, widthPercent, heightPercent },
  displaySettings: {
    useWhiteBackground: true,
    fontSizePt,
    textAlign: "left",
    ...(typeId === "date" ? { dateFormat: "MM/DD/YY" as const } : {}),
  },
});

export const delAireBaptistChurchVirtualClassGuidelines02Template: PrintableTemplate = {
  pageId: "del-aire-baptist-church-virtual-class-guidelines-02",
  name: "Del Aire Baptist Church Virtual Class Guidelines",
  backgroundImage: {
    src: "/template-assets/del-aire-baptist-church-virtual-class-guidelines-02.png",
    widthPx: 1103,
    heightPx: 1426,
    mimeType: "image/png",
  },
  inputDefinitions: [
    lineField("client_signature", "Client's Signature", 24.4, 87.3, 35.0, 3.2, "signature", 11),
    lineField("signature_date", "Date", 66.8, 87.3, 26.0, 2.8, "date", 11),
  ],
  layoutSettings: { paperSize: "letter", widthIn: 8.5, heightIn: 11 },
  displaySettings: { backgroundColor: "#ffffff" },
  sourceAssetPath: "ai_context/inbox_template/del_aire_baptist_church_virtual_class_guidelines_02.png",
  updatedAt: "2026-05-15T11:04:10-07:00",
};
