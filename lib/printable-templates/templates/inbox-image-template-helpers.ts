import type {
  PrintableTemplate,
  TemplateCheckOption,
  TemplateInputDefinition,
  TemplateInputTypeId,
} from "../types";

const UPDATED_AT = "2026-05-15T10:49:59-07:00";

export type InboxTemplateConfig = {
  pageId: string;
  name: string;
  fileName: string;
  widthPx: number;
  heightPx: number;
  inputDefinitions: TemplateInputDefinition[];
};

export const lineField = (
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

export const option = (
  optionId: string,
  label: string,
  xPercent: number,
  yPercent: number,
  widthPercent = 1.3,
  heightPercent = 1.3,
): TemplateCheckOption => ({
  optionId,
  label,
  value: optionId,
  bounds: { xPercent, yPercent, widthPercent, heightPercent },
});

export const otherOption = (
  optionId: string,
  label: string,
  xPercent: number,
  yPercent: number,
  textBoxBounds?: TemplateCheckOption["textBoxBounds"],
): TemplateCheckOption => ({
  ...option(optionId, label, xPercent, yPercent),
  isOtherOption: true,
  textBoxBounds,
  textPlaceholderText: "Other",
});

export const choiceGroup = (
  inputId: string,
  typeId: "checkbox" | "radio",
  label: string,
  bounds: TemplateInputDefinition["bounds"],
  checkOptions: TemplateCheckOption[],
): TemplateInputDefinition => ({
  inputId,
  typeId,
  label,
  bounds,
  checkOptions,
  displaySettings: { useWhiteBackground: false, fontSizePt: 9, textAlign: "left" },
});

export const yesNoDateSignatureInputs = (
  consentY: number,
  signatureY: number,
  dateY: number,
): TemplateInputDefinition[] => [
  choiceGroup(
    "photo_video_permission",
    "radio",
    "Photo and video permission",
    { xPercent: 16.5, yPercent: consentY - 0.2, widthPercent: 12.0, heightPercent: 5.0 },
    [option("do_give_permission", "I do", 16.6, consentY), option("do_not_give_permission", "I do not", 16.6, consentY + 2.35)],
  ),
  lineField("consent_effective_date", "Consent effective date", 66.6, 49.0, 10.0, 2.1, "date"),
  lineField("participant_signature", "Signature of P&A participant", 11.8, signatureY, 30.0, 3.2, "signature", 10),
  lineField("staff_signature", "Staff signature", 12.4, 72.4, 22.2, 3.2, "signature", 10),
  lineField("staff_date", "Staff date", 44.0, dateY, 12.8, 2.2, "date", 10),
];

export const makeTemplate = (config: InboxTemplateConfig): PrintableTemplate => ({
  pageId: config.pageId,
  name: config.name,
  backgroundImage: {
    src: `/template-assets/${config.fileName}`,
    widthPx: config.widthPx,
    heightPx: config.heightPx,
    mimeType: "image/png",
  },
  inputDefinitions: config.inputDefinitions,
  layoutSettings: { paperSize: "letter", widthIn: 8.5, heightIn: 11 },
  displaySettings: { backgroundColor: "#ffffff" },
  sourceAssetPath: `ai_context/inbox_template/${config.fileName}`,
  updatedAt: UPDATED_AT,
});
