import type { PrintableTemplate, TemplateInputDefinition, TemplateInputTypeId } from "../types";

const textField = (
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

export const preventionAftercareNeedsAssessmentPage3Template: PrintableTemplate = {
  pageId: "prevention-aftercare-needs-assessment-page-3",
  name: "Prevention and Aftercare Needs Assessment Page 3",
  backgroundImage: {
    src: "/template-assets/prevention-aftercare-needs-assessment-page-3.png",
    widthPx: 1448,
    heightPx: 1086,
    mimeType: "image/png",
  },
  inputDefinitions: [
    textField("family_strengths", "Family strengths", 7.4, 23.8, 85.6, 8.1, "textArea", 10),
    textField("top_need_1", "Top need 1", 9.5, 44.0, 83.0, 3.0),
    textField("top_need_2", "Top need 2", 9.5, 48.5, 83.0, 3.0),
    textField("top_need_3", "Top need 3", 9.5, 53.0, 83.0, 3.0),
    textField("family_signature", "Family signature", 20.7, 68.0, 43.8, 3.0, "signature"),
    textField("family_signature_date", "Family signature date", 70.6, 68.0, 18.8, 3.0, "date"),
    textField("staff_signature", "Staff signature", 19.4, 74.2, 45.2, 2.8, "signature"),
    textField("staff_signature_date", "Staff signature date", 70.6, 74.2, 18.8, 2.8, "date"),
  ],
  layoutSettings: { paperSize: "letter", widthIn: 11, heightIn: 8.5 },
  displaySettings: { backgroundColor: "#ffffff" },
  sourceAssetPath: "ai_context/inbox_template/01.png",
  updatedAt: "2026-05-14T15:22:48-07:00",
};
