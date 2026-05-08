import { patientIntakeTemplate } from "./patient-intake-form";
import { spaIntakeInternalTemplate } from "./spa-intake-internal";
import type { PrintableTemplate } from "../types";

// Register static template bases here. Each future form should live in its own
// template module and be added to this catalog.
export const printableTemplateCatalog: PrintableTemplate[] = [
  patientIntakeTemplate,
  spaIntakeInternalTemplate,
];
