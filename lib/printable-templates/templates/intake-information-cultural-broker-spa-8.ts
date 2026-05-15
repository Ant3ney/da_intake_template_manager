import type { PrintableTemplate, TemplateInputDefinition, TemplateInputTypeId } from "../types";

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

const classColumns = [
  { id: "classes", label: "Class(es)", xPercent: 5.4, widthPercent: 19.4 },
  { id: "instructor", label: "Instructor", xPercent: 24.8, widthPercent: 16.9 },
  { id: "type", label: "Type", xPercent: 41.7, widthPercent: 12.0 },
  { id: "weeks", label: "Weeks", xPercent: 53.7, widthPercent: 6.7, typeId: "number" as const },
  { id: "day", label: "Day", xPercent: 60.4, widthPercent: 8.2 },
  { id: "time", label: "Time", xPercent: 68.6, widthPercent: 8.1 },
  { id: "start", label: "Start", xPercent: 76.7, widthPercent: 9.5 },
  { id: "end", label: "End", xPercent: 86.2, widthPercent: 8.9 },
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

export const intakeInformationCulturalBrokerSpa8Template: PrintableTemplate = {
  pageId: "intake-information-cultural-broker-spa-8",
  name: "Intake Information Cultural Broker SPA 8",
  backgroundImage: {
    src: "/template-assets/intake-information-cultural-broker-spa-8.png",
    widthPx: 1086,
    heightPx: 1448,
    mimeType: "image/png",
  },
  inputDefinitions: [
    textField("appointment_date", "Appointment date", 54.7, 13.1, 15.6, 1.7, "date"),
    textField("appointment_time", "Appointment time", 78.5, 13.1, 14.2),
    textField("appointment_made_datetime", "Date/time appointment made", 25.0, 16.5, 33.9),
    textField("survey_number_suffix", "Survey number suffix", 75.8, 16.5, 17.7),
    textField("name", "Name", 17.7, 20.5, 75.3),
    textField("address", "Address", 20.0, 23.4, 73.2),
    textField("phone", "Phone", 19.8, 26.4, 73.2, 1.7, "phoneNumber"),
    textField("email", "Email", 17.7, 29.4, 75.0, 1.7, "email"),
    textField("date_of_birth", "DOB", 16.4, 32.3, 15.2, 1.7, "date"),
    textField("age", "Age", 37.5, 32.3, 6.8, 1.7, "number"),
    textField("ethnicity", "Ethnicity", 54.4, 32.3, 14.0),
    textField("marital_status", "Marital status", 82.8, 32.3, 9.8),
    textField("highest_grade_level", "Highest grade level", 30.4, 35.3, 23.7),
    textField("services_received", "Services received", 70.5, 35.3, 22.5),
    textField("number_of_children", "Number of children", 25.4, 38.3, 9.0, 1.7, "number"),
    textField("children_names", "Children names", 30.2, 41.3, 62.8),
    textField("children_dob_age", "Children DOB/age", 20.0, 44.3, 73.0),
    textField("social_worker_or_referral_name", "Social worker or referral name", 42.0, 47.3, 50.8),
    textField("social_worker_phone_number", "Social worker phone number", 26.2, 51.2, 26.0, 1.7, "phoneNumber"),
    textField("office", "Office", 61.2, 51.2, 31.8),
    ...classRow(1, 80.5),
    ...classRow(2, 83.5),
    ...classRow(3, 86.5),
    ...classRow(4, 89.5),
    textField("review_90_day", "90 day review day", 25.0, 95.4, 21.0),
    textField("review_90_date", "90 day review date", 51.5, 95.4, 15.8, 1.7, "date"),
    textField("review_90_time", "90 day review time", 72.8, 95.4, 13.0),
  ],
  layoutSettings: { paperSize: "letter", widthIn: 8.5, heightIn: 11 },
  displaySettings: { backgroundColor: "#ffffff" },
  sourceAssetPath: "ai_context/inbox_template/intake-information-cultural-broker-spa-8-07.png",
  updatedAt: "2026-05-14T16:50:37-07:00",
};
