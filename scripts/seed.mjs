import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

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
const noteStopPatterns = [
  ". Enter ",
  "? Enter ",
  ". Select ",
  "? Select ",
  ". Rating choices:",
  ". Choices:",
  "; Choices:",
  "; Rating choices:",
];

const directQuestionText = {
  "Gender.": "What is your gender?",
  "Race/Nationality.": "What is your race or nationality?",
  "Marital Status.": "What is your marital status?",
  "Number of children you have.": "How many children do you have?",
  "Highest grade you completed.": "What is the highest grade you completed?",
  "Current Employment-School status.": "What is your current employment or school status?",
  "Annual Household Income.": "What is your annual household income?",
  "Nurturing Parenting is.": "Which answer best describes nurturing parenting?",
  "Discipline means.": "What does discipline mean?",
  "Empathy means.": "What does empathy mean?",
  "Anger is.": "What is anger?",
  "Our self-worth is.": "What is self-worth?",
  "Free-text Other value for Question 6 Gender option e Other.": "What is your other gender response?",
  "Free-text Nationality line associated with Question 7 Race/Nationality; this is not the Question 7 letter answer field.": "What is your nationality?",
};

const questionStarters = ["are", "can", "did", "do", "does", "ever", "has", "have", "how", "is", "which", "why", "would"];

const stripInternalQuestionPrefix = (value) => value.replace(/^Question\s+\d+:\s*/i, "").trim();

const punctuateAsQuestion = (value) => {
  const trimmed = value.trim().replace(/\.$/, "");
  return trimmed.endsWith("?") ? trimmed : `${trimmed}?`;
};

const labelToQuestion = (label) => {
  const normalized = label.trim();
  const lower = normalized.toLowerCase();

  if (lower === "email") return "What is your email address?";
  if (lower === "date") return "What is the date?";
  if (lower.includes("signature")) return `Please provide ${lower}.`;
  if (lower.includes("initial")) return `Please provide ${lower}.`;
  if (lower.includes("phone")) return `What is the ${lower}?`;
  if (lower.includes("name")) return `What is the ${lower}?`;
  if (lower.includes("date of birth") || lower.includes("dob")) return `What is the ${lower}?`;
  if (lower.includes("age")) return `What is the ${lower}?`;
  if (lower.includes("address")) return `What is the ${lower}?`;

  return `What is the ${lower}?`;
};

const lowercaseFirst = (value) => (value ? `${value.charAt(0).toLowerCase()}${value.slice(1)}` : value);

const toSecondPerson = (value) =>
  value.replace(/\bmyself\b/gi, "yourself").replace(/\bmy\b/gi, "your").replace(/\bI\b/g, "you");

const utilizationStatementToQuestion = (value) => {
  const lower = value.toLowerCase();
  const startsLikeUtilizationStatement =
    /^(make|recognize|respond|give|have|spend|praise|model|honor|help|refer|use|express)\b/.test(lower);
  if (!startsLikeUtilizationStatement) return null;

  return punctuateAsQuestion(`How often do you ${lowercaseFirst(toSecondPerson(value))}`);
};

const sentenceToQuestion = (value) => {
  const withoutPrefix = stripInternalQuestionPrefix(value);
  const direct = directQuestionText[withoutPrefix];
  if (direct) return direct;

  const lower = withoutPrefix.toLowerCase();
  if (lower.startsWith("ever ")) {
    return punctuateAsQuestion(`Did you ${lowercaseFirst(withoutPrefix)}`);
  }
  if (withoutPrefix.includes("?")) return punctuateAsQuestion(withoutPrefix);
  if (lower.startsWith("pick the right way to ")) {
    return punctuateAsQuestion(`What is the right way to ${withoutPrefix.slice("Pick the right way to ".length).toLowerCase()}`);
  }
  if (lower.startsWith("please rate ")) {
    return punctuateAsQuestion(withoutPrefix.replace(/^Please rate\s+/i, "How would you rate "));
  }
  if (lower.startsWith("rate ")) {
    return punctuateAsQuestion(withoutPrefix.replace(/^Rate\s+/i, "How would you rate "));
  }
  const utilizationQuestion = utilizationStatementToQuestion(withoutPrefix);
  if (utilizationQuestion) return utilizationQuestion;

  const firstWord = lower.split(/\s+/)[0];
  if (questionStarters.includes(firstWord)) return punctuateAsQuestion(withoutPrefix);
  if (withoutPrefix.includes(":")) return punctuateAsQuestion(withoutPrefix);

  return labelToQuestion(withoutPrefix.replace(/\.$/, ""));
};

const questionTextLooksGenerated = (value) =>
  /^Question\s+\d+:/i.test(value.trim()) || /^What is the question \d+ answer\?$/i.test(value.trim());

const inferQuestionText = (input) => {
  if (input.questionText?.trim() && !questionTextLooksGenerated(input.questionText)) return input.questionText.trim();
  if (input.notes?.trim()) {
    let questionText = input.notes.trim();
    for (const pattern of noteStopPatterns) {
      const index = questionText.indexOf(pattern);
      if (index !== -1) {
        questionText = questionText.slice(0, index + 1);
        break;
      }
    }
    return sentenceToQuestion(questionText);
  }
  return labelToQuestion(input.label);
};

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
