import { caseNavigatorNoOnlineTemplate } from "./case-navigator-no-online";
import { caseNavigatorTemplate } from "./case-navigator";
import { newIntakeChecklistTemplate } from "./new-intake-checklist";
import { patientIntakeTemplate } from "./patient-intake-form";
import { pfs2RetrospectivePrePostCoverTemplate } from "./pfs-2-retrospective-pre-post-cover";
import { preventionAftercareProgramIntakeExitFormTemplate } from "./prevention-aftercare-program-intake-exit-form";
import { preventionAftercareIndividualizedServicePlanTemplate } from "./prevention-aftercare-individualized-service-plan";
import { preventionAftercareNeedsAssessmentPage1CopyTemplate } from "./prevention-aftercare-needs-assessment-page-1-copy";
import { preventionAftercareNeedsAssessmentPage1Template } from "./prevention-aftercare-needs-assessment-page-1";
import { preventionAftercareNeedsAssessmentPage2Template } from "./prevention-aftercare-needs-assessment-page-2";
import { preventionAftercareNeedsAssessmentPage3Template } from "./prevention-aftercare-needs-assessment-page-3";
import { surveyResponsePage2Template } from "./survey-response-page-2";
import { spaIntakeInternalTemplate } from "./spa-intake-internal";
import type { PrintableTemplate } from "../types";

// Register static template bases here. Each future form should live in its own
// template module and be added to this catalog.
export const printableTemplateCatalog: PrintableTemplate[] = [
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
