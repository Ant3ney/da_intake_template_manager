import type { TemplateInputDefinition, TemplateInputValue } from "./types";

export function valuesByInputId(inputValues: TemplateInputValue[]) {
  return new Map(inputValues.map((item) => [item.inputId, item.value]));
}

export function formatInputValue(definition: TemplateInputDefinition, value: TemplateInputValue["value"] | undefined) {
  if (value === null || value === undefined) return "";
  if (definition.typeId === "checkbox") return value === true || value === "true" ? "X" : "";
  if (definition.typeId !== "date") return String(value);

  const date = new Date(String(value));
  if (Number.isNaN(date.getTime())) return String(value);

  const yy = String(date.getUTCFullYear()).slice(-2);
  const yyyy = String(date.getUTCFullYear());
  const mm = String(date.getUTCMonth() + 1).padStart(2, "0");
  const dd = String(date.getUTCDate()).padStart(2, "0");

  switch (definition.displaySettings.dateFormat) {
    case "MMDDYY":
      return `${mm}${dd}${yy}`;
    case "YYMMDD":
      return `${yy}${mm}${dd}`;
    case "YYYY-MM-DD":
      return `${yyyy}-${mm}-${dd}`;
    case "MM/DD/YY":
    default:
      return `${mm}/${dd}/${yy}`;
  }
}
