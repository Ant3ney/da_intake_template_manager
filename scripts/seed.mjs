import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

const { caseNavigatorNoOnlineTemplate } = await import("../lib/printable-templates/templates/case-navigator-no-online.ts");
const { caseNavigatorTemplate } = await import("../lib/printable-templates/templates/case-navigator.ts");
const { newIntakeChecklistTemplate } = await import("../lib/printable-templates/templates/new-intake-checklist.ts");
const { patientIntakeTemplate } = await import("../lib/printable-templates/templates/patient-intake-form.ts");
const { pfs2RetrospectivePrePostCoverTemplate } = await import(
  "../lib/printable-templates/templates/pfs-2-retrospective-pre-post-cover.ts"
);
const { preventionAftercareIndividualizedServicePlanTemplate } = await import(
  "../lib/printable-templates/templates/prevention-aftercare-individualized-service-plan.ts"
);
const { preventionAftercareNeedsAssessmentPage1Template } = await import(
  "../lib/printable-templates/templates/prevention-aftercare-needs-assessment-page-1.ts"
);
const { preventionAftercareNeedsAssessmentPage1CopyTemplate } = await import(
  "../lib/printable-templates/templates/prevention-aftercare-needs-assessment-page-1-copy.ts"
);
const { preventionAftercareNeedsAssessmentPage2Template } = await import(
  "../lib/printable-templates/templates/prevention-aftercare-needs-assessment-page-2.ts"
);
const { preventionAftercareNeedsAssessmentPage3Template } = await import(
  "../lib/printable-templates/templates/prevention-aftercare-needs-assessment-page-3.ts"
);
const { preventionAftercareProgramIntakeExitFormTemplate } = await import(
  "../lib/printable-templates/templates/prevention-aftercare-program-intake-exit-form.ts"
);
const { spaIntakeInternalTemplate } = await import("../lib/printable-templates/templates/spa-intake-internal.ts");
const { surveyResponsePage2Template } = await import("../lib/printable-templates/templates/survey-response-page-2.ts");
const printableTemplateCatalog = [
  caseNavigatorNoOnlineTemplate,
  caseNavigatorTemplate,
  newIntakeChecklistTemplate,
  patientIntakeTemplate,
  pfs2RetrospectivePrePostCoverTemplate,
  preventionAftercareIndividualizedServicePlanTemplate,
  preventionAftercareNeedsAssessmentPage1Template,
  preventionAftercareNeedsAssessmentPage1CopyTemplate,
  preventionAftercareNeedsAssessmentPage2Template,
  preventionAftercareNeedsAssessmentPage3Template,
  preventionAftercareProgramIntakeExitFormTemplate,
  spaIntakeInternalTemplate,
  surveyResponsePage2Template,
];
const now = new Date().toISOString();
const templates = printableTemplateCatalog.map((template) => {
  const seededTemplate = { ...template, updatedAt: now };
  delete seededTemplate.html;
  delete seededTemplate.css;
  delete seededTemplate.javascript;
  return seededTemplate;
});

const dataDir = path.join(process.cwd(), "data");
await mkdir(dataDir, { recursive: true });
await writeFile(path.join(dataDir, "printable-templates.json"), `${JSON.stringify(templates, null, 2)}\n`);
console.log("[seed] Wrote data/printable-templates.json with sample PrintableTemplate entries.");
