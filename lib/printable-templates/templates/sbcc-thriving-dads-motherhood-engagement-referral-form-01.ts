import type {
  PrintableTemplate,
  TemplateCheckOption,
  TemplateInputDefinition,
  TemplateInputTypeId,
} from "../types";

const lineField = (
  inputId: string,
  label: string,
  xPercent: number,
  yPercent: number,
  widthPercent: number,
  heightPercent: number,
  typeId: TemplateInputTypeId = "textLine",
  fontSizePt = 10,
): TemplateInputDefinition => ({
  inputId,
  typeId,
  label,
  bounds: { xPercent, yPercent, widthPercent, heightPercent },
  displaySettings: {
    useWhiteBackground: true,
    fontSizePt,
    textAlign: "left",
    ...(typeId === "date" ? { dateFormat: "MM/DD/YY" as const } : {}),
  },
});

const option = (optionId: string, label: string, xPercent: number, yPercent: number): TemplateCheckOption => ({
  optionId,
  label,
  value: optionId,
  bounds: { xPercent, yPercent, widthPercent: 1.2, heightPercent: 1.2 },
});

const otherOption = (
  optionId: string,
  label: string,
  xPercent: number,
  yPercent: number,
  textBoxBounds: TemplateCheckOption["textBoxBounds"],
): TemplateCheckOption => ({
  ...option(optionId, label, xPercent, yPercent),
  isOtherOption: true,
  textBoxBounds,
  textPlaceholderText: "Other",
});

const choiceGroup = (
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

export const sbccThrivingDadsMotherhoodEngagementReferralForm01Template: PrintableTemplate = {
  pageId: "sbcc-thriving-dads-motherhood-engagement-referral-form-01",
  name: "SBCC Thriving Dads Motherhood Engagement Referral Form",
  backgroundImage: {
    src: "/template-assets/sbcc-thriving-dads-motherhood-engagement-referral-form-01.png",
    widthPx: 1103,
    heightPx: 1426,
    mimeType: "image/png",
  },
  inputDefinitions: [
    lineField("client_first_name", "Client first name", 22.0, 24.3, 18.5, 2.6, "firstName"),
    lineField("client_middle_name", "Client middle name", 41.2, 24.3, 16.0, 2.6),
    lineField("client_last_name", "Client last name", 58.0, 24.3, 21.0, 2.6, "lastName"),
    lineField("mother_age", "Mother's Age", 18.0, 30.5, 6.0, 2.1, "number"),
    lineField("mother_date_of_birth", "Mother's DOB", 8.1, 36.0, 16.6, 2.4, "date"),
    lineField("referring_agency", "Referring Agency", 60.1, 28.9, 30.2, 2.2),
    lineField("referring_person_name", "Referring Person's Name", 65.5, 32.7, 25.0, 2.2),
    lineField("referring_person_phone", "Referring Person's Phone", 68.1, 36.4, 22.4, 2.2, "phoneNumber"),
    lineField("street_address", "Street address", 12.5, 41.0, 43.0, 3.0),
    lineField("city", "City", 12.5, 46.3, 16.6, 2.5),
    lineField("state", "State", 30.1, 46.3, 12.2, 2.5),
    lineField("zip_code", "Zip Code", 43.2, 46.3, 12.5, 2.5),
    lineField("mother_phone", "Mother's Phone", 73.8, 41.6, 18.0, 2.2, "phoneNumber"),
    lineField("other_phone", "Other Phone", 67.0, 44.8, 25.0, 2.2, "phoneNumber"),
    lineField("email", "Email", 65.7, 48.1, 26.6, 2.2, "email"),
    choiceGroup("eligibility_criteria", "Eligibility Criteria", { xPercent: 27.5, yPercent: 63.5, widthPercent: 39.0, heightPercent: 2.5 }, [
      option("mother_expecting_child", "Mother expecting a child", 27.7, 63.6),
      option("mother_of_child", "Mother of a child", 47.5, 63.6),
      option("identify_as_mother", "Identify as a Mother", 62.5, 63.6),
    ]),
    lineField("print_mother_name", "Print Mother's Name", 6.7, 75.6, 24.5, 3.0),
    lineField("mother_signature", "Mother's Signature", 41.8, 75.6, 24.3, 3.2, "signature"),
    lineField("signature_date", "Date", 77.8, 75.6, 11.5, 2.8, "date"),
    choiceGroup("ethnicity", "Ethnicity", { xPercent: 14.5, yPercent: 81.2, widthPercent: 75.0, heightPercent: 6.0 }, [
      option("white", "White", 14.7, 81.2),
      option("african_american", "African-American", 21.8, 81.2),
      option("native_american", "Native American", 36.9, 81.2),
      option("latino", "Latino", 50.7, 81.2),
      option("asian", "Asian", 57.8, 81.2),
      option("pacific_islander", "Pacific Islander", 64.2, 81.2),
      otherOption("other", "Other", 8.0, 84.7, { xPercent: 14.5, yPercent: 84.2, widthPercent: 15.5, heightPercent: 2.0 }),
    ]),
    lineField("ethnicity_other", "Ethnicity other", 14.5, 84.2, 15.5, 2.0),
    lineField("client_language", "Client language", 19.0, 91.0, 16.4, 2.0),
  ],
  layoutSettings: { paperSize: "letter", widthIn: 8.5, heightIn: 11 },
  displaySettings: { backgroundColor: "#ffffff" },
  sourceAssetPath: "ai_context/inbox_template/sbcc_thriving_dads_motherhood_engagement_referral_form_01.png",
  updatedAt: "2026-05-15T11:04:10-07:00",
};
