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
  { id: "yes", label: "Yes", xPercent: 52.6 },
  { id: "no", label: "No", xPercent: 57.2 },
  { id: "na", label: "N/A", xPercent: 61.8 },
  { id: "declined", label: "Declined to Answer", xPercent: 68.4 },
  { id: "on_ifsp", label: "On IFSP", xPercent: 74.9 },
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
    bounds: { xPercent: 50.4, yPercent, widthPercent: 27.7, heightPercent },
    checkOptions: matrixColumns.map((column) => option(column.id, column.label, column.xPercent, yPercent + 0.35)),
    displaySettings: { useWhiteBackground: false, fontSizePt: 9, textAlign: "left" },
  },
  textField(`${inputId}_notes`, `${label} notes`, 78.3, yPercent + 0.15, 16.9, Math.max(1.6, heightPercent - 0.3)),
];

export const preventionAftercareNeedsAssessmentPage2Template: PrintableTemplate = {
  pageId: "prevention-aftercare-needs-assessment-page-2",
  name: "Prevention and Aftercare Needs Assessment Page 2",
  backgroundImage: {
    src: "/template-assets/prevention-aftercare-needs-assessment-page-2.png",
    widthPx: 1448,
    heightPx: 1086,
    mimeType: "image/png",
  },
  inputDefinitions: [
    textField("name", "Name", 13.0, 10.0, 44.0, 2.0),
    textField("date", "Date", 74.5, 10.0, 11.5, 2.0, "date"),
    textField("universal_id", "Universal ID", 68.7, 14.0, 17.2, 2.0),
    ...assessmentRow("anger_management_classes", "Interested in anger management classes", 23.0),
    ...assessmentRow("parenting_classes", "Interested in parenting classes", 25.4),
    ...assessmentRow("domestic_violence_support_groups", "Interested in domestic violence support groups", 27.8),
    ...assessmentRow("general_support_groups", "Interested in general support groups", 30.4, 4.3),
    ...assessmentRow("substance_abuse_support_groups", "Interested in substance abuse support groups", 35.0),
    ...assessmentRow("job_finding_help", "Child/youth needs help finding a job", 40.5),
    ...assessmentRow("gang_involvement", "Concerned with gang involvement", 42.9),
    ...assessmentRow("speech_language_concerns", "Child/youth speech or language concerns", 45.3, 4.1),
    ...assessmentRow("movement_concerns", "Child/youth movement concerns", 49.5, 4.2),
    ...assessmentRow("behavior_concerns", "Child/youth behavior concerns", 53.8, 6.2),
    ...assessmentRow("learning_home_community_interference", "Child/youth behavior interferes with learning, home, or community", 60.0, 6.2),
    ...assessmentRow("sleeping_trouble", "Child/youth trouble sleeping", 66.2),
    ...assessmentRow("legal_issues", "Legal issues", 72.7, 10.5),
    ...assessmentRow("another_caregiver_in_home", "Another caregiver in the home", 81.1),
    ...assessmentRow("people_to_turn_to", "People to turn to when help is needed", 83.5),
    ...assessmentRow("know_how_to_get_help", "Knows how to get help", 85.9),
    ...assessmentRow("family_can_handle_problems", "Family can handle problems", 88.3),
    ...assessmentRow("neighborhood_groups", "Part of neighborhood groups", 90.7, 3.0),
  ],
  layoutSettings: { paperSize: "letter", widthIn: 11, heightIn: 8.5 },
  displaySettings: { backgroundColor: "#ffffff" },
  sourceAssetPath: "ai_context/inbox_template/05.png",
  updatedAt: "2026-05-14T15:22:48-07:00",
};
