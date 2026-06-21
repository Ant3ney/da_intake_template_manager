import type { PrintableTemplate, TemplateCheckOption, TemplateInputDefinition, TemplateInputTypeId } from "../types";

const textField = (
  inputId: string,
  label: string,
  xPercent: number,
  yPercent: number,
  widthPercent: number,
  heightPercent = 1.7,
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

const option = (
  optionId: string,
  label: string,
  xPercent: number,
  yPercent: number,
  widthPercent = 1.15,
  heightPercent = 1.15,
): TemplateCheckOption => ({
  optionId,
  label,
  value: optionId,
  bounds: { xPercent, yPercent, widthPercent, heightPercent },
});

const choiceField = (
  inputId: string,
  label: string,
  bounds: TemplateInputDefinition["bounds"],
  checkOptions: TemplateCheckOption[],
): TemplateInputDefinition => ({
  inputId,
  typeId: "radio",
  label,
  bounds,
  checkOptions,
  displaySettings: { useWhiteBackground: false, fontSizePt: 9, textAlign: "left" },
});

const classColumns = [
  { id: "classes", label: "Class(es)", xPercent: 2.8, widthPercent: 19.6 },
  { id: "instructor", label: "Instructor", xPercent: 22.4, widthPercent: 17.0 },
  { id: "type", label: "Type", xPercent: 39.4, widthPercent: 12.4 },
  { id: "weeks", label: "Weeks", xPercent: 51.8, widthPercent: 7.0, typeId: "number" as const },
  { id: "day", label: "Day", xPercent: 58.8, widthPercent: 8.6 },
  { id: "time", label: "Time", xPercent: 67.4, widthPercent: 8.7 },
  { id: "start", label: "Start", xPercent: 76.1, widthPercent: 10.0, typeId: "date" as const },
  { id: "end", label: "End", xPercent: 86.1, widthPercent: 9.7, typeId: "date" as const },
];

const classRow = (row: number, yPercent: number) =>
  classColumns.map((column) =>
    textField(
      `class_${row}_${column.id}`,
      `Class ${row} ${column.label}`,
      column.xPercent,
      yPercent,
      column.widthPercent,
      3.0,
      column.typeId ?? "textLine",
      9,
    ),
  );

export const spaIntakeInternalTemplate: PrintableTemplate = {
  pageId: "spa-intake-internal",
  name: "SPA Intake Internal",
  backgroundImage: {
    src: "/template-assets/spa-intake.png",
    widthPx: 1103,
    heightPx: 1426,
    mimeType: "image/png",
  },
  inputDefinitions: [
    choiceField(
      "appointment_day",
      "Appointment day",
      { xPercent: 16.0, yPercent: 12.4, widthPercent: 32.0, heightPercent: 2.1 },
      [
        option("monday", "Mon", 16.5, 12.95),
        option("tuesday", "Tues", 22.6, 12.95),
        option("wednesday", "Wed", 29.6, 12.95),
        option("thursday", "Thurs", 36.6, 12.95),
        option("friday", "Fri", 44.8, 12.95),
        option("saturday", "Sat", 49.2, 12.95),
      ],
    ),
    textField("appointment_date", "Appointment date", 53.0, 12.9, 13.9, 1.7, "date"),
    textField("appointment_time", "Appointment time", 77.6, 12.9, 14.5),
    textField("appointment_made_datetime", "Date/time appointment made", 23.0, 16.1, 34.5),
    textField("survey_number_suffix", "Survey number suffix", 73.9, 16.1, 18.7),
    textField("name", "Name", 15.5, 19.6, 76.9),
    textField("address", "Address", 17.8, 22.5, 74.6),
    textField("phone", "Phone", 17.7, 25.45, 74.7, 1.7, "phoneNumber"),
    textField("email", "Email", 15.6, 28.3, 76.8, 1.7, "email"),
    textField("date_of_birth", "DOB", 14.2, 31.2, 16.2, 1.7, "date"),
    textField("age", "Age", 35.2, 31.2, 7.3, 1.7, "number"),
    textField("ethnicity", "Ethnicity", 52.3, 31.2, 14.4),
    textField("marital_status", "Marital status", 81.3, 31.2, 10.5),
    textField("highest_grade_level", "Highest grade level", 28.8, 34.1, 23.8),
    textField("services_received", "Services received", 69.4, 34.1, 23.0),
    textField("number_of_children", "Number of children", 22.7, 37.0, 10.0, 1.7, "number"),
    choiceField(
      "living_with_you",
      "Living with you",
      { xPercent: 43.5, yPercent: 36.85, widthPercent: 11.6, heightPercent: 1.9 },
      [option("yes", "Yes", 47.8, 37.25), option("no", "No", 52.3, 37.25)],
    ),
    choiceField(
      "unmonitored_visits",
      "If no, unmonitored visits",
      { xPercent: 76.2, yPercent: 36.85, widthPercent: 14.8, heightPercent: 1.9 },
      [option("yes", "Yes", 82.0, 37.25), option("no", "No", 89.4, 37.25)],
    ),
    textField("children_names", "Children names", 28.3, 40.0, 64.1),
    textField("children_dob_age", "Children DOB/age", 17.9, 42.9, 74.5),
    textField("social_worker_or_referral_name", "Social worker or referral name", 40.4, 45.75, 52.0),
    textField("social_worker_phone_number", "Social worker phone number", 24.0, 49.75, 27.0, 1.7, "phoneNumber"),
    textField("office", "Office", 60.0, 49.75, 33.0),
    ...classRow(1, 80.0),
    ...classRow(2, 83.4),
    ...classRow(3, 86.8),
    ...classRow(4, 90.2),
    textField("review_90_day", "90 day review day", 24.0, 95.1, 22.0),
    textField("review_90_date", "90 day review date", 51.5, 95.1, 16.4, 1.7, "date"),
    textField("review_90_time", "90 day review time", 72.8, 95.1, 12.2),
    choiceField(
      "review_90_am_pm",
      "90 day review AM or PM",
      { xPercent: 86.0, yPercent: 94.8, widthPercent: 6.6, heightPercent: 2.0 },
      [option("am", "AM", 86.5, 95.15), option("pm", "PM", 91.1, 95.15)],
    ),
  ],
  layoutSettings: { paperSize: "letter", widthIn: 8.5, heightIn: 11 },
  displaySettings: { backgroundColor: "#ffffff" },
  sourceAssetPath: "/template-assets/spa-intake.png",
  updatedAt: "2026-05-20T00:00:00.000Z",
};
