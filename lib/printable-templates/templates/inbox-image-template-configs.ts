import type { TemplateCheckOption, TemplateInputDefinition } from "../types";
import { choiceGroup, lineField, makeTemplate, option, otherOption } from "./inbox-image-template-helpers.ts";

const likertOptions = (yPercent: number): TemplateCheckOption[] => [
  option("not_at_all_like_my_life", "Not at all like my life", 6.4, yPercent),
  option("not_much_like_my_life", "Not much like my life", 24.5, yPercent),
  option("somewhat_like_my_life", "Somewhat like my life", 42.5, yPercent),
  option("quite_a_lot_like_my_life", "Quite a lot like my life", 60.9, yPercent),
  option("just_like_my_life", "Just like my life", 79.0, yPercent),
];

const agreementOptions = (yPercent: number): TemplateCheckOption[] => [
  option("strongly_disagree", "Strongly Disagree", 6.0, yPercent),
  option("disagree", "Disagree", 25.8, yPercent),
  option("neither_agree_nor_disagree", "Neither agree nor disagree", 41.5, yPercent),
  option("agree", "Agree", 62.8, yPercent),
  option("strongly_agree", "Strongly Agree", 79.7, yPercent),
];

const frequencyOptions = (yPercent: number): TemplateCheckOption[] => [
  option("never", "Never", 6.0, yPercent),
  option("rarely", "Rarely", 25.8, yPercent),
  option("sometimes", "Sometimes", 41.5, yPercent),
  option("often", "Often", 62.8, yPercent),
  option("almost_always", "Almost Always", 79.7, yPercent),
];

const surveyRadio = (
  inputId: string,
  label: string,
  yPercent: number,
  optionsForRow: TemplateCheckOption[],
): TemplateInputDefinition =>
  choiceGroup(inputId, "radio", label, { xPercent: 5.8, yPercent: yPercent - 0.3, widthPercent: 84.5, heightPercent: 5.0 }, optionsForRow);

const checkboxGroup = (
  inputId: string,
  label: string,
  bounds: TemplateInputDefinition["bounds"],
  options: TemplateCheckOption[],
): TemplateInputDefinition => choiceGroup(inputId, "checkbox", label, bounds, options);

const educationOptions = (topY: number): TemplateCheckOption[] => [
  option("elementary", "Elementary", 4.4, topY),
  option("junior_high_middle", "Junior High / Middle", 17.3, topY),
  option("some_high_school", "Some High School", 31.1, topY),
  option("high_school_diploma_ged", "High School Diploma or GED", 42.5, topY),
  option("trade_vocational_training", "Trade / Vocational Training", 55.1, topY),
  option("some_college", "Some College", 68.0, topY),
  option("two_year_degree", "2-year College Degree", 79.7, topY),
  option("four_year_degree", "4-year College Degree", 90.6, topY),
  option("masters_degree", "Master's Degree", 4.4, topY + 8.0),
  option("phd_advanced_degree", "PhD or other Advanced Degree", 36.0, topY + 8.0),
  option("decline_to_answer", "Decline to Answer", 72.1, topY + 8.0),
];

const benefitsOptions = (topY: number): TemplateCheckOption[] => [
  option("snap_food_stamps", "SNAP / Food Stamps", 4.4, topY),
  option("medicaid", "Medicaid", 17.3, topY),
  option("eitc", "Earned Income Tax Credit", 28.2, topY),
  option("tanf", "TANF", 41.1, topY),
  option("head_start_early_hs", "Head Start / Early HS", 53.2, topY),
  option("ssi", "SSI", 63.7, topY),
  option("ssdi", "SSDI", 75.0, topY),
  option("unemployment_benefits", "Unemployment Benefits", 85.4, topY),
  option("state_health_insurance", "State Health Insurance", 4.4, topY + 7.5),
  option("none_of_the_above", "None of the above", 28.2, topY + 7.5),
  otherOption("other", "Other", 53.2, topY + 7.5),
  option("decline_to_answer", "Decline to Answer", 77.8, topY + 7.5),
];

const healthOptions = (topY: number): TemplateCheckOption[] => [
  option("chronic_medical_condition", "I have a chronic medical condition", 4.4, topY),
  option("blind_or_difficulty_seeing", "I am blind or have serious difficulty seeing", 18.0, topY),
  option("deaf_or_difficulty_hearing", "I am deaf or have serious difficulty hearing", 30.9, topY),
  option("difficulty_walking", "I have serious difficulty walking or climbing stairs", 43.2, topY),
  option("difficulty_concentrating", "Serious difficulty concentrating, remembering, or making decisions", 55.9, topY),
  option("none_of_the_above", "None of the above", 72.6, topY + 6.4),
  option("decline_to_answer", "Decline to answer", 83.1, topY + 6.4),
  otherOption("other", "Other", 93.8, topY + 8.5),
];

const demographicPage5Inputs = (educationY: number, benefitsY: number, militaryY: number, healthY: number): TemplateInputDefinition[] => [
  checkboxGroup("highest_level_of_education", "Highest level of education", { xPercent: 4, yPercent: educationY - 1, widthPercent: 93, heightPercent: 16 }, educationOptions(educationY)),
  checkboxGroup("benefits_received", "Benefits received", { xPercent: 4, yPercent: benefitsY - 1, widthPercent: 91, heightPercent: 17 }, benefitsOptions(benefitsY)),
  choiceGroup(
    "served_active_duty",
    "radio",
    "Served on active duty",
    { xPercent: 4, yPercent: militaryY - 1, widthPercent: 65, heightPercent: 4 },
    [option("no", "No", 4.4, militaryY), option("yes", "Yes", 35.0, militaryY), option("decline_to_answer", "Decline to answer", 62.3, militaryY)],
  ),
  checkboxGroup("health_or_disability_descriptions", "Health or disability descriptions", { xPercent: 4, yPercent: healthY - 1, widthPercent: 91, heightPercent: 22 }, healthOptions(healthY)),
];

export const surveyQuestionsFamilyLifeTemplate = makeTemplate({
  pageId: "survey-questions-family-life-01",
  name: "Survey Questions Family Life",
  fileName: "survey-questions-family-life-01.png",
  widthPx: 1103,
  heightPx: 1427,
  inputDefinitions: [
    surveyRadio("future_looks_good_for_family", "The future looks good for our family", 10.7, likertOptions(10.7)),
    surveyRadio("family_listens_to_each_other", "In my family, we take time to listen to each other", 22.2, likertOptions(22.2)),
    surveyRadio("family_special_things", "There are things we do as a family that are special just to us", 33.9, likertOptions(33.9)),
    surveyRadio("child_misbehaves_to_upset_me", "My child misbehaves just to upset me", 45.5, likertOptions(45.5)),
    surveyRadio("always_telling_kids_no_stop", "I feel like I'm always telling my kids no or stop", 57.1, likertOptions(57.1)),
    surveyRadio("power_struggles_with_kids", "I have frequent power struggles with my kids", 68.8, likertOptions(68.8)),
    surveyRadio("response_depends_on_feeling", "How I respond to my child depends on how I'm feeling", 80.5, likertOptions(80.5)),
    surveyRadio("people_believe_in_me", "I have people who believe in me", 91.8, likertOptions(91.8)),
  ],
});

export const surveyQuestionsSocialSupportBasicNeedsTemplate = makeTemplate({
  pageId: "survey-questions-social-support-basic-needs-02",
  name: "Survey Questions Social Support and Basic Needs",
  fileName: "survey-questions-social-support-basic-needs-02.png",
  widthPx: 1119,
  heightPx: 1448,
  inputDefinitions: [
    surveyRadio("advice_when_hard_to_hear", "Someone gives me advice even when hard to hear", 7.0, likertOptions(7.0)),
    surveyRadio("friends_support_goals", "Friends support me when achieving a goal", 19.0, likertOptions(19.0)),
    surveyRadio("trusted_short_notice_childcare", "Can find trusted short notice childcare", 31.0, likertOptions(31.0)),
    checkboxGroup(
      "trusted_advice_topics",
      "People I trust to ask for advice about",
      { xPercent: 6.0, yPercent: 43.0, widthPercent: 80.0, heightPercent: 9.0 },
      [
        option("money_bills_budgeting", "Money/Bills/Budgeting", 7.3, 44.0),
        option("relationships_love_life", "Relationships and/or My Love Life", 26.5, 44.0),
        option("food_nutrition", "Food/Nutrition", 41.5, 44.0),
        option("stress_anxiety_depression", "Stress, Anxiety, and/or Depression", 56.0, 44.0),
        option("parenting_my_kids", "Parenting/My Kids", 68.4, 44.0),
        option("none_of_the_above", "None of the above", 82.8, 44.0),
      ],
    ),
    checkboxGroup(
      "unable_to_pay_for_needs_past_month",
      "Unable to pay for needs in the past month",
      { xPercent: 6.0, yPercent: 57.6, widthPercent: 84.0, heightPercent: 12.0 },
      [
        option("rent_or_mortgage", "Rent or mortgage", 7.3, 58.2),
        option("utilities_or_bills", "Utilities or bills", 21.0, 58.2),
        option("groceries_food", "Groceries/food", 39.6, 58.2),
        option("child_care_daycare", "Child care/daycare", 54.2, 58.2),
        option("medicine_medical_expenses", "Medicine, medical expenses, or co-pays", 67.5, 58.2),
        option("household_hygiene", "Basic household or personal hygiene items", 82.3, 58.2),
        option("transportation", "Transportation", 7.3, 65.0),
        option("able_to_pay_all", "I was able to pay for all of these", 49.7, 65.0),
      ],
    ),
    checkboxGroup(
      "past_year_hardships",
      "Past year hardships",
      { xPercent: 6.0, yPercent: 75.0, widthPercent: 84.5, heightPercent: 19.0 },
      [
        option("delayed_medical_dental_care", "Delayed or not gotten medical or dental care", 7.3, 75.2),
        option("evicted", "Been evicted from your home or apartment", 20.8, 75.2),
        option("shelter_hotel_vehicle", "Lived at a shelter, hotel/motel, abandoned building, or vehicle", 31.8, 75.2),
        option("moved_in_with_others", "Moved in with other people temporarily", 45.6, 75.2),
        option("lost_transportation", "Lost access to regular transportation", 57.0, 80.8),
        option("unemployed_when_needed_job", "Been unemployed when really needed a job", 70.4, 75.2),
        option("none_apply", "None of these apply to me", 84.0, 75.2),
      ],
    ),
  ],
});

export const surveyQuestionsHousingAffordabilityFoodSecurityTemplate = makeTemplate({
  pageId: "survey-questions-housing-affordability-food-security-03",
  name: "Survey Questions Housing Affordability and Food Security",
  fileName: "survey-questions-housing-affordability-food-security-03.png",
  widthPx: 1119,
  heightPx: 1448,
  inputDefinitions: [
    checkboxGroup(
      "past_year_hardships_continued",
      "Past year hardships",
      { xPercent: 5.0, yPercent: 8.5, widthPercent: 91.0, heightPercent: 28.0 },
      [
        option("delayed_medical_dental_care", "Delayed or not gotten medical or dental care", 5.1, 8.8),
        option("evicted", "Been evicted from your home or apartment", 19.7, 8.8),
        option("shelter_hotel_vehicle", "Lived at a shelter, hotel/motel, abandoned building, or vehicle", 31.9, 8.8),
        option("moved_in_with_others", "Moved in with other people temporarily", 45.0, 8.8),
        option("lost_transportation", "Lost access to regular transportation", 58.8, 8.8),
        option("unemployed_when_needed_job", "Been unemployed when really needed a job", 75.1, 8.8),
        option("none_apply", "None of these apply to me", 88.8, 8.8),
      ],
    ),
    surveyRadio("trouble_affording_monthly_needs", "Trouble affording what I need each month", 47.0, frequencyOptions(47.0)),
    surveyRadio("afford_food_for_family", "Able to afford food wanted for family", 61.9, frequencyOptions(61.9)),
  ],
});

export const childrenDemographicQuestionsTemplate = makeTemplate({
  pageId: "children-demographic-questions-04",
  name: "Children and Demographic Questions",
  fileName: "children-demographic-questions-04.png",
  widthPx: 1119,
  heightPx: 1448,
  inputDefinitions: [
    ...[8.2, 10.0, 11.8, 13.6, 15.4].flatMap((y, index) => [
      lineField(`child_${index + 1}_date_of_birth`, `Child ${index + 1} date of birth`, 8.2, y, 19.7, 1.7, "date", 9),
      lineField(`child_${index + 1}_gender`, `Child ${index + 1} gender`, 28.0, y, 8.0, 1.7, "textLine", 9),
      lineField(`child_${index + 1}_relationship`, `Child ${index + 1} relationship`, 36.4, y, 28.2, 1.7, "textLine", 9),
      lineField(`child_${index + 1}_in_home`, `Child ${index + 1} in home`, 65.2, y, 26.6, 1.7, "textLine", 9),
    ]),
    choiceGroup("sex", "radio", "Sex", { xPercent: 7.5, yPercent: 22.1, widthPercent: 78, heightPercent: 3.8 }, [
      option("male", "Male", 7.6, 22.4),
      option("female", "Female", 36.4, 22.4),
      option("prefer_not_to_answer", "Prefer not to Answer", 66.0, 22.4),
    ]),
    lineField("age_years", "Age in years", 7.8, 26.4, 84.0, 4.0, "number", 11),
    checkboxGroup("primary_language", "Primary language spoken at home", { xPercent: 7.5, yPercent: 35.2, widthPercent: 85, heightPercent: 8.0 }, [
      option("english", "English", 7.6, 35.3),
      option("spanish", "Spanish", 17.4, 35.3),
      option("armenian", "Armenian", 27.4, 35.3),
      option("cambodian_chinese", "Cambodian Chinese", 39.2, 35.3),
      option("farsi", "Farsi", 51.8, 35.3),
      option("korean", "Korean", 61.6, 35.3),
      option("tagalog", "Tagalog", 72.8, 35.3),
      option("vietnamese", "Vietnamese", 83.1, 35.3),
      option("creole", "Creole", 7.6, 39.6),
      option("arabic", "Arabic", 19.9, 39.6),
      otherOption("other", "Other", 65.6, 39.6),
      option("decline_to_answer", "Decline to Answer", 83.1, 39.6),
    ]),
    checkboxGroup("race_ethnicity", "Race/Ethnicity", { xPercent: 7.5, yPercent: 47.3, widthPercent: 85, heightPercent: 8.5 }, [
      option("native_american_alaskan_native", "Native American or Alaskan Native", 7.6, 47.3),
      option("black_african_american", "Black or African American", 20.5, 47.3),
      option("native_hawaiian_pacific_islander", "Native Hawaiian/Pacific Islander", 31.4, 47.3),
      option("asian", "Asian", 46.1, 47.3),
      option("white_non_hispanic", "White (Non-Hispanic/European American)", 57.5, 47.3),
      option("multiracial", "Multi-racial", 74.1, 47.3),
      otherOption("other_race", "Other race", 83.7, 47.3),
      option("decline_to_answer", "Decline to answer", 7.6, 55.3),
    ]),
    checkboxGroup("origin_or_ancestry", "Place of origin or ancestry", { xPercent: 7.5, yPercent: 60.8, widthPercent: 85, heightPercent: 13.0 }, [
      option("caribbean", "Caribbean", 7.6, 60.8),
      option("central_american", "Central American", 19.8, 60.8),
      option("mexican_chicano", "Mexican/Mexican-American/Chicano", 31.4, 60.8),
      option("puerto_rican", "Puerto Rican", 48.5, 60.8),
      option("north_american", "North American", 58.7, 60.8),
      option("south_american", "South American", 70.2, 60.8),
      option("african", "African", 82.0, 60.8),
      option("asian_indian_south_asian", "Asian Indian/South Asian", 7.6, 64.7),
      option("cambodian", "Cambodian", 19.8, 64.7),
      option("chinese", "Chinese", 31.4, 64.7),
      option("filipino", "Filipino", 46.9, 64.7),
      option("japanese", "Japanese", 58.7, 64.7),
      option("korean", "Korean", 70.2, 64.7),
      option("vietnamese", "Vietnamese", 82.0, 64.7),
      option("european", "European", 7.6, 69.5),
      option("eastern_european", "Eastern European", 25.4, 69.5),
      option("middle_eastern", "Middle Eastern", 38.3, 69.5),
      otherOption("other", "Other", 53.6, 69.5),
      option("more_than_one_ethnicity", "More than one ethnicity", 66.6, 69.5),
      option("decline_to_answer", "Decline to answer", 82.0, 69.5),
    ]),
    checkboxGroup("relationship_status", "Relationship status", { xPercent: 7.5, yPercent: 75.1, widthPercent: 85, heightPercent: 5.0 }, [
      option("married", "Married", 7.6, 75.1),
      option("partnered", "Partnered", 20.6, 75.1),
      option("single_never_married", "Single - Never Married", 33.6, 75.1),
      option("divorced", "Divorced", 46.1, 75.1),
      option("widowed", "Widowed", 58.7, 75.1),
      option("separated", "Separated", 71.2, 75.1),
      option("decline_to_answer", "Decline to Answer", 83.7, 75.1),
    ]),
    checkboxGroup("family_housing", "Family housing", { xPercent: 7.5, yPercent: 81.4, widthPercent: 85, heightPercent: 5.0 }, [
      option("own", "Own", 7.6, 81.6),
      option("rent", "Rent", 23.0, 81.6),
      option("shared_housing", "Shared Housing with relatives / friends", 36.3, 81.6),
      option("temporary", "Temporary", 53.3, 81.6),
      option("homeless", "Homeless", 68.0, 81.6),
      option("decline_to_answer", "Decline to Answer", 83.5, 80.9),
    ]),
    checkboxGroup("family_income", "Family income", { xPercent: 7.5, yPercent: 89.2, widthPercent: 85, heightPercent: 6.0 }, [
      option("0_10000", "$0 - $10000", 7.6, 89.2),
      option("10001_20000", "$10001 - $20000", 18.6, 89.2),
      option("20001_30000", "$20001 - $30000", 30.0, 89.2),
      option("30001_40000", "$30001 - $40000", 41.2, 89.2),
      option("40001_50000", "$40001 - $50000", 51.8, 89.2),
      option("50001_60000", "$50001 - $60000", 62.6, 89.2),
      option("more_than_60001", "more than $60001", 73.2, 89.2),
      option("unemployed", "Unemployed", 83.7, 89.2),
      option("decline_to_answer", "Decline to Answer", 7.6, 93.2),
    ]),
  ],
});

export const demographicEducationBenefitsServiceHealthTemplate = makeTemplate({
  pageId: "demographic-education-benefits-service-health-05",
  name: "Demographic Education Benefits Service and Health",
  fileName: "demographic-education-benefits-service-health-05.png",
  widthPx: 1119,
  heightPx: 1448,
  inputDefinitions: demographicPage5Inputs(6.1, 23.1, 39.6, 47.1),
});

export const agencyParentingStrengthsQuestionsTemplate = makeTemplate({
  pageId: "agency-parenting-strengths-questions-06",
  name: "Agency Parenting Strengths Questions",
  fileName: "agency-parenting-strengths-questions-06.png",
  widthPx: 1119,
  heightPx: 1448,
  inputDefinitions: [
    surveyRadio("dont_know_what_to_do_as_parent", "Many times I don't know what to do as parent", 10.7, agreementOptions(10.7)),
    surveyRadio("know_how_to_help_child_learn", "I know how to help my child learn", 22.1, agreementOptions(22.1)),
    surveyRadio("praise_child_behaves_well", "I praise my child when he/she behaves well", 33.7, frequencyOptions(33.7)),
    surveyRadio("lose_control_when_disciplining", "When I discipline my child, I lose control", 43.5, frequencyOptions(43.5)),
    surveyRadio("person_with_many_strengths", "I think I am a person with many strengths", 53.0, agreementOptions(53.0)),
    surveyRadio("resolve_disagreements", "I am good at resolving disagreements", 63.0, agreementOptions(63.0)),
    surveyRadio("do_things_even_when_hard", "I make myself do things I need to even when hard", 72.8, agreementOptions(72.8)),
    surveyRadio("happy_about_life", "There are things that make me happy about life", 82.4, agreementOptions(82.4)),
    surveyRadio("take_positive_steps_when_anxious", "Take positive steps when anxious, angry, or depressed", 92.0, agreementOptions(92.0)),
  ],
});

export const genderIdentitySexualOrientationTemplate = makeTemplate({
  pageId: "gender-identity-sexual-orientation-07",
  name: "Gender Identity and Sexual Orientation",
  fileName: "gender-identity-sexual-orientation-07.png",
  widthPx: 1119,
  heightPx: 1448,
  inputDefinitions: [
    surveyRadio("take_positive_steps_now", "NOW take positive steps when anxious, angry, or depressed", 10.0, agreementOptions(10.0)),
    choiceGroup("gender_identity", "radio", "How do you describe yourself", { xPercent: 6.5, yPercent: 21.0, widthPercent: 86, heightPercent: 11.0 }, [
      option("male", "Male", 7.0, 21.0),
      option("female", "Female", 20.6, 21.0),
      option("transgender", "Transgender", 33.0, 21.0),
      option("gender_queer", "Gender queer / Do not identify as male, female, or transgender", 47.0, 21.0),
      option("another_identity", "Another Identity", 60.5, 21.0),
      option("questioning_gender", "Questioning or unsure of my gender identity", 71.8, 21.0),
      option("decline_to_answer", "Decline to answer", 85.8, 21.0),
    ]),
    choiceGroup("sexual_orientation", "radio", "Do you consider yourself to be", { xPercent: 6.5, yPercent: 40.8, widthPercent: 86, heightPercent: 7.0 }, [
      option("heterosexual_straight", "Heterosexual or Straight", 7.0, 41.0),
      option("bisexual", "Bisexual", 22.3, 41.0),
      option("gay_lesbian", "Gay or Lesbian", 35.2, 41.0),
      option("questioning_unsure", "Questioning or unsure", 47.2, 41.0),
      option("queer", "Queer", 61.0, 41.0),
      option("none_of_above_other", "None of the above or other", 73.5, 41.0),
      option("decline_to_answer", "Decline to answer", 85.8, 41.0),
    ]),
  ],
});

export const sbccThrivingDadsMotherhoodEngagementReferralFormTemplate = makeTemplate({
  pageId: "sbcc-thriving-dads-motherhood-engagement-referral-form-06",
  name: "SBCC Thriving Dads Motherhood Engagement Referral Form",
  fileName: "sbcc-thriving-dads-motherhood-engagement-referral-form-06.png",
  widthPx: 1086,
  heightPx: 1448,
  inputDefinitions: demographicPage5Inputs(6.1, 23.6, 40.0, 47.6),
});

export const preventionAftercareConfidentialityInformedConsentAgreementTemplate = makeTemplate({
  pageId: "prevention-aftercare-confidentiality-informed-consent-agreement-01",
  name: "Prevention and Aftercare Confidentiality/Informed Consent Agreement",
  fileName: "prevention-aftercare-confidentiality-informed-consent-agreement-01.png",
  widthPx: 1103,
  heightPx: 1426,
  inputDefinitions: [
    lineField("participant_name", "Participant Name", 24.0, 13.4, 33.0, 2.1),
    lineField("guardian_name", "Guardian Name if under 18", 32.0, 15.1, 28.0, 2.1),
  ],
});

export const preventionAftercarePhotoVideoPermissionSignatureTemplate = makeTemplate({
  pageId: "prevention-aftercare-photo-video-permission-signature-02",
  name: "Prevention and Aftercare Photo Video Permission Signature",
  fileName: "prevention-aftercare-photo-video-permission-signature-02.png",
  widthPx: 1103,
  heightPx: 1426,
  inputDefinitions: [
    choiceGroup("photo_video_permission", "radio", "Photo and video permission", { xPercent: 16.5, yPercent: 31.7, widthPercent: 12.5, heightPercent: 4.5 }, [
      option("do_give_permission", "I do", 16.6, 31.8),
      option("do_not_give_permission", "I do not", 16.6, 34.1),
    ]),
    lineField("consent_effective_date", "Consent effective date", 66.6, 48.6, 10.2, 2.2, "date"),
    lineField("participant_signature", "Signature of P&A Participant", 11.9, 55.9, 29.9, 3.2, "signature"),
    lineField("staff_signature", "Staff signature", 12.2, 72.0, 22.2, 3.2, "signature"),
    lineField("staff_date", "Staff date", 43.9, 72.0, 12.8, 2.2, "date"),
  ],
});

export const preventionAftercareWelcomeProgramOverviewTemplate = makeTemplate({
  pageId: "prevention-aftercare-welcome-program-overview-03",
  name: "Prevention and Aftercare Welcome Program Overview",
  fileName: "prevention-aftercare-welcome-program-overview-03.png",
  widthPx: 1086,
  heightPx: 1448,
  inputDefinitions: [lineField("case_navigator_name", "Case Navigator Name", 21.3, 87.2, 57.5, 3.0, "textLine", 11)],
});

export const preventionAftercareMutualAgreementSignatureTemplate = makeTemplate({
  pageId: "prevention-aftercare-mutual-agreement-signature-04",
  name: "Prevention and Aftercare Mutual Agreement Signature",
  fileName: "prevention-aftercare-mutual-agreement-signature-04.png",
  widthPx: 1086,
  heightPx: 1448,
  inputDefinitions: [
    lineField("visits_per_month", "Visits per month", 28.4, 20.6, 6.2, 2.0, "number", 10),
    lineField("program_months", "Program months", 55.8, 30.2, 8.0, 2.0, "number", 10),
    lineField("client_signature", "Client Signature", 50.0, 70.7, 28.2, 3.4, "signature"),
    lineField("client_signature_date", "Date", 78.2, 70.8, 11.0, 2.2, "date"),
  ],
});

export const womensParentingDomesticViolenceCommitmentFormTemplate = makeTemplate({
  pageId: "womens-parenting-domestic-violence-commitment-form-05",
  name: "Women's Parenting Domestic Violence Program Commitment Form",
  fileName: "womens-parenting-domestic-violence-commitment-form-05.png",
  widthPx: 1086,
  heightPx: 1448,
  inputDefinitions: [
    lineField("participant_name", "Participant name", 11.8, 13.6, 16.6, 2.0),
    lineField("program_weeks", "Program weeks", 83.2, 16.2, 7.7, 2.0, "number"),
    lineField("facilitator_print_name", "Facilitator print name", 10.4, 75.4, 20.2, 2.4),
    lineField("facilitator_signature", "Facilitator sign name", 47.0, 75.1, 19.7, 3.0, "signature"),
    lineField("facilitator_date", "Facilitator date", 78.0, 75.4, 9.0, 2.4, "date"),
    lineField("mother_print_name", "Mother print name", 10.4, 83.2, 20.2, 2.4),
    lineField("mother_signature", "Mother sign name", 47.0, 83.0, 19.7, 3.0, "signature"),
    lineField("mother_date", "Mother date", 78.0, 83.2, 9.0, 2.4, "date"),
  ],
});

export const dcfsCommunityBasedSupportConsentReleasePage1Template = makeTemplate({
  pageId: "dcfs-community-based-support-consent-release-page-1-07",
  name: "DCFS Community Based Support Consent Release Page 1",
  fileName: "dcfs-community-based-support-consent-release-page-1-07.png",
  widthPx: 1086,
  heightPx: 1448,
  inputDefinitions: [
    lineField("case_name", "Case Name", 9.6, 13.4, 55.0, 3.0),
    lineField("case_number", "Case Number", 67.0, 13.4, 25.0, 3.0),
    lineField("parent_guardian_name_1", "Parent/Guardian Name", 9.6, 17.6, 55.0, 3.0),
    lineField("parent_guardian_1_date_of_birth", "Parent/Guardian Date of Birth", 69.2, 17.6, 21.0, 3.0, "date"),
    lineField("parent_guardian_name_2", "Parent/Guardian Name 2", 9.6, 21.6, 55.0, 3.0),
    lineField("parent_guardian_2_date_of_birth", "Parent/Guardian 2 Date of Birth", 67.0, 21.6, 25.0, 3.0, "date"),
    ...[28.5, 31.0, 33.6, 36.1, 38.7, 41.3].flatMap((y, index) => [
      lineField(`child_${index + 1}_name`, `Child ${index + 1} name`, 10.3, y, 51.2, 2.0),
      lineField(`child_${index + 1}_date_of_birth`, `Child ${index + 1} date of birth`, 66.7, y, 24.2, 2.0, "date", 9),
    ]),
    lineField("parent_guardian_signature", "Signature of Parent(s) Guardian(s)", 8.0, 69.8, 55.4, 3.6, "signature"),
    lineField("parent_guardian_signature_date", "Date of Signature", 66.7, 69.8, 24.7, 2.5, "date"),
    lineField("csw_signature", "Children's Social Worker Signature", 8.0, 77.8, 55.4, 3.2, "signature"),
    lineField("csw_signature_date", "CSW Date of Signature", 66.7, 77.8, 24.7, 2.5, "date"),
    checkboxGroup("authorized_referral_program", "Program authorized for referral", { xPercent: 7.5, yPercent: 83.2, widthPercent: 76.5, heightPercent: 6.8 }, [
      option("apss", "Adoption, Promotion & Support Services (APSS)", 7.5, 83.4),
      option("capit", "Child Abuse Prevention, Intervention & Treatment (CAPIT)", 7.5, 85.2),
      option("fpp", "Family Preservation Program (FPP)", 7.5, 87.1),
      option("pff", "Partnership for Families (PFF)", 54.1, 83.4),
      option("pna", "Prevention and Aftercare Services (PnA)", 54.1, 85.2),
      otherOption("other", "Other", 54.1, 87.1, { xPercent: 62.2, yPercent: 86.5, widthPercent: 21.2, heightPercent: 2.0 }),
    ]),
  ],
});

export const classNotificationVirtualOnlySignatureFormTemplate = makeTemplate({
  pageId: "class-notification-virtual-only-signature-form-08",
  name: "Class Notification Virtual Only Signature Form",
  fileName: "class-notification-virtual-only-signature-form-08.png",
  widthPx: 1103,
  heightPx: 1426,
  inputDefinitions: [
    lineField("date", "Date", 19.5, 9.6, 25.0, 2.8, "date", 11),
    checkboxGroup("notified_classes", "Notified classes", { xPercent: 13.5, yPercent: 26.2, widthPercent: 4.5, heightPercent: 22.0 }, [
      option("mens_anger_management", "Men's Anger Management Class", 13.6, 26.2, 2.2, 2.2),
      option("womens_domestic_violence", "Women's Domestic Violence Class", 13.6, 44.4, 2.2, 2.2),
    ]),
    lineField("signature", "Signature", 13.4, 65.0, 31.4, 3.2, "signature", 11),
    lineField("signature_date", "Signature date", 66.2, 65.0, 11.8, 2.8, "date", 11),
  ],
});
