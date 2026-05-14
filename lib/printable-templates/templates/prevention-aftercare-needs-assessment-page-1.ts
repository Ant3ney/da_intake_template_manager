import type {
  PrintableTemplate,
  TemplateCheckOption,
  TemplateInputDefinition,
  TemplateInputTypeId,
} from "../types";

const textField = (
  inputId: string,
  label: string,
  xPercent: number,
  yPercent: number,
  widthPercent: number,
  heightPercent: number,
  typeId: TemplateInputTypeId = "textLine",
  fontSizePt = 9,
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

const option = (optionId: string, label: string, xPercent: number, yPercent: number): TemplateCheckOption => ({
  optionId,
  label,
  value: optionId,
  bounds: { xPercent, yPercent, widthPercent: 1.0, heightPercent: 1.4 },
});

const matrixColumns = [
  { id: "yes", label: "Yes", xPercent: 53.8 },
  { id: "no", label: "No", xPercent: 58.3 },
  { id: "na", label: "N/A", xPercent: 62.8 },
  { id: "declined", label: "Declined", xPercent: 69.0 },
  { id: "on_ifsp", label: "On IFSP", xPercent: 75.6 },
];

const assessmentRow = (
  inputId: string,
  label: string,
  yPercent: number,
  heightPercent = 2.2,
): TemplateInputDefinition[] => [
  {
    inputId,
    typeId: "radio",
    label,
    bounds: { xPercent: 52.2, yPercent, widthPercent: 26.5, heightPercent },
    checkOptions: matrixColumns.map((column) => option(column.id, column.label, column.xPercent, yPercent + 0.35)),
    displaySettings: { useWhiteBackground: false, fontSizePt: 9, textAlign: "left" },
  },
  textField(`${inputId}_notes`, `${label} notes`, 78.5, yPercent + 0.1, 17.1, Math.max(1.6, heightPercent - 0.2)),
];

export const preventionAftercareNeedsAssessmentPage1Inputs: TemplateInputDefinition[] = [
  textField("name", "Name", 15.6, 12.1, 45.5, 2.0),
  textField("date", "Date", 73.2, 12.1, 11.5, 2.0, "date"),
  textField("universal_id", "Universal ID", 63.6, 17.5, 20.4, 2.0),
  ...assessmentRow("regular_doctor", "Has a regular doctor", 26.0),
  ...assessmentRow("dentist", "Has a dentist", 28.4),
  ...assessmentRow("vision_care", "Has vision care", 30.8),
  ...assessmentRow("medical_insurance", "Has medical insurance", 33.2),
  ...assessmentRow("children_regular_doctor", "Children have a regular doctor", 35.6),
  ...assessmentRow("children_dentist", "Children have a dentist", 38.0),
  ...assessmentRow("children_vision_care", "Children have vision care", 40.4),
  ...assessmentRow("children_medical_insurance", "Children have medical insurance", 42.8),
  ...assessmentRow("sad_more_than_three_weeks", "Felt sad for more than 3 weeks", 45.2),
  ...assessmentRow("thoughts_hurting_self", "Thoughts about hurting self", 47.6),
  ...assessmentRow("mental_health_concerns", "Mental health concerns", 50.0),
  ...assessmentRow("unable_to_sleep", "Unable to sleep because of anxiety or nightmares", 52.4),
  ...assessmentRow("substance_abuse_support", "Wants to speak about substance abuse", 54.8),
  ...assessmentRow("enough_food", "Enough food to feed family", 60.0),
  ...assessmentRow("stable_housing", "Stable housing", 62.4),
  ...assessmentRow("transportation", "Transportation when needed", 64.8),
  ...assessmentRow("appropriate_childcare", "Appropriate childcare", 67.2),
  ...assessmentRow("adequate_furniture", "Adequate furniture", 69.6),
  ...assessmentRow("emergency_funds", "In need of emergency funds", 72.0),
  ...assessmentRow("home_safe", "Home is safe", 74.4),
  ...assessmentRow("pay_bills_consistently", "Able to pay bills consistently", 76.8),
  ...assessmentRow("employment_sufficient", "Employment sufficient for family needs", 82.3),
  ...assessmentRow("job_training", "Needs job training", 84.7),
  ...assessmentRow("extend_education_or_training", "Wants education or trainings", 87.1, 4.5),
];

export const preventionAftercareNeedsAssessmentPage1Template: PrintableTemplate = {
  pageId: "prevention-aftercare-needs-assessment-page-1",
  name: "Prevention and Aftercare Needs Assessment Page 1",
  backgroundImage: {
    src: "/template-assets/prevention-aftercare-needs-assessment-page-1.png",
    widthPx: 1448,
    heightPx: 1086,
    mimeType: "image/png",
  },
  inputDefinitions: preventionAftercareNeedsAssessmentPage1Inputs,
  layoutSettings: { paperSize: "letter", widthIn: 11, heightIn: 8.5 },
  displaySettings: { backgroundColor: "#ffffff" },
  sourceAssetPath: "ai_context/inbox_template/06.png",
  updatedAt: "2026-05-14T15:22:48-07:00",
};
