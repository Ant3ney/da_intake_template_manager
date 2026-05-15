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
  heightPercent = 1.7,
  typeId: TemplateInputTypeId = "textLine",
  fontSizePt = 9,
  notes = "",
): TemplateInputDefinition => ({
  inputId,
  typeId,
  label,
  notes,
  bounds: { xPercent, yPercent, widthPercent, heightPercent },
  displaySettings: {
    useWhiteBackground: true,
    fontSizePt,
    textAlign: "left",
    ...(typeId === "date" ? { dateFormat: "MM/DD/YY" as const } : {}),
  },
});

const questionNotes: Record<number, string> = {
  6: "Question 6: Gender. Enter the selected letter. Choices: a Male; b Female; c Transgender Man; d Transgender Woman; e Other. If e Other is selected, use input gender_other for the written other gender value.",
  7: "Question 7: Race/Nationality. Enter the selected letter. Choices: a White; b Black; c Asian; d Hispanic; e Native American; f Pacific Islander; g Bi-racial; h Multi-racial; i Other. The separate nationality input captures the visible Nationality line below this question.",
  8: "Question 8: Marital Status. Enter the selected letter. Choices: a Single; b Married; c Unmarried Partners; d Separated/Divorced; e Widow/Widower.",
  9: "Question 9: Number of children you have. Enter the respondent's number of children; this field is paired with the visible Number of children line.",
  10: "Question 10: Highest grade you completed. Enter the selected letter. Choices: a Grade School; b Middle School (grades 7 & 8); c Some High School (grades 9-11); d High School Graduate; e Working on or Completed GED; f Two Year Tech School; g Some College; h College Graduate; i Post Graduate or above.",
  11: "Question 11: Current Employment-School status. Enter the selected letter. Choices: a Employed full-time; b Going to school full-time; c Employed part-time; d Going to school part-time; e Both going to school and working; f I am a stay-at-home Mom or Dad; g Currently unemployed and not going to school; h Retired; i Other. There is no separate other-text overlay on this page for option i.",
  12: "Question 12: Annual Household Income. Enter the selected letter. Choices: a Under $15,000; b $15,001 to $25,000; c $25,001 to $30,000; d $30,001 to $40,000; e $40,001 to $60,000; f Over $60,000; g I don't know.",
  13: "Question 13: Are or were you and/or your partner in the military? Enter the selected letter. Choices: a Yes, only me; b Yes, only my partner; c Yes, both of us; d No.",
  14: "Question 14: As a child, did you experience any type of physical, emotional or sexual abuse by someone outside of your family? Enter the selected letter. Choices: a Yes; b No.",
  15: "Question 15: As a child, did you experience any type of physical, emotional or sexual abuse by someone inside of your family? Enter the selected letter. Choices: a Yes; b No.",
};

const answerLine = (question: number, xPercent: number, lineYPercent: number): TemplateInputDefinition =>
  textField(
    `question_${question}_answer`,
    `Question ${question} answer`,
    xPercent,
    lineYPercent - 0.85,
    3.0,
    1.7,
    "textLine",
    9,
    questionNotes[question],
  );

const option = (optionId: string, label: string, xPercent: number, yPercent: number): TemplateCheckOption => ({
  optionId,
  label,
  value: optionId,
  bounds: { xPercent, yPercent, widthPercent: 1.25, heightPercent: 1.15 },
});

export const nurturingSkillsForFamiliesAboutMePage1Template: PrintableTemplate = {
  pageId: "nurturing-skills-for-families-about-me-page-1",
  name: "Nurturing Skills for Families About Me Page 1",
  notes:
    "Nurturing Skills Competency Scale page 1. Most numbered response fields are short letter-entry lines where the respondent writes the selected answer letter from the visible choices. Question notes list the visible choices. gender_other belongs to Question 6 option e Other. nationality belongs to the visible Nationality line under Question 7 Race/Nationality.",
  backgroundImage: {
    src: "/template-assets/nurturing-skills-for-families-about-me-page-1.png",
    widthPx: 1086,
    heightPx: 1448,
    mimeType: "image/png",
  },
  inputDefinitions: [
    {
      inputId: "inventory_type",
      typeId: "radio",
      label: "Inventory type",
      bounds: { xPercent: 81.0, yPercent: 8.4, widthPercent: 10.9, heightPercent: 4.1 },
      checkOptions: [option("pretest", "Pretest", 90.0, 10.2), option("posttest", "Posttest", 90.0, 11.8)],
      displaySettings: { useWhiteBackground: false, fontSizePt: 9, textAlign: "left" },
    },
    textField("date_inventory_administered", "Date inventory was administered", 30.2, 21.8, 13.1, 1.7, "date"),
    textField("administering_person_name", "Name of person administering inventory", 72.3, 21.7, 20.0),
    textField("last_name_or_agency_id", "Last name or agency ID number", 30.8, 24.7, 19.1),
    textField("middle_initial", "Middle initial", 61.6, 24.7, 3.2),
    textField("first_name", "First name", 75.0, 24.7, 18.0, 1.7, "firstName"),
    textField("agency_name", "Agency name", 6.1, 27.7, 43.3),
    textField("city", "City", 51.0, 27.7, 27.7),
    textField("state", "State", 80.8, 27.7, 7.1),
    textField("birthday_month", "Birthday month", 16.4, 40.4, 7.6, 1.7, "number"),
    textField("birthday_day", "Birthday day", 26.2, 40.4, 7.8, 1.7, "number"),
    textField("birthday_year", "Birthday year", 36.9, 40.4, 7.2, 1.7, "number"),
    answerLine(6, 44.7, 45.5),
    textField("gender_other", "Gender other", 31.0, 48.5, 16.4, 1.7, "textLine", 9, "Free-text Other value for Question 6 Gender option e Other."),
    answerLine(7, 44.7, 50.3),
    textField("nationality", "Nationality", 17.2, 61.9, 23.4, 1.7, "textLine", 9, "Free-text Nationality line associated with Question 7 Race/Nationality; this is not the Question 7 letter answer field."),
    answerLine(8, 44.7, 63.9),
    textField("number_of_children", "Number of children", 28.7, 74.4, 9.4, 1.7, "number"),
    answerLine(9, 44.7, 74.7),
    answerLine(10, 44.7, 77.3),
    answerLine(11, 91.8, 37.9),
    answerLine(12, 91.8, 53.6),
    answerLine(13, 91.8, 62.0),
    answerLine(14, 91.8, 72.3),
    answerLine(15, 91.8, 82.2),
  ],
  layoutSettings: { paperSize: "letter", widthIn: 8.5, heightIn: 11 },
  displaySettings: { backgroundColor: "#ffffff" },
  sourceAssetPath: "ai_context/inbox_template/nurturing-skills-for-families-about-me-page-1-01.png",
  updatedAt: "2026-05-14T16:50:37-07:00",
};
