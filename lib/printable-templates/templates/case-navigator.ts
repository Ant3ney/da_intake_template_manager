import type { PrintableTemplate, TemplateInputTypeId } from "../types";

const field = (
  inputId: string,
  label: string,
  xPercent: number,
  yPercent: number,
  widthPercent: number,
  heightPercent = 1.55,
  typeId: TemplateInputTypeId = "textLine",
) => ({
  inputId,
  typeId,
  label,
  bounds: { xPercent, yPercent, widthPercent, heightPercent },
  displaySettings: {
    useWhiteBackground: true,
    fontSizePt: 10,
    textAlign: "left" as const,
    ...(typeId === "date" ? { dateFormat: "MM/DD/YY" as const } : {}),
  },
});

const reviewRow = (rowNumber: number, yPercent: number) => [
  field(`review_${rowNumber}_day`, `90-day review ${rowNumber} day`, 9.5, yPercent, 18.9),
  field(`review_${rowNumber}_date`, `90-day review ${rowNumber} date`, 34.5, yPercent, 19.7, 1.55, "date"),
  field(`review_${rowNumber}_time`, `90-day review ${rowNumber} time`, 60.7, yPercent, 15.6),
];

const classColumns = [
  { id: "classes", label: "Class(es)", xPercent: 4.8, widthPercent: 17.8, typeId: "textLine" as const },
  { id: "instructor", label: "Instructor", xPercent: 22.7, widthPercent: 17.1, typeId: "textLine" as const },
  { id: "type", label: "Type", xPercent: 39.9, widthPercent: 10.6, typeId: "textLine" as const },
  { id: "weeks", label: "Weeks", xPercent: 50.6, widthPercent: 6.6, typeId: "number" as const },
  { id: "day", label: "Day", xPercent: 57.3, widthPercent: 7.7, typeId: "textLine" as const },
  { id: "time", label: "Time", xPercent: 65.1, widthPercent: 9.3, typeId: "textLine" as const },
  { id: "start", label: "Start", xPercent: 74.5, widthPercent: 9.5, typeId: "textLine" as const },
  { id: "end", label: "End", xPercent: 84.1, widthPercent: 9.5, typeId: "textLine" as const },
];

const classRow = (rowNumber: number, yPercent: number) =>
  classColumns.map((column) =>
    field(
      `class_${rowNumber}_${column.id}`,
      `Class ${rowNumber} ${column.label}`,
      column.xPercent,
      yPercent,
      column.widthPercent,
      2.9,
      column.typeId,
    ),
  );

export const caseNavigatorTemplate: PrintableTemplate = {
  pageId: "case-navigator",
  name: "Case Navigator",
  backgroundImage: {
    src: "/template-assets/case-navigator.png",
    widthPx: 1086,
    heightPx: 1448,
    mimeType: "image/png",
  },
  inputDefinitions: [
    ...reviewRow(1, 63.4),
    ...reviewRow(2, 65.55),
    ...reviewRow(3, 67.7),
    field("exit_interview_day", "Exit interview day", 25.8, 70.85, 15.4),
    field("exit_interview_date", "Exit interview date", 47.6, 70.85, 15.8, 1.55, "date"),
    field("exit_interview_time", "Exit interview time", 70.3, 70.85, 12.9),
    ...classRow(1, 77.0),
    ...classRow(2, 80.1),
    ...classRow(3, 83.2),
    ...classRow(4, 86.3),
  ],
  layoutSettings: { paperSize: "letter", widthIn: 8.5, heightIn: 11 },
  displaySettings: { backgroundColor: "#ffffff" },
  sourceAssetPath: "/template-assets/case-navigator.png",
  updatedAt: "2026-05-13T13:02:15-07:00",
};
