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
  bounds: { xPercent, yPercent, widthPercent: 1.0, heightPercent: 1.5 },
});

const choiceField = (
  inputId: string,
  label: string,
  checkOptions: TemplateCheckOption[],
  bounds = { xPercent: 74.5, yPercent: 23.0, widthPercent: 13.0, heightPercent: 51.0 },
): TemplateInputDefinition => ({
  inputId,
  typeId: "checkbox",
  label,
  bounds,
  checkOptions,
  displaySettings: { useWhiteBackground: false, fontSizePt: 9, textAlign: "left" },
});

const rowTops = [23.0, 33.8, 44.9, 56.0, 66.8];

const serviceRows = rowTops.flatMap((yPercent, index) => {
  const row = index + 1;
  return [
    textField(`goal_${row}`, `Goal ${row}`, 6.5, yPercent, 9.2, 9.5, "textArea"),
    textField(`goal_${row}_for`, `Goal ${row} is for`, 16.4, yPercent, 7.2, 9.5, "textLine"),
    textField(`goal_${row}_protective_factors`, `Goal ${row} protective factors`, 24.2, yPercent, 8.0, 9.5, "textArea"),
    textField(`goal_${row}_service_requested`, `Goal ${row} service requested`, 32.8, yPercent, 18.0, 7.7, "textArea"),
    textField(`goal_${row}_date_added`, `Goal ${row} date added`, 38.2, yPercent + 8.0, 4.0, 1.9, "date", 8),
    textField(`goal_${row}_responsible_parties`, `Goal ${row} responsible parties`, 51.4, yPercent, 12.8, 9.5, "textArea"),
    textField(`goal_${row}_target_completion_date`, `Goal ${row} target completion date`, 64.9, yPercent, 8.5, 9.5, "date"),
    choiceField(
      `goal_${row}_progress`,
      `Goal ${row} progress`,
      [
        option("participating", "Participating in service", 74.6, yPercent + 1.0),
        option("linked", "Linked to services / attempts to contact", 74.6, yPercent + 5.1),
        option("no_progress", "No progress observed", 74.6, yPercent + 9.1),
      ],
      { xPercent: 74.2, yPercent, widthPercent: 12.8, heightPercent: 10.8 },
    ),
    choiceField(
      `goal_${row}_attained`,
      `Goal ${row} attained`,
      [option("goal_attained", "Goal attained", 88.5, yPercent + 1.5)],
      { xPercent: 88.0, yPercent, widthPercent: 8.4, heightPercent: 4.0 },
    ),
    textField(`goal_${row}_attained_date`, `Goal ${row} attained date`, 90.5, yPercent + 8.0, 4.5, 1.9, "date", 8),
  ];
});

export const preventionAftercareIndividualizedServicePlanTemplate: PrintableTemplate = {
  pageId: "prevention-aftercare-individualized-service-plan",
  name: "Prevention and Aftercare Individualized Service Plan",
  backgroundImage: {
    src: "/template-assets/prevention-aftercare-individualized-service-plan.png",
    widthPx: 1536,
    heightPx: 1024,
    mimeType: "image/png",
  },
  inputDefinitions: [
    textField("name", "Name", 14.3, 11.8, 23.8, 2.0),
    textField("date", "Date", 45.1, 11.8, 5.9, 2.0, "date"),
    textField("agency", "Agency", 82.7, 11.8, 8.8, 2.0),
    ...serviceRows,
    textField("comments", "Comments", 6.2, 79.8, 78.4, 3.2, "textArea"),
    textField("effective_date_start", "Effective date start", 22.8, 83.9, 10.8, 2.3, "date"),
    textField("effective_date_end", "Effective date end", 38.2, 83.9, 10.5, 2.3, "date"),
    textField("participant_signature", "Participant signature", 30.5, 87.2, 8.0, 2.5, "signature"),
    textField("participant_signature_date", "Participant signature date", 47.1, 87.2, 10.0, 2.5, "date"),
    textField("supervisor_signature", "Supervisor signature", 17.7, 90.0, 21.0, 2.3, "signature"),
    textField("supervisor_signature_date", "Supervisor signature date", 47.1, 90.0, 9.4, 2.3, "date"),
    textField("navigator_signature", "Navigator signature", 24.3, 93.0, 15.0, 2.6, "signature"),
    textField("navigator_signature_date", "Navigator signature date", 47.1, 93.0, 9.6, 2.3, "date"),
  ],
  layoutSettings: { paperSize: "letter", widthIn: 11, heightIn: 8.5 },
  displaySettings: { backgroundColor: "#ffffff" },
  sourceAssetPath: "ai_context/inbox_template/02.png",
  updatedAt: "2026-05-14T15:22:48-07:00",
};
