export type TemplateInputTypeId =
  | "textArea"
  | "textLine"
  | "date"
  | "phoneNumber"
  | "firstName"
  | "lastName"
  | "email"
  | "number"
  | "checkbox"
  | "radio"
  | "signature"
  | "initials";

export type TemplateDateFormat = "MMDDYY" | "YYMMDD" | "MM/DD/YY" | "YYYY-MM-DD";

export type TemplateInputBounds = {
  xPercent: number;
  yPercent: number;
  widthPercent: number;
  heightPercent: number;
};

export type TemplateInputDisplaySettings = {
  dateFormat?: TemplateDateFormat;
  useWhiteBackground: boolean;
  fontSizePt?: number;
  textAlign?: "left" | "center" | "right";
};

export type TemplateCheckOption = {
  optionId: string;
  label: string;
  value: string;
  bounds: TemplateInputBounds;
  textBoxBounds?: TemplateInputBounds;
  textPlaceholderText?: string;
  isOtherOption?: boolean;
};

export type TemplateChoiceValue = {
  selected: string | string[];
  otherText?: string;
};

export type TemplateInputDefinition = {
  inputId: string;
  typeId: TemplateInputTypeId;
  label: string;
  questionText?: string;
  notes?: string;
  placeholderText?: string;
  bounds: TemplateInputBounds;
  checkOptions?: TemplateCheckOption[];
  displaySettings: TemplateInputDisplaySettings;
  required?: boolean;
};

export type TemplateInputValue = {
  inputId: string;
  value: string | boolean | number | string[] | TemplateChoiceValue | null;
};

export type TemplatePageRenderRequest = {
  pageId: string;
  inputValues: TemplateInputValue[];
};

export type RenderedTemplateDocument = {
  pageId: string;
  fileName: string;
  mimeType: "application/pdf" | "image/png";
  fileDataBase64: string;
};

export type BlankTemplateDocument = RenderedTemplateDocument;

export type TemplateInputSchema = {
  pageId: string;
  inputs: TemplateInputDefinition[];
};

export type PrintableTemplate = {
  pageId: string;
  name: string;
  notes?: string;
  backgroundImage: {
    src: string;
    widthPx: number;
    heightPx: number;
    mimeType: "image/png" | "image/jpeg" | "image/webp";
  };
  html?: string;
  css?: string;
  javascript?: string;
  inputDefinitions: TemplateInputDefinition[];
  layoutSettings: {
    paperSize: "letter";
    widthIn: number;
    heightIn: number;
  };
  displaySettings: {
    backgroundColor: string;
  };
  sourceAssetPath?: string;
  updatedAt: string;
};
