import type { TemplateCheckOption, TemplateChoiceValue, TemplateInputDefinition, TemplateInputValue } from "./types";

function comparable(value: string | boolean | number) {
  return String(value).trim().toLowerCase();
}

export function isChoiceValue(value: TemplateInputValue["value"] | undefined): value is TemplateChoiceValue {
  return Boolean(value && typeof value === "object" && !Array.isArray(value) && "selected" in value);
}

export function getSelectedValues(value: TemplateInputValue["value"] | undefined) {
  if (value === null || value === undefined) return [];
  if (Array.isArray(value)) return value.map(comparable);
  if (typeof value === "boolean") return value ? ["true"] : [];
  if (isChoiceValue(value)) {
    return Array.isArray(value.selected) ? value.selected.map(comparable) : [comparable(value.selected)];
  }
  return [comparable(value)];
}

export function getChoiceOtherText(value: TemplateInputValue["value"] | undefined) {
  if (!isChoiceValue(value)) return "";
  return value.otherText?.toString() ?? "";
}

function optionMatchesValue(option: TemplateCheckOption, value: TemplateInputValue["value"] | undefined) {
  const selectedValues = getSelectedValues(value);
  if (selectedValues.length === 0) return false;
  const matches = new Set(selectedValues);
  return (
    matches.has(comparable(option.value)) ||
    matches.has(comparable(option.label)) ||
    matches.has(comparable(option.optionId))
  );
}

export function selectedCheckOptions(
  definition: TemplateInputDefinition,
  value: TemplateInputValue["value"] | undefined,
) {
  if (definition.typeId !== "checkbox" && definition.typeId !== "radio") return [];
  return (definition.checkOptions ?? []).filter((option) => optionMatchesValue(option, value));
}

export function shouldDrawSimpleCheck(definition: TemplateInputDefinition, value: TemplateInputValue["value"] | undefined) {
  if (definition.typeId !== "checkbox" && definition.typeId !== "radio") return false;
  if (definition.checkOptions?.length) return false;
  const selectedValues = getSelectedValues(value);
  return selectedValues.length > 0;
}
