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

const option = (
  optionId: string,
  label: string,
  xPercent: number,
  yPercent: number,
  widthPercent = 1.45,
  heightPercent = 1.15,
): TemplateCheckOption => ({
  optionId,
  label,
  value: optionId,
  bounds: { xPercent, yPercent, widthPercent, heightPercent },
});

const otherOption = (
  optionId: string,
  label: string,
  xPercent: number,
  yPercent: number,
  textBoxBounds: TemplateCheckOption["textBoxBounds"],
): TemplateCheckOption => ({
  ...option(optionId, label, xPercent, yPercent),
  isOtherOption: true,
  textBoxBounds,
  textPlaceholderText: "Other",
});

const choiceField = (
  inputId: string,
  label: string,
  typeId: "checkbox" | "radio",
  bounds: TemplateInputDefinition["bounds"],
  checkOptions: TemplateCheckOption[],
): TemplateInputDefinition => ({
  inputId,
  typeId,
  label,
  bounds,
  checkOptions,
  displaySettings: { useWhiteBackground: false, fontSizePt: 10, textAlign: "left" },
});

const adultRows = [
  { row: 1, yPercent: 59.8 },
  { row: 2, yPercent: 62.0 },
];

const childRows = [
  { row: 1, yPercent: 68.65 },
  { row: 2, yPercent: 70.85 },
  { row: 3, yPercent: 73.05 },
  { row: 4, yPercent: 75.25 },
  { row: 5, yPercent: 77.45 },
];

export const preventionAftercareProgramIntakeExitFormTemplate: PrintableTemplate = {
  pageId: "prevention-aftercare-program-intake-exit-form",
  name: "Prevention and Aftercare Program Intake / Exit Form",
  backgroundImage: {
    src: "/template-assets/prevention-aftercare-program-intake-exit-form.png",
    widthPx: 1103,
    heightPx: 1426,
    mimeType: "image/png",
  },
  inputDefinitions: [
    textField("survey_number_suffix", "Survey number suffix", 56.4, 12.3, 13.4, 1.8, "textLine", 9),
    textField("date", "Date", 75.7, 12.3, 19.2, 1.8, "date"),
    textField("case_number_suffix", "Case number suffix", 53.4, 15.0, 41.5, 1.8, "textLine", 9),
    textField("primary_caregiver_name", "Primary caregiver name", 9.6, 25.8, 53.8, 2.8),
    choiceField(
      "primary_caregiver_gender",
      "Primary caregiver gender",
      "radio",
      { xPercent: 64.0, yPercent: 25.8, widthPercent: 29.0, heightPercent: 3.1 },
      [option("female", "Female", 66.2, 27.7), option("male", "Male", 76.2, 27.7)],
    ),
    textField("primary_caregiver_address", "Primary caregiver address", 10.2, 29.6, 84.8, 2.5),
    textField("city_state_zip", "City, state, zip", 13.3, 32.9, 32.8, 2.5),
    textField("phone_number", "Phone number", 54.2, 32.9, 14.3, 2.5, "phoneNumber"),
    choiceField(
      "preferred_method_of_communication",
      "Preferred method of communication",
      "checkbox",
      { xPercent: 70.0, yPercent: 32.9, widthPercent: 25.4, heightPercent: 3.5 },
      [
        option("text", "Text", 70.5, 34.6),
        option("phone_call", "Phone Call", 75.8, 34.6),
        option("email", "E-mail", 84.6, 34.6),
      ],
    ),
    textField("date_of_birth", "Date of birth", 9.0, 36.8, 37.0, 2.3, "date"),
    textField("primary_language_spoken_in_home", "Primary language spoken in home", 64.0, 36.8, 30.8, 2.3),
    choiceField(
      "ethnicity",
      "Ethnicity",
      "checkbox",
      { xPercent: 5.8, yPercent: 39.6, widthPercent: 62.5, heightPercent: 7.2 },
      [
        option("white", "White", 6.0, 41.8),
        option("african_american", "African-American", 6.0, 44.3),
        option("native_american", "Native American", 28.6, 40.3),
        option("latino", "Latino", 28.6, 43.5),
        option("asian", "Asian", 47.6, 40.3),
        option("pacific_islander", "Pacific Islander", 56.2, 40.3),
        otherOption("other", "Other", 47.6, 43.5, {
          xPercent: 53.6,
          yPercent: 43.7,
          widthPercent: 14.1,
          heightPercent: 1.6,
        }),
      ],
    ),
    choiceField(
      "highest_grade_or_level_completed",
      "Highest grade or level completed",
      "radio",
      { xPercent: 70.1, yPercent: 39.5, widthPercent: 25.0, heightPercent: 14.0 },
      [
        option("elementary_school", "Elementary School (Grades 1-8)", 70.5, 44.1),
        option("ged", "GED", 70.5, 45.7),
        option("high_school", "High School", 70.5, 47.3),
        option("college_degree", "College Degree", 70.5, 48.9),
        option("some_college", "Some College", 70.5, 50.5),
        option("vocational_school", "Vocational School", 70.5, 52.1),
      ],
    ),
    choiceField(
      "marital_status",
      "Marital status",
      "radio",
      { xPercent: 5.8, yPercent: 47.0, widthPercent: 63.5, heightPercent: 7.8 },
      [
        option("widowed", "Widowed", 20.5, 48.0),
        option("domestic_partner", "Domestic Partner", 33.4, 48.0),
        option("married", "Married", 6.0, 50.6),
        option("divorced", "Divorced", 20.5, 50.6),
        option("single", "Single", 33.4, 50.6),
        option("separated", "Separated", 6.0, 53.2),
        option("unknown", "Unknown", 20.5, 53.2),
      ],
    ),
    choiceField(
      "adult_receives_direct_services",
      "Other adult receives direct services",
      "checkbox",
      { xPercent: 7.8, yPercent: 59.5, widthPercent: 3.0, heightPercent: 4.8 },
      adultRows.map(({ row, yPercent }) => option(`adult_${row}`, `Adult ${row}`, 8.3, yPercent)),
    ),
    ...adultRows.flatMap(({ row, yPercent }) => [
      textField(`adult_${row}_first_name`, `Adult ${row} first name`, 13.0, yPercent - 0.25, 16.0, 1.6, "firstName", 9),
      textField(`adult_${row}_last_name`, `Adult ${row} last name`, 30.0, yPercent - 0.25, 15.6, 1.6, "lastName", 9),
      textField(`adult_${row}_gender`, `Adult ${row} gender`, 46.3, yPercent - 0.25, 7.5, 1.6, "textLine", 9),
      textField(`adult_${row}_date_of_birth`, `Adult ${row} date of birth`, 55.4, yPercent - 0.25, 10.4, 1.6, "date", 9),
      textField(`adult_${row}_relation`, `Adult ${row} relation`, 67.5, yPercent - 0.25, 12.0, 1.6, "textLine", 9),
      textField(`adult_${row}_disabilities`, `Adult ${row} disabilities`, 81.8, yPercent - 0.25, 13.0, 1.6, "textLine", 9),
    ]),
    choiceField(
      "child_receives_direct_services",
      "Child receives direct services",
      "checkbox",
      { xPercent: 7.8, yPercent: 68.35, widthPercent: 3.0, heightPercent: 11.0 },
      childRows.map(({ row, yPercent }) => option(`child_${row}`, `Child ${row}`, 8.3, yPercent)),
    ),
    ...childRows.flatMap(({ row, yPercent }) => [
      textField(`child_${row}_first_name`, `Child ${row} first name`, 13.0, yPercent - 0.25, 16.0, 1.6, "firstName", 9),
      textField(`child_${row}_last_name`, `Child ${row} last name`, 30.0, yPercent - 0.25, 15.6, 1.6, "lastName", 9),
      textField(`child_${row}_gender`, `Child ${row} gender`, 46.3, yPercent - 0.25, 7.5, 1.6, "textLine", 9),
      textField(`child_${row}_date_of_birth`, `Child ${row} date of birth`, 55.4, yPercent - 0.25, 10.4, 1.6, "date", 9),
      textField(`child_${row}_education_level`, `Child ${row} education level`, 67.5, yPercent - 0.25, 7.0, 1.6, "textLine", 9),
      textField(`child_${row}_relation`, `Child ${row} relation`, 76.4, yPercent - 0.25, 7.0, 1.6, "textLine", 9),
      textField(`child_${row}_disabilities`, `Child ${row} disabilities`, 86.0, yPercent - 0.25, 8.8, 1.6, "textLine", 9),
    ]),
  ],
  layoutSettings: { paperSize: "letter", widthIn: 8.5, heightIn: 11 },
  displaySettings: { backgroundColor: "#ffffff" },
  sourceAssetPath: "ai_context/inbox_template/paaca.png",
  updatedAt: "2026-05-14T14:22:37-07:00",
};
