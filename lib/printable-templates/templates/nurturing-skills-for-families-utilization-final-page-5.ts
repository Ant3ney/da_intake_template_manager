import type { PrintableTemplate, TemplateCheckOption, TemplateInputDefinition } from "../types";

const option = (value: string, label: string, xPercent: number, yPercent: number): TemplateCheckOption => ({
  optionId: `rating_${value}`,
  label,
  value,
  bounds: { xPercent, yPercent, widthPercent: 1.35, heightPercent: 1.45 },
});

const ratingRow = (question: number, yPercent: number): TemplateInputDefinition => ({
  inputId: `question_${question}_rating`,
  typeId: "radio",
  label: `Question ${question} rating`,
  notes: {
    74: "Question 74: Model appropriate ways to express my anger. Select one rating. Rating choices: 0 Don't practice the skill at all; 1 Sometimes; 2 Often; 3 Regularly.",
    75: "Question 75: Have awareness of my own adult needs. Select one rating. Rating choices: 0 Don't practice the skill at all; 1 Sometimes; 2 Often; 3 Regularly.",
    76: "Question 76: Make time to get my needs met. Select one rating. Rating choices: 0 Don't practice the skill at all; 1 Sometimes; 2 Often; 3 Regularly.",
    77: "Question 77: Help my children learn positive ways to manage and express their feelings. Select one rating. Rating choices: 0 Don't practice the skill at all; 1 Sometimes; 2 Often; 3 Regularly.",
    78: "Question 78: Express unconditional love for my children. Select one rating. Rating choices: 0 Don't practice the skill at all; 1 Sometimes; 2 Often; 3 Regularly.",
    79: "Question 79: Praise myself for being or doing. Select one rating. Rating choices: 0 Don't practice the skill at all; 1 Sometimes; 2 Often; 3 Regularly.",
    80: "Question 80: Model appropriate ways to express feelings of discomfort (bad feelings). Select one rating. Rating choices: 0 Don't practice the skill at all; 1 Sometimes; 2 Often; 3 Regularly.",
  }[question],
  bounds: { xPercent: 39.0, yPercent: yPercent - 0.6, widthPercent: 9.3, heightPercent: 2.05 },
  checkOptions: [
    option("0", "0", 39.2, yPercent - 0.6),
    option("1", "1", 41.6, yPercent - 0.6),
    option("2", "2", 44.0, yPercent - 0.6),
    option("3", "3", 46.4, yPercent - 0.6),
  ],
  displaySettings: { useWhiteBackground: false, fontSizePt: 9, textAlign: "left" },
});

export const nurturingSkillsForFamiliesUtilizationFinalPage5Template: PrintableTemplate = {
  pageId: "nurturing-skills-for-families-utilization-final-page-5",
  name: "Nurturing Skills for Families Utilization Final Page 5",
  notes:
    "Nurturing Skills Competency Scale page 5. All inputs are Part F utilization radio rating rows for Questions 74-80. Rating choices are 0 Don't practice the skill at all, 1 Sometimes, 2 Often, and 3 Regularly. There are no separate Other text fields on this page.",
  backgroundImage: {
    src: "/template-assets/nurturing-skills-for-families-utilization-final-page-5.png",
    widthPx: 1086,
    heightPx: 1448,
    mimeType: "image/png",
  },
  inputDefinitions: [
    ratingRow(74, 7.8),
    ratingRow(75, 11.0),
    ratingRow(76, 14.0),
    ratingRow(77, 17.0),
    ratingRow(78, 23.8),
    ratingRow(79, 26.9),
    ratingRow(80, 30.0),
  ],
  layoutSettings: { paperSize: "letter", widthIn: 8.5, heightIn: 11 },
  displaySettings: { backgroundColor: "#ffffff" },
  sourceAssetPath: "ai_context/inbox_template/nurturing-skills-for-families-utilization-final-page-5-05.png",
  updatedAt: "2026-05-14T16:50:37-07:00",
};
