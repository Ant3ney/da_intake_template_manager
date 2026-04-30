import type { PrintableTemplate } from "./types";

export const patientIntakeTemplate: PrintableTemplate = {
  pageId: "patient-intake-form",
  name: "Patient Intake Form",
  html: `
    <section class="patient-intake-sheet">
      <table class="patient-intake-table">
        <colgroup>
          <col class="col-a" />
          <col class="col-b" />
          <col class="col-c" />
          <col class="col-d" />
        </colgroup>
        <tbody>
          <tr class="section-row"><td colspan="4">Patient Information</td></tr>
          <tr><td colspan="3">Name</td><td>DOB <em>(MM/DD/YYYY)</em>:</td></tr>
          <tr class="tall-sm">
            <td colspan="2">Gender: □ Male □ Female □ Other: ____________</td>
            <td colspan="2">Preferred Pronouns: □ He/Him □ She/Her □ They/Them □ Other: ____________</td>
          </tr>
          <tr><td colspan="3">Address:</td><td>City</td></tr>
          <tr><td>State:</td><td>Zip:</td><td colspan="2">Phone:</td></tr>
          <tr><td colspan="2">Email:</td><td colspan="2">Preferred Contact Method: □ Phone □ Email □Text</td></tr>
          <tr><td colspan="3">Emergency Contact Name:</td><td>Phone:</td></tr>
          <tr><td colspan="4">Relationship to Patient</td></tr>
          <tr class="section-row"><td colspan="4">Insurance Information <em>(if applicable)</em></td></tr>
          <tr><td colspan="2">Provider:</td><td colspan="2">Policy number:</td></tr>
          <tr><td colspan="2">Group Number:</td><td colspan="2">Policyholder Name</td></tr>
          <tr><td colspan="4">Relationship to Patient: □ Self □ Spouse □ Parent □ Other: ____________</td></tr>
          <tr class="section-row"><td colspan="4">Reason for Visit</td></tr>
          <tr class="tall-md"><td colspan="4">Primary Reason for Visit:</td></tr>
          <tr class="tall-sm">
            <td colspan="2">How long have you had this issue?</td>
            <td colspan="2">Have you been treated for this before? □ Yes □ No</td>
          </tr>
          <tr class="section-row"><td colspan="4">Medical History Summary</td></tr>
          <tr class="tall-md"><td colspan="4">Do you have any of the following conditions? (Check all that apply) □ Diabetes □ Hypertension □ Heart Disease □ Asthma □<br />Cancer □ Stroke □ Other: ____________</td></tr>
          <tr class="tall-lg">
            <td colspan="2">Are you currently taking any<br />medications? □ Yes □ No</td>
            <td colspan="2">If yes, list medications:</td>
          </tr>
          <tr class="tall-lg">
            <td colspan="2">Do you have any allergies? □ Yes □<br />No</td>
            <td colspan="2">If yes, list allergies:</td>
          </tr>
          <tr class="tall-lg">
            <td colspan="2">Have you had any surgeries or<br />hospitalizations? □ Yes □ No</td>
            <td colspan="2">If yes, list procedures and dates:</td>
          </tr>
          <tr class="section-row"><td colspan="4">Lifestyle &amp; Social History</td></tr>
          <tr><td colspan="4">Do you smoke or use tobacco products? □ Yes □ No □ Former Smoker</td></tr>
          <tr><td colspan="4">Do you consume alcohol? □ Yes □ No □ Occasionally</td></tr>
          <tr><td colspan="4">Do you use recreational drugs? □ Yes □ No</td></tr>
          <tr><td colspan="4">Occupation:</td></tr>
          <tr><td colspan="4">Do you have any concerns about access to healthcare, transportation, or financial barriers? □ Yes □ No</td></tr>
          <tr><td colspan="4">If yes, please describe: _______________________________________</td></tr>
          <tr class="section-row"><td colspan="4">Pharmacy Information</td></tr>
          <tr><td colspan="2">Preferred Pharmacy Name:</td><td colspan="2">Phone Number:</td></tr>
          <tr><td colspan="4">Address:</td></tr>
          <tr class="section-row"><td colspan="4">Consent &amp; Signature</td></tr>
          <tr><td colspan="4">I confirm that the information provided is accurate to the best of my knowledge.</td></tr>
          <tr class="signature-row"><td colspan="3">Signature:</td><td>Date:</td></tr>
        </tbody>
      </table>
    </section>
  `,
  css: `
    .patient-intake-sheet {
      box-sizing: border-box;
      width: 100%;
      height: 100%;
      background: #fff;
      color: #000;
      font-family: Arial, Helvetica, sans-serif;
      padding: 2.75% 1.75%;
    }
    .patient-intake-table {
      width: 100%;
      height: 100%;
      border-collapse: collapse;
      table-layout: fixed;
      border: 1px solid #000;
      font-size: 13.7px;
      line-height: 1.24;
      font-weight: 400;
    }
    .patient-intake-table .col-a { width: 12.5%; }
    .patient-intake-table .col-b { width: 16.5%; }
    .patient-intake-table .col-c { width: 42%; }
    .patient-intake-table .col-d { width: 29%; }
    .patient-intake-table td {
      border: 1px solid #000;
      padding: 2px 4px;
      vertical-align: top;
      overflow: hidden;
    }
    .patient-intake-table em { font-style: italic; }
    .patient-intake-table .section-row td {
      background: #eeeeee;
      height: 2.45%;
    }
    .patient-intake-table tr:not(.section-row) td { height: 2.45%; }
    .patient-intake-table .tall-sm td { height: 4.7%; }
    .patient-intake-table .tall-md td { height: 4.2%; }
    .patient-intake-table .tall-lg td { height: 5.7%; }
    .patient-intake-table .signature-row td { height: 3.55%; vertical-align: bottom; }
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
