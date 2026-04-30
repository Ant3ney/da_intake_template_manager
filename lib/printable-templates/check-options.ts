import type { TemplateCheckOption, TemplateInputDefinition, TemplateInputValue } from "./types";

function comparable(value: string | boolean | number) {
  return String(value).trim().toLowerCase();
}

function isTruthyCheckValue(value: TemplateInputValue["value"] | undefined) {
  if (Array.isArray(value)) return value.length > 0;
  return value === true || comparable(value ?? "") === "true" || comparable(value ?? "") === "checked";
}

function optionMatchesValue(option: TemplateCheckOption, value: TemplateInputValue["value"] | undefined) {
  if (value === null || value === undefined) return false;
  if (Array.isArray(value)) {
    const values = new Set(value.map(comparable));
    return values.has(comparable(option.value)) || values.has(comparable(option.label)) || values.has(comparable(option.optionId));
  }
  if (typeof value === "boolean") return value && comparable(option.value) === "true";

  const normalizedValue = comparable(value);
  return (
    normalizedValue === comparable(option.value) ||
    normalizedValue === comparable(option.label) ||
    normalizedValue === comparable(option.optionId)
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
  return isTruthyCheckValue(value) || (definition.typeId === "radio" && value !== null && value !== undefined && value !== "");
}
