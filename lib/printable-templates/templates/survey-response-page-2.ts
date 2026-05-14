import type { PrintableTemplate, TemplateCheckOption, TemplateInputDefinition } from "../types";

const option = (
  optionId: string,
  label: string,
  xPercent: number,
  yPercent: number,
  widthPercent = 1.0,
  heightPercent = 1.4,
): TemplateCheckOption => ({
  optionId,
  label,
  value: optionId,
  bounds: { xPercent, yPercent, widthPercent, heightPercent },
});

const otherOption = (
  optionId: string,
  label: string,
  xPercent: number,
  yPercent: number,
  textBoxBounds?: TemplateCheckOption["textBoxBounds"],
): TemplateCheckOption => ({
  ...option(optionId, label, xPercent, yPercent),
  isOtherOption: true,
  textBoxBounds,
  textPlaceholderText: "Other",
});

const checkboxGroup = (
  inputId: string,
  label: string,
  bounds: TemplateInputDefinition["bounds"],
  checkOptions: TemplateCheckOption[],
): TemplateInputDefinition => ({
  inputId,
  typeId: "checkbox",
  label,
  bounds,
  checkOptions,
  displaySettings: { useWhiteBackground: false, fontSizePt: 9, textAlign: "left" },
});

export const surveyResponsePage2Template: PrintableTemplate = {
  pageId: "survey-response-page-2",
  name: "Survey Response Page 2",
  backgroundImage: {
    src: "/template-assets/survey-response-page-2.png",
    widthPx: 1448,
    heightPx: 1086,
    mimeType: "image/png",
  },
  inputDefinitions: [
    checkboxGroup(
      "survey_completion_method",
      "Survey completion method",
      { xPercent: 7.9, yPercent: 9.9, widthPercent: 78.5, heightPercent: 6.0 },
      [
        option("face_to_face_interview", "In a face-to-face interview", 8.0, 10.2),
        option("participant_with_assistance", "By the participant with assistance", 39.3, 10.2),
        option("participant_without_staff", "By the participant without program staff present", 67.1, 10.2),
      ],
    ),
    checkboxGroup(
      "client_referral_source",
      "Client referral source",
      { xPercent: 7.9, yPercent: 20.1, widthPercent: 71.0, heightPercent: 3.0 },
      [
        option("self_referred", "Self-Referred", 8.1, 20.2),
        option("child_protective_services", "Child Protective Services", 24.4, 20.2),
        option("court", "Court", 41.2, 20.2),
        option("community_program", "Community Program", 60.2, 20.2),
        otherOption("other", "Other", 75.6, 20.2),
      ],
    ),
    checkboxGroup(
      "current_services",
      "Current services",
      { xPercent: 7.9, yPercent: 29.0, widthPercent: 79.0, heightPercent: 30.0 },
      [
        option("employment_development", "Employment Development", 8.0, 33.3),
        option("department_unemployment_disability", "Department (Unemployment, Disability)", 8.0, 38.0),
        option("dcfs", "Department of Children and Family Services", 23.8, 33.3),
        option("mental_health", "Department of Mental Health", 37.8, 33.3),
        option("public_social_services", "Department of Public Social Services", 50.1, 33.3),
        option("housing_authority", "Housing Authority", 60.6, 28.9),
        option("juvenile_justice", "Juvenile Justice", 73.1, 38.0),
        option("probation", "Probation", 84.4, 38.0),
        option("regional_center", "Regional Center", 8.0, 56.6),
        option("social_security_administration", "Social Security Administration", 28.6, 56.6),
        option("none_of_the_above", "None of the above", 48.5, 56.6),
        option("decline_to_answer", "Decline to answer", 67.8, 56.6),
      ],
    ),
    checkboxGroup(
      "program_type",
      "Program type",
      { xPercent: 7.9, yPercent: 66.3, widthPercent: 77.6, heightPercent: 21.5 },
      [
        option("adult_education", "Adult Education", 8.0, 66.6),
        option("advocacy", "Advocacy", 19.8, 66.6),
        option("co_parenting_class", "Co-Parenting Class", 31.9, 66.6),
        option("domestic_violence_group", "Domestic Violence Group", 44.5, 66.6),
        option("family_literacy", "Family Literacy", 56.5, 66.6),
        option("fatherhood_program", "Fatherhood Program", 67.6, 66.6),
        option("healthy_relationships", "Healthy Relationships", 79.6, 66.6),
        option("home_visiting", "Home Visiting", 8.0, 73.4),
        option("homeless_transitional_housing", "Homeless/Transitional Housing", 22.5, 73.4),
        option("individual_couples_family_counseling", "Individual/Couples/Family Counseling", 41.2, 73.4),
        option("job_skills_employment_prep", "Job Skills/Employment Prep", 61.5, 73.4),
        option("lgbtq_youth_support", "LGBTQ Youth Support", 77.4, 73.4),
        option("marriage_strengthening_prep", "Marriage Strengthening/Prep", 8.0, 79.1),
        option("parent_education", "Parent Education", 24.4, 79.1),
        option("parent_child_interaction", "Parent/Child Interaction", 35.7, 79.1),
        option("parent_support_group", "Parent Support Group", 49.5, 79.1),
        option("planned_crisis_respite", "Planned and/or Crisis Respite", 59.6, 79.1),
        option("pre_natal_class", "Pre-Natal Class", 70.8, 79.1),
        option("resource_referral", "Resource and Referral", 81.2, 79.1),
        option("skill_building_ed_for_children", "Skill Building/Ed for Children", 8.0, 85.4),
        otherOption("other", "Other", 49.5, 85.4, {
          xPercent: 8.2,
          yPercent: 91.2,
          widthPercent: 80.5,
          heightPercent: 5.6,
        }),
      ],
    ),
    {
      inputId: "other_curriculum",
      typeId: "textArea",
      label: "Other curriculum",
      bounds: { xPercent: 8.2, yPercent: 91.2, widthPercent: 80.5, heightPercent: 5.6 },
      displaySettings: { useWhiteBackground: true, fontSizePt: 10, textAlign: "left" },
    },
  ],
  layoutSettings: { paperSize: "letter", widthIn: 11, heightIn: 8.5 },
  displaySettings: { backgroundColor: "#ffffff" },
  sourceAssetPath: "ai_context/inbox_template/03.png",
  updatedAt: "2026-05-14T15:22:48-07:00",
};
