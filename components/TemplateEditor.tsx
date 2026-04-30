"use client";

import { Fragment, useMemo, useRef, useState } from "react";
import type { PointerEvent } from "react";
import { defaultPlaceholderForInput } from "@/lib/printable-templates/placeholders";
import type {
  PrintableTemplate,
  TemplateCheckOption,
  TemplateInputBounds,
  TemplateInputDefinition,
  TemplateInputTypeId,
} from "@/lib/printable-templates/types";

const inputTypes: TemplateInputTypeId[] = [
  "textLine",
  "textArea",
  "date",
  "phoneNumber",
  "firstName",
  "lastName",
  "email",
  "number",
  "checkbox",
  "radio",
  "signature",
  "initials",
];

function clamp(value: number, min = 0, max = 100) {
  return Math.min(max, Math.max(min, value));
}

function normalizeBounds(bounds: TemplateInputBounds): TemplateInputBounds {
  const widthPercent = clamp(bounds.widthPercent, 1, 100);
  const heightPercent = clamp(bounds.heightPercent, 1, 100);

  return {
    xPercent: clamp(bounds.xPercent, 0, 100 - widthPercent),
    yPercent: clamp(bounds.yPercent, 0, 100 - heightPercent),
    widthPercent,
    heightPercent,
  };
}

function isChoiceInput(typeId: TemplateInputTypeId) {
  return typeId === "checkbox" || typeId === "radio";
}

function optionValueFromLabel(label: string) {
  return label.trim().toLowerCase().replace(/\s+/g, "_") || "option";
}

function createCheckOption(index: number, bounds?: TemplateInputBounds): TemplateCheckOption {
  const label = `Option ${index}`;
  return {
    optionId: `option_${Date.now()}_${index}`,
    label,
    value: optionValueFromLabel(label),
    bounds: normalizeBounds(bounds ?? { xPercent: 10, yPercent: 10, widthPercent: 2, heightPercent: 1.6 }),
  };
}

function normalizeTemplateInputs(template: PrintableTemplate): PrintableTemplate {
  return {
    ...template,
    inputDefinitions: template.inputDefinitions.map((input) => ({
      ...input,
      placeholderText: input.placeholderText?.trim() || defaultPlaceholderForInput(input.typeId, input.label),
      checkOptions: isChoiceInput(input.typeId) ? input.checkOptions ?? [] : undefined,
    })),
  };
}

type OverlayDragState = {
  mode: "move" | "resize";
  inputId: string;
  optionId?: string;
  pointerId: number;
  startClientX: number;
  startClientY: number;
  pageWidth: number;
  pageHeight: number;
  startBounds: TemplateInputBounds;
};

export function TemplateEditor({ initialTemplate }: { initialTemplate: PrintableTemplate }) {
  const [template, setTemplate] = useState(() => normalizeTemplateInputs(initialTemplate));
  const [selectedInputId, setSelectedInputId] = useState(initialTemplate.inputDefinitions[0]?.inputId ?? "");
  const [status, setStatus] = useState("Loaded seeded PrintableTemplate data.");
  const dragStateRef = useRef<OverlayDragState | null>(null);

  const selectedInput = useMemo(
    () => template.inputDefinitions.find((input) => input.inputId === selectedInputId) ?? template.inputDefinitions[0],
    [selectedInputId, template.inputDefinitions],
  );

  function updateInput(inputId: string, updater: (input: TemplateInputDefinition) => TemplateInputDefinition) {
    setTemplate((current) => ({
      ...current,
      inputDefinitions: current.inputDefinitions.map((input) => (input.inputId === inputId ? updater(input) : input)),
    }));
  }

  function addInput() {
    const nextNumber = template.inputDefinitions.length + 1;
    const input: TemplateInputDefinition = {
      inputId: `input_${Date.now()}`,
      typeId: "textLine",
      label: `Input ${nextNumber}`,
      placeholderText: defaultPlaceholderForInput("textLine", `Input ${nextNumber}`),
      bounds: { xPercent: 10, yPercent: 10 + nextNumber * 4, widthPercent: 30, heightPercent: 3 },
      displaySettings: { useWhiteBackground: true, fontSizePt: 11, textAlign: "left" },
    };
    setTemplate((current) => ({ ...current, inputDefinitions: [...current.inputDefinitions, input] }));
    setSelectedInputId(input.inputId);
  }

  function addCheckOption(inputId: string) {
    updateInput(inputId, (input) => ({
      ...input,
      checkOptions: [...(input.checkOptions ?? []), createCheckOption((input.checkOptions?.length ?? 0) + 1, input.bounds)],
    }));
  }

  function updateCheckOption(
    inputId: string,
    optionId: string,
    updater: (option: TemplateCheckOption) => TemplateCheckOption,
  ) {
    updateInput(inputId, (input) => ({
      ...input,
      checkOptions: (input.checkOptions ?? []).map((option) => (option.optionId === optionId ? updater(option) : option)),
    }));
  }

  function removeCheckOption(inputId: string, optionId: string) {
    updateInput(inputId, (input) => ({
      ...input,
      checkOptions: (input.checkOptions ?? []).filter((option) => option.optionId !== optionId),
    }));
  }

  function removeSelectedInput() {
    if (!selectedInput) return;
    const remaining = template.inputDefinitions.filter((input) => input.inputId !== selectedInput.inputId);
    setTemplate((current) => ({ ...current, inputDefinitions: remaining }));
    setSelectedInputId(remaining[0]?.inputId ?? "");
  }

  async function saveTemplate() {
    setStatus("Saving template...");
    const response = await fetch("/api/templates", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(template),
    });
    setStatus(response.ok ? "Saved to seeded PrintableTemplate store." : "Save failed.");
  }

  async function openRendered(kind: "pdf" | "png") {
    const response = await fetch(`/api/templates/render/${kind}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        pageId: template.pageId,
        inputValues: template.inputDefinitions.map((input) => ({
          inputId: input.inputId,
          value: input.checkOptions?.length
            ? input.typeId === "checkbox"
              ? input.checkOptions.map((option) => option.value)
              : input.checkOptions[0]?.value
            : input.typeId === "checkbox"
              ? true
              : input.placeholderText ?? defaultPlaceholderForInput(input.typeId, input.label),
        })),
      }),
    });
    const blob = await response.blob();
    window.open(URL.createObjectURL(blob), "_blank", "noopener,noreferrer");
  }

  function startOverlayInteraction(
    event: PointerEvent<HTMLElement>,
    input: TemplateInputDefinition,
    mode: OverlayDragState["mode"],
    optionId?: string,
    startBounds = input.bounds,
  ) {
    const page = event.currentTarget.closest<HTMLElement>(".template-page");
    if (!page) return;

    const pageRect = page.getBoundingClientRect();
    dragStateRef.current = {
      mode,
      inputId: input.inputId,
      optionId,
      pointerId: event.pointerId,
      startClientX: event.clientX,
      startClientY: event.clientY,
      pageWidth: pageRect.width,
      pageHeight: pageRect.height,
      startBounds,
    };
    event.currentTarget.setPointerCapture(event.pointerId);
    setSelectedInputId(input.inputId);
    event.preventDefault();
  }

  function startOverlayDrag(event: PointerEvent<HTMLButtonElement>, input: TemplateInputDefinition) {
    startOverlayInteraction(event, input, "move");
  }

  function startOverlayResize(event: PointerEvent<HTMLSpanElement>, input: TemplateInputDefinition) {
    event.stopPropagation();
    startOverlayInteraction(event, input, "resize");
  }

  function startCheckOptionDrag(
    event: PointerEvent<HTMLButtonElement>,
    input: TemplateInputDefinition,
    option: TemplateCheckOption,
  ) {
    event.stopPropagation();
    startOverlayInteraction(event, input, "move", option.optionId, option.bounds);
  }

  function updateOverlayInteraction(event: PointerEvent<HTMLElement>) {
    const dragState = dragStateRef.current;
    if (!dragState || dragState.pointerId !== event.pointerId) return;

    const deltaXPercent = ((event.clientX - dragState.startClientX) / dragState.pageWidth) * 100;
    const deltaYPercent = ((event.clientY - dragState.startClientY) / dragState.pageHeight) * 100;

    const nextBounds =
      dragState.mode === "resize"
        ? normalizeBounds({
            ...dragState.startBounds,
            widthPercent: dragState.startBounds.widthPercent + deltaXPercent,
            heightPercent: dragState.startBounds.heightPercent + deltaYPercent,
          })
        : normalizeBounds({
            ...dragState.startBounds,
            xPercent: dragState.startBounds.xPercent + deltaXPercent,
            yPercent: dragState.startBounds.yPercent + deltaYPercent,
          });

    updateInput(dragState.inputId, (input) =>
      dragState.optionId
        ? {
            ...input,
            checkOptions: (input.checkOptions ?? []).map((option) =>
              option.optionId === dragState.optionId ? { ...option, bounds: nextBounds } : option,
            ),
          }
        : {
            ...input,
            bounds: nextBounds,
          },
    );
    event.preventDefault();
  }

  function finishOverlayInteraction(event: PointerEvent<HTMLElement>) {
    const dragState = dragStateRef.current;
    if (!dragState || dragState.pointerId !== event.pointerId) return;

    dragStateRef.current = null;
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
  }

  return (
    <div className="template-editor-shell">
      <aside className="template-editor-panel">
        <div>
          <p className="panel-kicker">PrintableTemplate</p>
          <h1>{template.name}</h1>
          <p className="panel-meta">{template.pageId}</p>
        </div>

        <div className="button-row">
          <button type="button" onClick={addInput}>Add input</button>
          <button type="button" onClick={removeSelectedInput} disabled={!selectedInput}>Remove</button>
        </div>

        <div className="input-list">
          {template.inputDefinitions.map((input) => (
            <button
              type="button"
              key={input.inputId}
              className={input.inputId === selectedInput?.inputId ? "selected" : ""}
              onClick={() => setSelectedInputId(input.inputId)}
            >
              <span>{input.label}</span>
              <small>{input.typeId}</small>
            </button>
          ))}
        </div>

        {selectedInput ? (
          <form className="settings-form">
            <label>
              Input ID
              <input value={selectedInput.inputId} readOnly />
            </label>
            <label>
              Label
              <input
                value={selectedInput.label}
                onChange={(event) =>
                  updateInput(selectedInput.inputId, (input) => {
                    const label = event.target.value;
                    const previousDefault = defaultPlaceholderForInput(input.typeId, input.label);
                    return {
                      ...input,
                      label,
                      placeholderText:
                        !input.placeholderText || input.placeholderText === previousDefault
                          ? defaultPlaceholderForInput(input.typeId, label)
                          : input.placeholderText,
                    };
                  })
                }
              />
            </label>
            <label className="full-span">
              Placeholder text
              <input
                value={selectedInput.placeholderText ?? defaultPlaceholderForInput(selectedInput.typeId, selectedInput.label)}
                onChange={(event) =>
                  updateInput(selectedInput.inputId, (input) => ({ ...input, placeholderText: event.target.value }))
                }
              />
            </label>
            <label className="full-span">
              Type
              <select
                value={selectedInput.typeId}
                onChange={(event) =>
                  updateInput(selectedInput.inputId, (input) => {
                    const typeId = event.target.value as TemplateInputTypeId;
                    return {
                      ...input,
                      typeId,
                      placeholderText: defaultPlaceholderForInput(typeId, input.label),
                      checkOptions: isChoiceInput(typeId)
                        ? input.checkOptions?.length
                          ? input.checkOptions
                          : [createCheckOption(1, input.bounds)]
                        : undefined,
                    };
                  })
                }
              >
                {inputTypes.map((type) => <option key={type}>{type}</option>)}
              </select>
            </label>
            {(["xPercent", "yPercent", "widthPercent", "heightPercent"] as const).map((key) => (
              <label key={key}>
                {key}
                <input
                  type="number"
                  min="0"
                  max="100"
                  step="0.25"
                  value={selectedInput.bounds[key]}
                  onChange={(event) =>
                    updateInput(selectedInput.inputId, (input) => ({
                      ...input,
                      bounds: normalizeBounds({ ...input.bounds, [key]: Number(event.target.value) }),
                    }))
                  }
                />
              </label>
            ))}
            <label>
              Date format
              <select
                value={selectedInput.displaySettings.dateFormat ?? "MM/DD/YY"}
                onChange={(event) =>
                  updateInput(selectedInput.inputId, (input) => ({
                    ...input,
                    displaySettings: { ...input.displaySettings, dateFormat: event.target.value as never },
                  }))
                }
              >
                <option>MM/DD/YY</option>
                <option>MMDDYY</option>
                <option>YYMMDD</option>
                <option>YYYY-MM-DD</option>
              </select>
            </label>
            <label>
              Font size
              <input
                type="number"
                min="6"
                max="24"
                value={selectedInput.displaySettings.fontSizePt ?? 11}
                onChange={(event) =>
                  updateInput(selectedInput.inputId, (input) => ({
                    ...input,
                    displaySettings: { ...input.displaySettings, fontSizePt: Number(event.target.value) },
                  }))
                }
              />
            </label>
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={selectedInput.displaySettings.useWhiteBackground}
                onChange={(event) =>
                  updateInput(selectedInput.inputId, (input) => ({
                    ...input,
                    displaySettings: { ...input.displaySettings, useWhiteBackground: event.target.checked },
                  }))
                }
              />
              White background
            </label>
            {isChoiceInput(selectedInput.typeId) ? (
              <div className="check-options-editor">
                <div className="check-options-header">
                  <span>Check locations</span>
                  <button type="button" onClick={() => addCheckOption(selectedInput.inputId)}>Add option</button>
                </div>
                {(selectedInput.checkOptions ?? []).map((option, index) => (
                  <div className="check-option-card" key={option.optionId}>
                    <label>
                      Label
                      <input
                        value={option.label}
                        onChange={(event) =>
                          updateCheckOption(selectedInput.inputId, option.optionId, (current) => {
                            const label = event.target.value;
                            const previousDefaultValue = optionValueFromLabel(current.label);
                            return {
                              ...current,
                              label,
                              value: current.value === previousDefaultValue ? optionValueFromLabel(label) : current.value,
                            };
                          })
                        }
                      />
                    </label>
                    <label>
                      Match value
                      <input
                        value={option.value}
                        onChange={(event) =>
                          updateCheckOption(selectedInput.inputId, option.optionId, (current) => ({
                            ...current,
                            value: event.target.value,
                          }))
                        }
                      />
                    </label>
                    {(["xPercent", "yPercent", "widthPercent", "heightPercent"] as const).map((key) => (
                      <label key={key}>
                        {key}
                        <input
                          type="number"
                          min="0"
                          max="100"
                          step="0.25"
                          value={option.bounds[key]}
                          onChange={(event) =>
                            updateCheckOption(selectedInput.inputId, option.optionId, (current) => ({
                              ...current,
                              bounds: normalizeBounds({ ...current.bounds, [key]: Number(event.target.value) }),
                            }))
                          }
                        />
                      </label>
                    ))}
                    <button type="button" onClick={() => removeCheckOption(selectedInput.inputId, option.optionId)}>
                      Remove {option.label || `option ${index + 1}`}
                    </button>
                  </div>
                ))}
              </div>
            ) : null}
          </form>
        ) : null}

        <div className="button-row">
          <button type="button" onClick={saveTemplate}>Save</button>
          <button type="button" onClick={() => openRendered("pdf")}>PDF</button>
          <button type="button" onClick={() => openRendered("png")}>PNG</button>
        </div>
        <p className="status-line">{status}</p>
      </aside>

      <main className="template-stage-wrap">
        <div
          className="template-page"
          style={{ aspectRatio: `${template.layoutSettings.widthIn} / ${template.layoutSettings.heightIn}` }}
        >
          <style>{template.css}</style>
          <div dangerouslySetInnerHTML={{ __html: template.html }} />
          <div className="overlay-plane">
            {template.inputDefinitions.map((input) => (
              <Fragment key={input.inputId}>
                <button
                  type="button"
                  className={`template-overlay ${input.inputId === selectedInput?.inputId ? "selected" : ""}`}
                  style={{
                    left: `${input.bounds.xPercent}%`,
                    top: `${input.bounds.yPercent}%`,
                    width: `${input.bounds.widthPercent}%`,
                    height: `${input.bounds.heightPercent}%`,
                    background: input.displaySettings.useWhiteBackground ? "rgba(255,255,255,.92)" : "rgba(14,165,233,.08)",
                    fontSize: `${input.displaySettings.fontSizePt ?? 11}pt`,
                    textAlign: input.displaySettings.textAlign ?? "left",
                  }}
                  onPointerDown={(event) => startOverlayDrag(event, input)}
                  onPointerMove={updateOverlayInteraction}
                  onPointerUp={finishOverlayInteraction}
                  onPointerCancel={finishOverlayInteraction}
                  onClick={() => setSelectedInputId(input.inputId)}
                >
                  <span className="overlay-label">{input.placeholderText ?? defaultPlaceholderForInput(input.typeId, input.label)}</span>
                  <span
                    className="overlay-resize-handle"
                    aria-hidden="true"
                    onPointerDown={(event) => startOverlayResize(event, input)}
                    onPointerMove={updateOverlayInteraction}
                    onPointerUp={finishOverlayInteraction}
                    onPointerCancel={finishOverlayInteraction}
                  />
                </button>
                {(input.checkOptions ?? []).map((option) => (
                  <button
                    type="button"
                    key={option.optionId}
                    className={`check-option-overlay ${input.inputId === selectedInput?.inputId ? "selected" : ""}`}
                    style={{
                      left: `${option.bounds.xPercent}%`,
                      top: `${option.bounds.yPercent}%`,
                      width: `${option.bounds.widthPercent}%`,
                      height: `${option.bounds.heightPercent}%`,
                    }}
                    onPointerDown={(event) => startCheckOptionDrag(event, input, option)}
                    onPointerMove={updateOverlayInteraction}
                    onPointerUp={finishOverlayInteraction}
                    onPointerCancel={finishOverlayInteraction}
                    onClick={() => setSelectedInputId(input.inputId)}
                    title={`${input.label}: ${option.label} = ${option.value}`}
                  >
                    <span aria-hidden="true" />
                  </button>
                ))}
              </Fragment>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
