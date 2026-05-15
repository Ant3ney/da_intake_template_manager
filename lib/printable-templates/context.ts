import { defaultPlaceholderForInput } from "./placeholders";
import { inferQuestionText } from "./question-text";
import type { PrintableTemplate, TemplateInputDefinition, TemplateInputTypeId } from "./types";

function countInputTypes(inputs: TemplateInputDefinition[]) {
  return inputs.reduce(
    (counts, input) => ({
      ...counts,
      [input.typeId]: (counts[input.typeId] ?? 0) + 1,
    }),
    {} as Partial<Record<TemplateInputTypeId, number>>,
  );
}

function placeholderForInput(input: TemplateInputDefinition) {
  return {
    inputId: input.inputId,
    label: input.label,
    placeholderText: input.placeholderText ?? defaultPlaceholderForInput(input.typeId, input.label),
    choicePlaceholders: (input.checkOptions ?? []).map((option) => ({
      optionId: option.optionId,
      label: option.label,
      value: option.value,
      textPlaceholderText: option.textPlaceholderText,
      isOtherOption: option.isOtherOption ?? false,
    })),
  };
}

function fieldContext(input: TemplateInputDefinition, index: number) {
  return {
    index,
    inputId: input.inputId,
    typeId: input.typeId,
    label: input.label,
    questionText: inferQuestionText(input),
    notes: input.notes ?? "",
    required: input.required ?? false,
    placeholderText: input.placeholderText ?? defaultPlaceholderForInput(input.typeId, input.label),
    bounds: input.bounds,
    displaySettings: input.displaySettings,
    checkOptions: (input.checkOptions ?? []).map((option) => ({
      optionId: option.optionId,
      label: option.label,
      value: option.value,
      bounds: option.bounds,
      textBoxBounds: option.textBoxBounds,
      textPlaceholderText: option.textPlaceholderText,
      isOtherOption: option.isOtherOption ?? false,
    })),
  };
}

export function buildPrintableTemplateContext(template: PrintableTemplate) {
  const inputSchemas = template.inputDefinitions.map(fieldContext);

  return {
    pageId: template.pageId,
    uniqueIdentifiers: {
      pageId: template.pageId,
      name: template.name,
      backgroundImageSrc: template.backgroundImage.src,
      sourceAssetPath: template.sourceAssetPath,
    },
    metadata: {
      name: template.name,
      notes: template.notes ?? "",
      updatedAt: template.updatedAt,
      sourceAssetPath: template.sourceAssetPath,
      inputCount: template.inputDefinitions.length,
      inputTypeCounts: countInputTypes(template.inputDefinitions),
      hasChoiceInputs: template.inputDefinitions.some((input) => input.typeId === "checkbox" || input.typeId === "radio"),
      hasSignatureInputs: template.inputDefinitions.some((input) => input.typeId === "signature"),
    },
    backgroundImage: template.backgroundImage,
    layoutSettings: template.layoutSettings,
    displaySettings: template.displaySettings,
    pageNotes: template.notes ?? "",
    inputSchemas,
    inputNotes: inputSchemas.map((input) => ({
      inputId: input.inputId,
      label: input.label,
      questionText: input.questionText,
      notes: input.notes,
    })),
    placeholderData: {
      inputs: template.inputDefinitions.map(placeholderForInput),
    },
    template,
  };
}
