"use client";

import { useMemo, useState } from "react";
import type {
  PrintableTemplate,
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
  "signature",
  "initials",
];

function clamp(value: number, min = 0, max = 100) {
  return Math.min(max, Math.max(min, value));
}

function normalizeBounds(bounds: TemplateInputBounds): TemplateInputBounds {
  return {
    xPercent: clamp(bounds.xPercent),
    yPercent: clamp(bounds.yPercent),
    widthPercent: clamp(bounds.widthPercent, 1, 100),
    heightPercent: clamp(bounds.heightPercent, 1, 100),
  };
}

export function TemplateEditor({ initialTemplate }: { initialTemplate: PrintableTemplate }) {
  const [template, setTemplate] = useState(initialTemplate);
  const [selectedInputId, setSelectedInputId] = useState(initialTemplate.inputDefinitions[0]?.inputId ?? "");
  const [status, setStatus] = useState("Loaded seeded PrintableTemplate data.");

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
      bounds: { xPercent: 10, yPercent: 10 + nextNumber * 4, widthPercent: 30, heightPercent: 3 },
      displaySettings: { useWhiteBackground: true, fontSizePt: 11, textAlign: "left" },
    };
    setTemplate((current) => ({ ...current, inputDefinitions: [...current.inputDefinitions, input] }));
    setSelectedInputId(input.inputId);
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
          value: input.typeId === "checkbox" ? true : input.label,
        })),
      }),
    });
    const blob = await response.blob();
    window.open(URL.createObjectURL(blob), "_blank", "noopener,noreferrer");
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
                  updateInput(selectedInput.inputId, (input) => ({ ...input, label: event.target.value }))
                }
              />
            </label>
            <label>
              Type
              <select
                value={selectedInput.typeId}
                onChange={(event) =>
                  updateInput(selectedInput.inputId, (input) => ({
                    ...input,
                    typeId: event.target.value as TemplateInputTypeId,
                  }))
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
              <button
                type="button"
                key={input.inputId}
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
                onClick={() => setSelectedInputId(input.inputId)}
              >
                {input.label}
              </button>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
