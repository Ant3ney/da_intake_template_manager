import type { TemplateInputTypeId } from "./types";

export function defaultPlaceholderForInput(typeId: TemplateInputTypeId, label = "value") {
  switch (typeId) {
    case "textArea":
      return `Enter ${label.toLowerCase()}`;
    case "date":
      return "MM/DD/YYYY";
    case "phoneNumber":
      return "(555) 555-5555";
    case "firstName":
      return "First name";
    case "lastName":
      return "Last name";
    case "email":
      return "name@example.com";
    case "number":
      return "123";
    case "checkbox":
      return "Checked";
    case "radio":
      return "Selected option";
    case "signature":
      return "Signature";
    case "initials":
      return "ABC";
    case "textLine":
    default:
      return `Enter ${label.toLowerCase()}`;
  }
}
