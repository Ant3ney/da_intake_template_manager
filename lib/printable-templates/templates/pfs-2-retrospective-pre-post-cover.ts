import type { PrintableTemplate, TemplateInputDefinition, TemplateInputTypeId } from "../types";

const textField = (
  inputId: string,
  label: string,
  yPercent: number,
  typeId: TemplateInputTypeId = "textLine",
): TemplateInputDefinition => ({
  inputId,
  typeId,
  label,
  bounds: { xPercent: 10.2, yPercent, widthPercent: 79.8, heightPercent: 5.9 },
  displaySettings: {
    useWhiteBackground: true,
    fontSizePt: typeId === "date" ? 11 : 10,
    textAlign: "left",
    ...(typeId === "date" ? { dateFormat: "MM/DD/YY" as const } : {}),
  },
});

export const pfs2RetrospectivePrePostCoverTemplate: PrintableTemplate = {
  pageId: "pfs-2-retrospective-pre-post-cover",
  name: "PFS-2 Retrospective Pre-Post Cover",
  backgroundImage: {
    src: "/template-assets/pfs-2-retrospective-pre-post-cover.png",
    widthPx: 1448,
    heightPx: 1086,
    mimeType: "image/png",
  },
  inputDefinitions: [
    textField("participant_identifier", "Participant identifier", 30.4),
    textField("completed_on", "Completed on", 42.2, "date"),
    textField("program_start_on", "Program start on", 54.1, "date"),
    textField("program_end_on", "Program end on", 66.0, "date"),
  ],
  layoutSettings: { paperSize: "letter", widthIn: 11, heightIn: 8.5 },
  displaySettings: { backgroundColor: "#ffffff" },
  sourceAssetPath: "ai_context/inbox_template/04.png",
  updatedAt: "2026-05-14T15:22:48-07:00",
};
