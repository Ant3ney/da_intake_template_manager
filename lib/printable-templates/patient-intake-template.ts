import type { PrintableTemplate } from "./types";

export const patientIntakeTemplate: PrintableTemplate = {
  pageId: "patient-intake-form",
  name: "Patient Intake Form",
  html: `
    <section class="patient-intake-sheet">
      <div class="patient-intake-table">
        <div class="cell section span-4">Patient Information</div>
        <div class="cell span-3">Name</div><div class="cell">DOB (MM/DD/YYYY):</div>
        <div class="cell span-2">Gender: [] Male [] Female [] Other: ____________</div><div class="cell span-2">Preferred Pronouns: [] He/Him [] She/Her [] They/Them [] Other: ____________</div>
        <div class="cell span-3">Address:</div><div class="cell">City</div>
        <div class="cell">State:</div><div class="cell">Zip:</div><div class="cell span-2">Phone:</div>
        <div class="cell span-2">Email:</div><div class="cell span-2">Preferred Contact Method: [] Phone [] Email []Text</div>
        <div class="cell span-3">Emergency Contact Name:</div><div class="cell">Phone:</div>
        <div class="cell span-4">Relationship to Patient</div>
        <div class="cell section span-4">Insurance Information (if applicable)</div>
        <div class="cell span-2">Provider:</div><div class="cell span-2">Policy number:</div>
        <div class="cell span-2">Group Number:</div><div class="cell span-2">Policyholder Name</div>
        <div class="cell span-4">Relationship to Patient: [] Self [] Spouse [] Parent [] Other: ____________</div>
        <div class="cell section span-4">Reason for Visit</div>
        <div class="cell span-4">Primary Reason for Visit:</div>
        <div class="cell span-2">How long have you had this issue?</div><div class="cell span-2">Have you been treated for this before? [] Yes [] No</div>
        <div class="cell section span-4">Medical History Summary</div>
        <div class="cell span-4">Do you have any of the following conditions? (Check all that apply) [] Diabetes [] Hypertension [] Heart Disease [] Asthma []<br />Cancer [] Stroke [] Other: ____________</div>
        <div class="cell span-2">Are you currently taking any<br />medications? [] Yes [] No</div><div class="cell span-2">If yes, list medications:</div>
        <div class="cell span-2">Do you have any allergies? [] Yes []<br />No</div><div class="cell span-2">If yes, list allergies:</div>
        <div class="cell span-2">Have you had any surgeries or<br />hospitalizations? [] Yes [] No</div><div class="cell span-2">If yes, list procedures and dates:</div>
        <div class="cell section span-4">Lifestyle and Social History</div>
        <div class="cell span-4">Do you smoke or use tobacco products? [] Yes [] No [] Former Smoker</div>
        <div class="cell span-4">Do you consume alcohol? [] Yes [] No [] Occasionally</div>
        <div class="cell span-4">Do you use recreational drugs? [] Yes [] No</div>
        <div class="cell span-4">Occupation:</div>
        <div class="cell span-4">Do you have any concerns about access to healthcare, transportation, or financial barriers? [] Yes [] No</div>
        <div class="cell span-4">If yes, please describe: _______________________________________</div>
        <div class="cell section span-4">Pharmacy Information</div>
        <div class="cell span-2">Preferred Pharmacy Name:</div><div class="cell span-2">Phone Number:</div>
        <div class="cell span-4">Address:</div>
        <div class="cell section span-4">Consent and Signature</div>
        <div class="cell span-4">I confirm that the information provided is accurate to the best of my knowledge.</div>
        <div class="cell span-3 signature-cell">Signature:</div><div class="cell signature-cell">Date:</div>
      </div>
    </section>
  `,
  css: `
    .patient-intake-sheet {
      box-sizing: border-box;
      position: relative;
      width: 100%;
      height: 100%;
      background: #fff;
      color: #000;
      font-family: Arial, Helvetica, sans-serif;
    }
    .patient-intake-table {
      position: absolute;
      left: 1.7973856209%;
      right: 1.7973856209%;
      top: 2.7777777778%;
      bottom: 2.7777777778%;
      display: grid;
      grid-template-columns: minmax(0, 12.5fr) minmax(0, 16.5fr) minmax(0, 42fr) minmax(0, 29fr);
      grid-template-rows: minmax(0, 1fr) minmax(0, 1fr) minmax(0, 1.9fr) minmax(0, 1fr) minmax(0, 1fr) minmax(0, 1fr) minmax(0, 1fr) minmax(0, 1fr) minmax(0, 1fr) minmax(0, 1fr) minmax(0, 1fr) minmax(0, 1fr) minmax(0, 1fr) minmax(0, 1.7fr) minmax(0, 1.9fr) minmax(0, 1fr) minmax(0, 1.7fr) minmax(0, 2.3fr) minmax(0, 2.3fr) minmax(0, 2.3fr) minmax(0, 1fr) minmax(0, 1fr) minmax(0, 1fr) minmax(0, 1fr) minmax(0, 1fr) minmax(0, 1fr) minmax(0, 1fr) minmax(0, 1fr) minmax(0, 1fr) minmax(0, 1fr) minmax(0, 1fr) minmax(0, 1.45fr);
      font-size: 9.8pt;
      line-height: 1.24;
      font-weight: 400;
      outline: 1px solid #000;
    }
    .patient-intake-table .cell {
      outline: 1px solid #000;
      padding: 2px 4px;
      overflow: hidden;
      min-width: 0;
      min-height: 0;
    }
    .patient-intake-table em { font-style: italic; }
    .patient-intake-table .section {
      background: #eeeeee;
    }
    .patient-intake-table .span-2 { grid-column: span 2; }
    .patient-intake-table .span-3 { grid-column: span 3; }
    .patient-intake-table .span-4 { grid-column: span 4; }
    .patient-intake-table .signature-cell {
      display: flex;
      align-items: flex-end;
    }
  `,
  javascript: "",
  inputDefinitions: [
    {
      inputId: "name",
      typeId: "textLine",
      label: "Name",
      bounds: { xPercent: 6.8, yPercent: 5.25, widthPercent: 61.7, heightPercent: 2.1 },
      displaySettings: { useWhiteBackground: true, fontSizePt: 10, textAlign: "left" },
    },
    {
      inputId: "date_of_birth",
      typeId: "date",
      label: "DOB",
      bounds: { xPercent: 73.7, yPercent: 5.25, widthPercent: 22.5, heightPercent: 2.1 },
      displaySettings: { useWhiteBackground: true, dateFormat: "MM/DD/YY", fontSizePt: 10, textAlign: "left" },
    },
    {
      inputId: "gender_other",
      typeId: "textLine",
      label: "Gender other",
      bounds: { xPercent: 19.2, yPercent: 8.35, widthPercent: 8.6, heightPercent: 1.7 },
      displaySettings: { useWhiteBackground: true, fontSizePt: 9, textAlign: "left" },
    },
    {
      inputId: "pronouns_other",
      typeId: "textLine",
      label: "Pronouns other",
      bounds: { xPercent: 78.4, yPercent: 8.35, widthPercent: 17.8, heightPercent: 1.7 },
      displaySettings: { useWhiteBackground: true, fontSizePt: 9, textAlign: "left" },
    },
    {
      inputId: "address",
      typeId: "textLine",
      label: "Address",
      bounds: { xPercent: 8.4, yPercent: 11.75, widthPercent: 59.8, heightPercent: 2.1 },
      displaySettings: { useWhiteBackground: true, fontSizePt: 10, textAlign: "left" },
    },
    {
      inputId: "city",
      typeId: "textLine",
      label: "City",
      bounds: { xPercent: 71.0, yPercent: 11.75, widthPercent: 25.0, heightPercent: 2.1 },
      displaySettings: { useWhiteBackground: true, fontSizePt: 10, textAlign: "left" },
    },
    {
      inputId: "state",
      typeId: "textLine",
      label: "State",
      bounds: { xPercent: 7.4, yPercent: 14.15, widthPercent: 5.8, heightPercent: 2.1 },
      displaySettings: { useWhiteBackground: true, fontSizePt: 10, textAlign: "left" },
    },
    {
      inputId: "zip",
      typeId: "number",
      label: "Zip",
      bounds: { xPercent: 17.6, yPercent: 14.15, widthPercent: 11.0, heightPercent: 2.1 },
      displaySettings: { useWhiteBackground: true, fontSizePt: 10, textAlign: "left" },
    },
    {
      inputId: "phone",
      typeId: "phoneNumber",
      label: "Phone",
      bounds: { xPercent: 34.2, yPercent: 14.15, widthPercent: 61.8, heightPercent: 2.1 },
      displaySettings: { useWhiteBackground: true, fontSizePt: 10, textAlign: "left" },
    },
    {
      inputId: "email",
      typeId: "email",
      label: "Email",
      bounds: { xPercent: 8.0, yPercent: 16.55, widthPercent: 20.5, heightPercent: 2.1 },
      displaySettings: { useWhiteBackground: true, fontSizePt: 10, textAlign: "left" },
    },
    {
      inputId: "emergency_contact_name",
      typeId: "textLine",
      label: "Emergency contact name",
      bounds: { xPercent: 21.0, yPercent: 21.35, widthPercent: 47.2, heightPercent: 2.1 },
      displaySettings: { useWhiteBackground: true, fontSizePt: 10, textAlign: "left" },
    },
    {
      inputId: "emergency_contact_phone",
      typeId: "phoneNumber",
      label: "Emergency phone",
      bounds: { xPercent: 74.1, yPercent: 21.35, widthPercent: 21.9, heightPercent: 2.1 },
      displaySettings: { useWhiteBackground: true, fontSizePt: 10, textAlign: "left" },
    },
    {
      inputId: "relationship_to_patient",
      typeId: "textLine",
      label: "Relationship to patient",
      bounds: { xPercent: 21.1, yPercent: 23.75, widthPercent: 74.9, heightPercent: 2.1 },
      displaySettings: { useWhiteBackground: true, fontSizePt: 10, textAlign: "left" },
    },
    {
      inputId: "insurance_provider",
      typeId: "textLine",
      label: "Provider",
      bounds: { xPercent: 10.7, yPercent: 28.55, widthPercent: 17.9, heightPercent: 2.1 },
      displaySettings: { useWhiteBackground: true, fontSizePt: 10, textAlign: "left" },
    },
    {
      inputId: "policy_number",
      typeId: "textLine",
      label: "Policy number",
      bounds: { xPercent: 42.4, yPercent: 28.55, widthPercent: 53.6, heightPercent: 2.1 },
      displaySettings: { useWhiteBackground: true, fontSizePt: 10, textAlign: "left" },
    },
    {
      inputId: "group_number",
      typeId: "textLine",
      label: "Group number",
      bounds: { xPercent: 14.4, yPercent: 30.95, widthPercent: 14.2, heightPercent: 2.1 },
      displaySettings: { useWhiteBackground: true, fontSizePt: 10, textAlign: "left" },
    },
    {
      inputId: "policyholder_name",
      typeId: "textLine",
      label: "Policyholder name",
      bounds: { xPercent: 44.0, yPercent: 30.95, widthPercent: 52.0, heightPercent: 2.1 },
      displaySettings: { useWhiteBackground: true, fontSizePt: 10, textAlign: "left" },
    },
    {
      inputId: "insurance_relationship_other",
      typeId: "textLine",
      label: "Insurance relationship other",
      bounds: { xPercent: 46.8, yPercent: 33.35, widthPercent: 13.0, heightPercent: 2.0 },
      displaySettings: { useWhiteBackground: true, fontSizePt: 9, textAlign: "left" },
    },
    {
      inputId: "primary_reason_for_visit",
      typeId: "textArea",
      label: "Primary reason for visit",
      bounds: { xPercent: 18.7, yPercent: 38.1, widthPercent: 77.3, heightPercent: 3.6 },
      displaySettings: { useWhiteBackground: true, fontSizePt: 10, textAlign: "left" },
    },
    {
      inputId: "issue_duration",
      typeId: "textLine",
      label: "Issue duration",
      bounds: { xPercent: 25.8, yPercent: 42.35, widthPercent: 2.8, heightPercent: 3.8 },
      displaySettings: { useWhiteBackground: true, fontSizePt: 9, textAlign: "left" },
    },
    {
      inputId: "conditions_other",
      typeId: "textLine",
      label: "Conditions other",
      bounds: { xPercent: 21.8, yPercent: 51.0, widthPercent: 11.2, heightPercent: 1.8 },
      displaySettings: { useWhiteBackground: true, fontSizePt: 9, textAlign: "left" },
    },
    {
      inputId: "medications",
      typeId: "textArea",
      label: "Medications",
      bounds: { xPercent: 43.5, yPercent: 54.4, widthPercent: 52.5, heightPercent: 5.0 },
      displaySettings: { useWhiteBackground: true, fontSizePt: 10, textAlign: "left" },
    },
    {
      inputId: "allergies",
      typeId: "textArea",
      label: "Allergies",
      bounds: { xPercent: 41.8, yPercent: 60.15, widthPercent: 54.2, heightPercent: 5.0 },
      displaySettings: { useWhiteBackground: true, fontSizePt: 10, textAlign: "left" },
    },
    {
      inputId: "procedures",
      typeId: "textArea",
      label: "Procedures and dates",
      bounds: { xPercent: 52.8, yPercent: 65.9, widthPercent: 43.2, heightPercent: 5.0 },
      displaySettings: { useWhiteBackground: true, fontSizePt: 10, textAlign: "left" },
    },
    {
      inputId: "occupation",
      typeId: "textLine",
      label: "Occupation",
      bounds: { xPercent: 10.6, yPercent: 78.75, widthPercent: 85.4, heightPercent: 2.1 },
      displaySettings: { useWhiteBackground: true, fontSizePt: 10, textAlign: "left" },
    },
    {
      inputId: "barriers_description",
      typeId: "textLine",
      label: "Barriers description",
      bounds: { xPercent: 18.9, yPercent: 83.55, widthPercent: 36.6, heightPercent: 2.1 },
      displaySettings: { useWhiteBackground: true, fontSizePt: 10, textAlign: "left" },
    },
    {
      inputId: "preferred_pharmacy_name",
      typeId: "textLine",
      label: "Preferred pharmacy name",
      bounds: { xPercent: 22.8, yPercent: 88.35, widthPercent: 5.8, heightPercent: 2.1 },
      displaySettings: { useWhiteBackground: true, fontSizePt: 10, textAlign: "left" },
    },
    {
      inputId: "pharmacy_phone",
      typeId: "phoneNumber",
      label: "Pharmacy phone",
      bounds: { xPercent: 42.9, yPercent: 88.35, widthPercent: 53.1, heightPercent: 2.1 },
      displaySettings: { useWhiteBackground: true, fontSizePt: 10, textAlign: "left" },
    },
    {
      inputId: "pharmacy_address",
      typeId: "textLine",
      label: "Pharmacy address",
      bounds: { xPercent: 8.4, yPercent: 90.75, widthPercent: 87.6, heightPercent: 2.1 },
      displaySettings: { useWhiteBackground: true, fontSizePt: 10, textAlign: "left" },
    },
    {
      inputId: "signature",
      typeId: "signature",
      label: "Signature",
      bounds: { xPercent: 10.5, yPercent: 97.35, widthPercent: 57.8, heightPercent: 2.0 },
      displaySettings: { useWhiteBackground: true, fontSizePt: 10, textAlign: "left" },
    },
    {
      inputId: "signature_date",
      typeId: "date",
      label: "Date",
      bounds: { xPercent: 72.6, yPercent: 97.35, widthPercent: 23.4, heightPercent: 2.0 },
      displaySettings: { useWhiteBackground: true, dateFormat: "MM/DD/YY", fontSizePt: 10, textAlign: "left" },
    },
  ],
  layoutSettings: { paperSize: "letter", widthIn: 8.5, heightIn: 11 },
  displaySettings: { backgroundColor: "#ffffff" },
  sourceAssetPath: "/ai_context/inbox_template/69ab60b5f00f91cc354a1571_67c77655b40960dbb5563104_Patient_Intake_Form.webp",
  updatedAt: "2026-04-30T00:00:00.000Z",
};
