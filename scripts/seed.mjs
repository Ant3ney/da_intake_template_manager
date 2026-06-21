import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { inferQuestionText } from "../lib/printable-templates/question-text.ts";

const templateImports = [
  ["../lib/printable-templates/templates/agency-parenting-strengths-questions-06.ts", "agencyParentingStrengthsQuestionsTemplate"],
  ["../lib/printable-templates/templates/case-navigator-no-online.ts", "caseNavigatorNoOnlineTemplate"],
  ["../lib/printable-templates/templates/case-navigator.ts", "caseNavigatorTemplate"],
  ["../lib/printable-templates/templates/children-demographic-questions-04.ts", "childrenDemographicQuestionsTemplate"],
  ["../lib/printable-templates/templates/class-notification-virtual-only-signature-form-08.ts", "classNotificationVirtualOnlySignatureFormTemplate"],
  ["../lib/printable-templates/templates/dcfs-community-based-support-consent-release-page-1-07.ts", "dcfsCommunityBasedSupportConsentReleasePage1Template"],
  ["../lib/printable-templates/templates/del-aire-baptist-church-virtual-class-guidelines-02.ts", "delAireBaptistChurchVirtualClassGuidelines02Template"],
  ["../lib/printable-templates/templates/demographic-education-benefits-service-health-05.ts", "demographicEducationBenefitsServiceHealthTemplate"],
  ["../lib/printable-templates/templates/gender-identity-sexual-orientation-07.ts", "genderIdentitySexualOrientationTemplate"],
  ["../lib/printable-templates/templates/intake-information-cultural-broker-spa-8.ts", "intakeInformationCulturalBrokerSpa8Template"],
  ["../lib/printable-templates/templates/new-intake-checklist.ts", "newIntakeChecklistTemplate"],
  ["../lib/printable-templates/templates/nurturing-skills-for-families-about-me-page-1.ts", "nurturingSkillsForFamiliesAboutMePage1Template"],
  ["../lib/printable-templates/templates/nurturing-skills-for-families-childhood-parent-partner-page-2.ts", "nurturingSkillsForFamiliesChildhoodParentPartnerPage2Template"],
  ["../lib/printable-templates/templates/nurturing-skills-for-families-children-family-knowledge-page-3.ts", "nurturingSkillsForFamiliesChildrenFamilyKnowledgePage3Template"],
  ["../lib/printable-templates/templates/nurturing-skills-for-families-knowledge-utilization-page-4.ts", "nurturingSkillsForFamiliesKnowledgeUtilizationPage4Template"],
  ["../lib/printable-templates/templates/nurturing-skills-for-families-utilization-final-page-5.ts", "nurturingSkillsForFamiliesUtilizationFinalPage5Template"],
  ["../lib/printable-templates/templates/patient-intake-form.ts", "patientIntakeTemplate"],
  ["../lib/printable-templates/templates/pfs-2-retrospective-pre-post-cover.ts", "pfs2RetrospectivePrePostCoverTemplate"],
  ["../lib/printable-templates/templates/prevention-aftercare-confidentiality-informed-consent-agreement-01.ts", "preventionAftercareConfidentialityInformedConsentAgreementTemplate"],
  ["../lib/printable-templates/templates/prevention-aftercare-individualized-service-plan.ts", "preventionAftercareIndividualizedServicePlanTemplate"],
  ["../lib/printable-templates/templates/prevention-aftercare-mutual-agreement-signature-04.ts", "preventionAftercareMutualAgreementSignatureTemplate"],
  ["../lib/printable-templates/templates/prevention-aftercare-needs-assessment-page-1.ts", "preventionAftercareNeedsAssessmentPage1Template"],
  ["../lib/printable-templates/templates/prevention-aftercare-needs-assessment-page-1-copy.ts", "preventionAftercareNeedsAssessmentPage1CopyTemplate"],
  ["../lib/printable-templates/templates/prevention-aftercare-needs-assessment-page-2.ts", "preventionAftercareNeedsAssessmentPage2Template"],
  ["../lib/printable-templates/templates/prevention-aftercare-needs-assessment-page-3.ts", "preventionAftercareNeedsAssessmentPage3Template"],
  ["../lib/printable-templates/templates/prevention-aftercare-photo-video-permission-signature-02.ts", "preventionAftercarePhotoVideoPermissionSignatureTemplate"],
  ["../lib/printable-templates/templates/prevention-aftercare-program-intake-exit-form.ts", "preventionAftercareProgramIntakeExitFormTemplate"],
  ["../lib/printable-templates/templates/prevention-aftercare-welcome-program-overview-03.ts", "preventionAftercareWelcomeProgramOverviewTemplate"],
  ["../lib/printable-templates/templates/sbcc-prevention-and-aftercare-services-referral-form.ts", "sbccPreventionAndAftercareServicesReferralFormTemplate"],
  ["../lib/printable-templates/templates/sbcc-thriving-dads-motherhood-engagement-referral-form-01.ts", "sbccThrivingDadsMotherhoodEngagementReferralForm01Template"],
  ["../lib/printable-templates/templates/sbcc-thriving-dads-motherhood-engagement-referral-form-06.ts", "sbccThrivingDadsMotherhoodEngagementReferralFormTemplate"],
  ["../lib/printable-templates/templates/spa-intake-internal.ts", "spaIntakeInternalTemplate"],
  ["../lib/printable-templates/templates/survey-questions-family-life-01.ts", "surveyQuestionsFamilyLifeTemplate"],
  ["../lib/printable-templates/templates/survey-questions-housing-affordability-food-security-03.ts", "surveyQuestionsHousingAffordabilityFoodSecurityTemplate"],
  ["../lib/printable-templates/templates/survey-questions-social-support-basic-needs-02.ts", "surveyQuestionsSocialSupportBasicNeedsTemplate"],
  ["../lib/printable-templates/templates/survey-response-page-2.ts", "surveyResponsePage2Template"],
  ["../lib/printable-templates/templates/torrance-cultural-broker-needs-assessment.ts", "torranceCulturalBrokerNeedsAssessmentTemplate"],
  ["../lib/printable-templates/templates/womens-parenting-domestic-violence-commitment-form-05.ts", "womensParentingDomesticViolenceCommitmentFormTemplate"],
];

const printableTemplateCatalog = await Promise.all(
  templateImports.map(async ([modulePath, exportName]) => {
    const templateModule = await import(modulePath);
    return templateModule[exportName];
  }),
);
const now = new Date().toISOString();

const normalizeTemplate = (template) => ({
  ...template,
  notes: template.notes ?? "",
  inputDefinitions: template.inputDefinitions.map((input) => ({
    ...input,
    notes: input.notes ?? "",
    questionText: inferQuestionText(input),
  })),
});

const templates = printableTemplateCatalog.map((template) => {
  const seededTemplate = normalizeTemplate({ ...template, updatedAt: now });
  delete seededTemplate.html;
  delete seededTemplate.css;
  delete seededTemplate.javascript;
  return seededTemplate;
});

const dataDir = path.join(process.cwd(), "data");
await mkdir(dataDir, { recursive: true });
await writeFile(path.join(dataDir, "printable-templates.json"), `${JSON.stringify(templates, null, 2)}\n`);
console.log("[seed] Wrote data/printable-templates.json with sample PrintableTemplate entries.");
