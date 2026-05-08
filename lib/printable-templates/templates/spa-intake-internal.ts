import type { PrintableTemplate } from "../types";

const textLine = (inputId: string, label: string, xPercent: number, yPercent: number, widthPercent: number, heightPercent = 1.55) => ({
  inputId,
  typeId: "textLine" as const,
  label,
  bounds: { xPercent, yPercent, widthPercent, heightPercent },
  displaySettings: { useWhiteBackground: true, fontSizePt: 10, textAlign: "left" as const },
});

const dateLine = (inputId: string, label: string, xPercent: number, yPercent: number, widthPercent: number, heightPercent = 1.55) => ({
  inputId,
  typeId: "date" as const,
  label,
  bounds: { xPercent, yPercent, widthPercent, heightPercent },
  displaySettings: { useWhiteBackground: true, dateFormat: "MM/DD/YY" as const, fontSizePt: 10, textAlign: "left" as const },
});

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
    dateLine("appointment_date", "Appointment date", 50.2, 17.75, 14.3),
    textLine("appointment_time", "Appointment time", 77.6, 17.75, 14.6),
    textLine("appointment_made_at", "Date/time appointment made", 21.2, 21.68, 33.6),
    textLine("survey_number", "Survey number", 70.4, 21.68, 21.9),
    textLine("name", "Name", 14.5, 25.42, 77.7),
    textLine("address", "Address", 16.8, 29.03, 75.4),
    textLine("phone", "Phone", 17.7, 32.64, 74.5),
    textLine("email", "Email", 14.9, 36.25, 77.3),
    dateLine("date_of_birth", "DOB", 13.5, 39.87, 16.5),
    textLine("age", "Age", 35.2, 39.87, 7.9),
    textLine("ethnicity", "Ethnicity", 52.0, 39.87, 16.8),
    textLine("marital_status", "Marital status", 84.0, 39.87, 8.4),
    textLine("highest_grade_level", "Highest grade level", 28.4, 43.5, 23.9),
    textLine("services_received", "Services received", 68.0, 43.5, 24.4),
    textLine("children_count", "Number of children", 22.2, 47.12, 9.9),
    textLine("children_names", "Children names", 25.8, 50.74, 66.4),
    textLine("children_dob_age", "Children DOB/age", 17.8, 54.35, 74.4),
    textLine("social_worker_referral", "Social worker or referral name", 39.5, 57.97, 52.7),
    textLine("contact_phone_number", "Phone number", 24.0, 64.58, 27.0),
    textLine("office", "Office", 61.2, 64.58, 31.0),
    textLine("review_day", "90 day review day", 25.6, 95.67, 21.0),
    dateLine("review_date", "90 day review date", 53.4, 95.67, 16.2),
    textLine("review_time", "90 day review time", 77.8, 95.67, 11.2),
  ],
  layoutSettings: { paperSize: "letter", widthIn: 8.5, heightIn: 11 },
  displaySettings: { backgroundColor: "#ffffff" },
  sourceAssetPath: "/template-assets/spa-intake.png",
  updatedAt: "2026-05-08T00:00:00.000Z",
};
