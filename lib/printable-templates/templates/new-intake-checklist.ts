import type { PrintableTemplate, TemplateCheckOption } from "../types";

const checklistOption = (
  optionId: string,
  label: string,
  value: string,
  yPercent: number,
): TemplateCheckOption => ({
  optionId,
  label,
  value,
  bounds: { xPercent: 13.65, yPercent, widthPercent: 1.75, heightPercent: 1.25 },
});

export const newIntakeChecklistTemplate: PrintableTemplate = {
  pageId: "new-intake-checklist",
  name: "New Intake Checklist",
  backgroundImage: {
    src: "/template-assets/new-intake-checklist.png",
    widthPx: 1086,
    heightPx: 1448,
    mimeType: "image/png",
  },
  inputDefinitions: [
    {
      inputId: "completed_items",
      typeId: "checkbox",
      label: "Completed checklist items",
      bounds: { xPercent: 13.4, yPercent: 15.2, widthPercent: 79.0, heightPercent: 79.0 },
      checkOptions: [
        checklistOption("email_dr_graves", "Email Dr. Graves", "email_dr_graves", 15.55),
        checklistOption("add_to_sign_in_sheet", "Add to Sign-In Sheet", "add_to_sign_in_sheet", 19.2),
        checklistOption("add_90_day_appt_in_calendar_book", "Add 90-Day Appt in Calendar Book", "add_90_day_appt_in_calendar_book", 22.9),
        checklistOption("add_to_master_client_list_men_only", "Add to Master Client List (Men Only)", "add_to_master_client_list_men_only", 26.6),
        checklistOption("add_to_monthly_client_list", "Add to Monthly Client List", "add_to_monthly_client_list", 30.3),
        checklistOption("add_to_data_sheet_men_only", "Add to Data Sheet (Men Only)", "add_to_data_sheet_men_only", 33.95),
        checklistOption(
          "add_to_protective_factor_system",
          "Add to Protective Factor System (Update PFS Front Sheet showing add)",
          "add_to_protective_factor_system",
          37.6,
        ),
        checklistOption("update_folder_label", "Update Folder Label", "update_folder_label", 43.35),
        checklistOption(
          "type_progress_note_appt_for_intake",
          "Type Progress Note - Appt for Intake",
          "type_progress_note_appt_for_intake",
          46.9,
        ),
        checklistOption("type_progress_note_intake", "Type Progress Note - Intake", "type_progress_note_intake", 50.55),
        checklistOption(
          "add_progress_notes_to_case_management_time_activity_log",
          "Add Progress Notes to Case Management Time Activity Log (Men Only)",
          "add_progress_notes_to_case_management_time_activity_log",
          54.15,
        ),
        checklistOption(
          "make_copy_of_progress_notes",
          "Make a copy of Progress Notes for Progress Notes file",
          "make_copy_of_progress_notes",
          60.15,
        ),
        checklistOption(
          "original_progress_note_to_folder",
          "Original Progress Note to folder",
          "original_progress_note_to_folder",
          63.75,
        ),
        checklistOption(
          "create_client_folder_in_computer",
          "Create client folder in the computer (Intakes)",
          "create_client_folder_in_computer",
          67.35,
        ),
        checklistOption(
          "scan_all_intake_documents_into_pc",
          "Scan all Intake Documents into PC",
          "scan_all_intake_documents_into_pc",
          70.95,
        ),
        checklistOption(
          "create_new_intake_documents_coversheet",
          "Create New Intake Documents Coversheet for SBCC Report (SPA 8 Men Only)",
          "create_new_intake_documents_coversheet",
          76.65,
        ),
        checklistOption(
          "copy_sbcc_docs_for_report",
          "Copy SBCC docs for Report and put coversheet on top, file in Report file",
          "copy_sbcc_docs_for_report",
          82.7,
        ),
        checklistOption(
          "file_scanned_documents_under_intake_folder",
          "File scanned documents under the Intake folder for the client",
          "file_scanned_documents_under_intake_folder",
          88.7,
        ),
        checklistOption(
          "file_client_folder_in_drawer",
          "File client folder in the appropriate drawer.",
          "file_client_folder_in_drawer",
          92.45,
        ),
      ],
      displaySettings: { useWhiteBackground: false, fontSizePt: 10, textAlign: "left" },
    },
  ],
  layoutSettings: { paperSize: "letter", widthIn: 8.5, heightIn: 11 },
  displaySettings: { backgroundColor: "#ffffff" },
  sourceAssetPath: "/template-assets/new-intake-checklist.png",
  updatedAt: "2026-05-13T13:55:14-07:00",
};
