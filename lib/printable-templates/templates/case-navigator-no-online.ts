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
  field(`review_${rowNumber}_date`, `90-day review ${rowNumber} date`, 35.7, yPercent, 19.7, 1.55, "date"),
  field(`review_${rowNumber}_time`, `90-day review ${rowNumber} time`, 62.9, yPercent, 15.6),
];

const classColumns = [
  { id: "classes", label: "Class(es)", xPercent: 4.8, widthPercent: 18.7, typeId: "textLine" as const },
  { id: "instructor", label: "Instructor", xPercent: 23.6, widthPercent: 17.0, typeId: "textLine" as const },
  { id: "type", label: "Type", xPercent: 40.7, widthPercent: 10.5, typeId: "textLine" as const },
  { id: "weeks", label: "Weeks", xPercent: 51.3, widthPercent: 7.1, typeId: "number" as const },
  { id: "day", label: "Day", xPercent: 58.5, widthPercent: 8.2, typeId: "textLine" as const },
  { id: "time", label: "Time", xPercent: 66.8, widthPercent: 9.5, typeId: "textLine" as const },
  { id: "start", label: "Start", xPercent: 76.4, widthPercent: 9.9, typeId: "textLine" as const },
  { id: "end", label: "End", xPercent: 86.4, widthPercent: 9.2, typeId: "textLine" as const },
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

export const caseNavigatorNoOnlineTemplate: PrintableTemplate = {
  pageId: "case-navigator-no-online",
  name: "Case Navigator No Online",
  backgroundImage: {
    src: "/template-assets/case-navigator-no-online.png",
    widthPx: 1086,
    heightPx: 1448,
    mimeType: "image/png",
  },
  inputDefinitions: [
    ...reviewRow(1, 68.2),
    ...reviewRow(2, 70.45),
    ...reviewRow(3, 72.7),
    field("exit_interview_day", "Exit interview day", 26.5, 76.3, 15.8),
    field("exit_interview_date", "Exit interview date", 48.7, 76.3, 16.8, 1.55, "date"),
    field("exit_interview_time", "Exit interview time", 72.6, 76.3, 13.7),
    ...classRow(1, 82.0),
    ...classRow(2, 85.25),
    ...classRow(3, 88.5),
    ...classRow(4, 91.75),
  ],
  layoutSettings: { paperSize: "letter", widthIn: 8.5, heightIn: 11 },
  displaySettings: { backgroundColor: "#ffffff" },
  sourceAssetPath: "/template-assets/case-navigator-no-online.png",
  updatedAt: "2026-05-13T13:30:09-07:00",
};
