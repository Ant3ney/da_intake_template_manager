import { deflateSync } from "zlib";
import { selectedCheckOptions, shouldDrawSimpleCheck } from "./check-options";
import { formatInputValue, valuesByInputId } from "./format";
import type {
  BlankTemplateDocument,
  PrintableTemplate,
  RenderedTemplateDocument,
  TemplateInputValue,
} from "./types";

const pdfWidth = 612;
const pngWidth = 1275;
const pngHeight = 1650;

function escapePdfText(value: string) {
  return value
    .replace(/□/g, "[]")
    .replace(/&/g, "and")
    .replace(/\\/g, "\\\\")
    .replace(/\(/g, "\\(")
    .replace(/\)/g, "\\)");
}

function createPdf(objects: Buffer[]) {
  const chunks: Buffer[] = [Buffer.from("%PDF-1.4\n", "binary")];
  const offsets = [0];
  let byteLength = chunks[0].length;

  objects.forEach((object, index) => {
    offsets.push(byteLength);
    const prefix = Buffer.from(`${index + 1} 0 obj\n`, "binary");
    const suffix = Buffer.from("\nendobj\n", "binary");
    chunks.push(prefix, object, suffix);
    byteLength += prefix.length + object.length + suffix.length;
  });

  const xrefOffset = byteLength;
  const xref = [
    `xref\n0 ${objects.length + 1}\n0000000000 65535 f \n`,
    ...offsets.slice(1).map((offset) => `${String(offset).padStart(10, "0")} 00000 n \n`),
    `trailer << /Size ${objects.length + 1} /Root 1 0 R >>\nstartxref\n${xrefOffset}\n%%EOF`,
  ].join("");
  chunks.push(Buffer.from(xref, "binary"));

  return Buffer.concat(chunks);
}

type PdfTemplateCell = {
  text: string | string[];
  span?: number;
};

type PdfTemplateRow = {
  cells: PdfTemplateCell[];
  kind?: "section" | "regular" | "tallSm" | "tallMd" | "tallLg" | "signature";
};

const patientIntakePdfRows: PdfTemplateRow[] = [
  { kind: "section", cells: [{ text: "Patient Information", span: 4 }] },
  { cells: [{ text: "Name", span: 3 }, { text: "DOB (MM/DD/YYYY):" }] },
  {
    kind: "tallSm",
    cells: [
      { text: "Gender: [] Male [] Female [] Other: ____________", span: 2 },
      { text: "Preferred Pronouns: [] He/Him [] She/Her [] They/Them [] Other: ____________", span: 2 },
    ],
  },
  { cells: [{ text: "Address:", span: 3 }, { text: "City" }] },
  { cells: [{ text: "State:" }, { text: "Zip:" }, { text: "Phone:", span: 2 }] },
  { cells: [{ text: "Email:", span: 2 }, { text: "Preferred Contact Method: [] Phone [] Email []Text", span: 2 }] },
  { cells: [{ text: "Emergency Contact Name:", span: 3 }, { text: "Phone:" }] },
  { cells: [{ text: "Relationship to Patient", span: 4 }] },
  { kind: "section", cells: [{ text: "Insurance Information (if applicable)", span: 4 }] },
  { cells: [{ text: "Provider:", span: 2 }, { text: "Policy number:", span: 2 }] },
  { cells: [{ text: "Group Number:", span: 2 }, { text: "Policyholder Name", span: 2 }] },
  { cells: [{ text: "Relationship to Patient: [] Self [] Spouse [] Parent [] Other: ____________", span: 4 }] },
  { kind: "section", cells: [{ text: "Reason for Visit", span: 4 }] },
  { kind: "tallMd", cells: [{ text: "Primary Reason for Visit:", span: 4 }] },
  {
    kind: "tallSm",
    cells: [
      { text: "How long have you had this issue?", span: 2 },
      { text: "Have you been treated for this before? [] Yes [] No", span: 2 },
    ],
  },
  { kind: "section", cells: [{ text: "Medical History Summary", span: 4 }] },
  {
    kind: "tallMd",
    cells: [
      {
        text: [
          "Do you have any of the following conditions? (Check all that apply) [] Diabetes [] Hypertension [] Heart Disease [] Asthma []",
          "Cancer [] Stroke [] Other: ____________",
        ],
        span: 4,
      },
    ],
  },
  {
    kind: "tallLg",
    cells: [
      { text: ["Are you currently taking any", "medications? [] Yes [] No"], span: 2 },
      { text: "If yes, list medications:", span: 2 },
    ],
  },
  {
    kind: "tallLg",
    cells: [
      { text: ["Do you have any allergies? [] Yes []", "No"], span: 2 },
      { text: "If yes, list allergies:", span: 2 },
    ],
  },
  {
    kind: "tallLg",
    cells: [
      { text: ["Have you had any surgeries or", "hospitalizations? [] Yes [] No"], span: 2 },
      { text: "If yes, list procedures and dates:", span: 2 },
    ],
  },
  { kind: "section", cells: [{ text: "Lifestyle and Social History", span: 4 }] },
  { cells: [{ text: "Do you smoke or use tobacco products? [] Yes [] No [] Former Smoker", span: 4 }] },
  { cells: [{ text: "Do you consume alcohol? [] Yes [] No [] Occasionally", span: 4 }] },
  { cells: [{ text: "Do you use recreational drugs? [] Yes [] No", span: 4 }] },
  { cells: [{ text: "Occupation:", span: 4 }] },
  {
    cells: [
      {
        text: "Do you have any concerns about access to healthcare, transportation, or financial barriers? [] Yes [] No",
        span: 4,
      },
    ],
  },
  { cells: [{ text: "If yes, please describe: _______________________________________", span: 4 }] },
  { kind: "section", cells: [{ text: "Pharmacy Information", span: 4 }] },
  { cells: [{ text: "Preferred Pharmacy Name:", span: 2 }, { text: "Phone Number:", span: 2 }] },
  { cells: [{ text: "Address:", span: 4 }] },
  { kind: "section", cells: [{ text: "Consent and Signature", span: 4 }] },
  { cells: [{ text: "I confirm that the information provided is accurate to the best of my knowledge.", span: 4 }] },
  { kind: "signature", cells: [{ text: "Signature:", span: 3 }, { text: "Date:" }] },
];

function rowUnit(kind: PdfTemplateRow["kind"]) {
  switch (kind) {
    case "tallSm":
      return 1.9;
    case "tallMd":
      return 1.7;
    case "tallLg":
      return 2.3;
    case "signature":
      return 1.45;
    default:
      return 1;
  }
}

function pdfY(pageHeight: number, yTop: number, height: number) {
  return pageHeight - yTop - height;
}

function drawPdfCheckMark(commands: string[], x: number, y: number, w: number, h: number) {
  const size = Math.min(w, h);
  const stroke = Math.max(1.1, size * 0.12);
  const x1 = x + size * 0.18;
  const y1 = y + size * 0.48;
  const x2 = x + size * 0.4;
  const y2 = y + size * 0.22;
  const x3 = x + size * 0.84;
  const y3 = y + size * 0.78;
  commands.push(
    `q 0 0 0 RG ${stroke.toFixed(2)} w 1 J 1 j ${x1.toFixed(2)} ${y1.toFixed(2)} m ${x2.toFixed(2)} ${y2.toFixed(2)} l ${x3.toFixed(2)} ${y3.toFixed(2)} l S Q`,
  );
}

function drawPdfTemplate(commands: string[], pageHeight: number) {
  const tableX = 11;
  const tableY = 22;
  const tableWidth = pdfWidth - tableX * 2;
  const tableHeight = pageHeight - tableY * 2;
  const columnPercents = [12.5, 16.5, 42, 29];
  const columnWidths = columnPercents.map((percent) => (percent / 100) * tableWidth);
  const unitTotal = patientIntakePdfRows.reduce((total, row) => total + rowUnit(row.kind), 0);
  const unitHeight = tableHeight / unitTotal;
  let yTop = tableY;

  commands.push("0 0 0 RG 0.7 w");

  for (const row of patientIntakePdfRows) {
    const rowHeight = rowUnit(row.kind) * unitHeight;
    let colIndex = 0;

    for (const cell of row.cells) {
      const span = cell.span ?? 1;
      const x = tableX + columnWidths.slice(0, colIndex).reduce((total, width) => total + width, 0);
      const width = columnWidths.slice(colIndex, colIndex + span).reduce((total, columnWidth) => total + columnWidth, 0);
      const y = pdfY(pageHeight, yTop, rowHeight);

      if (row.kind === "section") {
        commands.push(`q 0.93 0.93 0.93 rg ${x.toFixed(2)} ${y.toFixed(2)} ${width.toFixed(2)} ${rowHeight.toFixed(2)} re f Q`);
      }
      commands.push(`${x.toFixed(2)} ${y.toFixed(2)} ${width.toFixed(2)} ${rowHeight.toFixed(2)} re S`);

      const lines = Array.isArray(cell.text) ? cell.text : [cell.text];
      lines.slice(0, 3).forEach((line, index) => {
        const textY = pageHeight - yTop - 11.5 - index * 11;
        commands.push(`BT /F1 9.8 Tf ${(x + 3).toFixed(2)} ${textY.toFixed(2)} Td (${escapePdfText(line)}) Tj ET`);
      });

      colIndex += span;
    }

    yTop += rowHeight;
  }
}

function makePdf(template: PrintableTemplate, inputValues: TemplateInputValue[]) {
  const pageHeight = pdfWidth * (template.layoutSettings.heightIn / template.layoutSettings.widthIn);
  const values = valuesByInputId(inputValues);
  const commands: string[] = [`q 1 1 1 rg 0 0 ${pdfWidth} ${pageHeight.toFixed(2)} re f Q`];

  if (template.pageId === "patient-intake-form") {
    drawPdfTemplate(commands, pageHeight);
  } else {
    commands.push(`BT /F1 18 Tf 42 ${(pageHeight - 48).toFixed(2)} Td (${escapePdfText(template.name)}) Tj ET`);
    commands.push(`0 0 0 RG 1.2 w 42 ${(pageHeight - 64).toFixed(2)} m 570 ${(pageHeight - 64).toFixed(2)} l S`);
  }

  for (const definition of template.inputDefinitions) {
    const x = (definition.bounds.xPercent / 100) * pdfWidth;
    const yTop = (definition.bounds.yPercent / 100) * pageHeight;
    const w = (definition.bounds.widthPercent / 100) * pdfWidth;
    const h = (definition.bounds.heightPercent / 100) * pageHeight;
    const y = pageHeight - yTop - h;
    const rawValue = values.get(definition.inputId);
    const checkedOptions = selectedCheckOptions(definition, rawValue);

    if (checkedOptions.length > 0) {
      for (const option of checkedOptions) {
        const optionX = (option.bounds.xPercent / 100) * pdfWidth;
        const optionYTop = (option.bounds.yPercent / 100) * pageHeight;
        const optionW = (option.bounds.widthPercent / 100) * pdfWidth;
        const optionH = (option.bounds.heightPercent / 100) * pageHeight;
        drawPdfCheckMark(commands, optionX, pageHeight - optionYTop - optionH, optionW, optionH);
      }
      continue;
    }

    if (shouldDrawSimpleCheck(definition, rawValue)) {
      drawPdfCheckMark(commands, x, y, w, h);
      continue;
    }

    const value = escapePdfText(formatInputValue(definition, rawValue));
    if (!value) {
      continue;
    }

    if (definition.displaySettings.useWhiteBackground) {
      commands.push(`q 1 1 1 rg ${x.toFixed(2)} ${y.toFixed(2)} ${w.toFixed(2)} ${h.toFixed(2)} re f Q`);
    }
    commands.push(
      `BT /F1 ${definition.displaySettings.fontSizePt ?? 10} Tf ${(x + 3).toFixed(2)} ${(y + h - 12).toFixed(2)} Td (${value}) Tj ET`,
    );
  }

  const content = commands.join("\n");
  const objects = [
    Buffer.from("<< /Type /Catalog /Pages 2 0 R >>", "binary"),
    Buffer.from("<< /Type /Pages /Kids [3 0 R] /Count 1 >>", "binary"),
    Buffer.from(
      `<< /Type /Page /Parent 2 0 R /MediaBox [0 0 ${pdfWidth} ${pageHeight.toFixed(2)}] /Resources << /Font << /F1 4 0 R >> >> /Contents 5 0 R >>`,
      "binary",
    ),
    Buffer.from("<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>", "binary"),
    Buffer.from(`<< /Length ${Buffer.byteLength(content)} >>\nstream\n${content}\nendstream`, "binary"),
  ];

  return createPdf(objects);
}

function crc32(buffer: Buffer) {
  let crc = -1;
  for (const byte of buffer) {
    crc ^= byte;
    for (let index = 0; index < 8; index += 1) {
      crc = (crc >>> 1) ^ (0xedb88320 & -(crc & 1));
    }
  }
  return (crc ^ -1) >>> 0;
}

function pngChunk(type: string, data: Buffer) {
  const typeBuffer = Buffer.from(type);
  const length = Buffer.alloc(4);
  length.writeUInt32BE(data.length);
  const crc = Buffer.alloc(4);
  crc.writeUInt32BE(crc32(Buffer.concat([typeBuffer, data])));
  return Buffer.concat([length, typeBuffer, data, crc]);
}

function fillRect(pixels: Buffer, x: number, y: number, w: number, h: number, color: [number, number, number, number]) {
  const x0 = Math.max(0, Math.floor(x));
  const y0 = Math.max(0, Math.floor(y));
  const x1 = Math.min(pngWidth, Math.ceil(x + w));
  const y1 = Math.min(pngHeight, Math.ceil(y + h));
  for (let row = y0; row < y1; row += 1) {
    for (let col = x0; col < x1; col += 1) {
      const offset = (row * pngWidth + col) * 4;
      pixels[offset] = color[0];
      pixels[offset + 1] = color[1];
      pixels[offset + 2] = color[2];
      pixels[offset + 3] = color[3];
    }
  }
}

function fillCircle(pixels: Buffer, cx: number, cy: number, radius: number, color: [number, number, number, number]) {
  const x0 = Math.max(0, Math.floor(cx - radius));
  const y0 = Math.max(0, Math.floor(cy - radius));
  const x1 = Math.min(pngWidth, Math.ceil(cx + radius));
  const y1 = Math.min(pngHeight, Math.ceil(cy + radius));
  const radiusSq = radius * radius;
  for (let row = y0; row < y1; row += 1) {
    for (let col = x0; col < x1; col += 1) {
      const dx = col - cx;
      const dy = row - cy;
      if (dx * dx + dy * dy > radiusSq) continue;
      const offset = (row * pngWidth + col) * 4;
      pixels[offset] = color[0];
      pixels[offset + 1] = color[1];
      pixels[offset + 2] = color[2];
      pixels[offset + 3] = color[3];
    }
  }
}

function drawPngLine(
  pixels: Buffer,
  x1: number,
  y1: number,
  x2: number,
  y2: number,
  thickness: number,
  color: [number, number, number, number],
) {
  const steps = Math.max(1, Math.ceil(Math.hypot(x2 - x1, y2 - y1)));
  for (let index = 0; index <= steps; index += 1) {
    const progress = index / steps;
    fillCircle(pixels, x1 + (x2 - x1) * progress, y1 + (y2 - y1) * progress, thickness / 2, color);
  }
}

function drawPngCheckMark(pixels: Buffer, x: number, y: number, w: number, h: number) {
  const size = Math.min(w, h);
  const thickness = Math.max(3, size * 0.12);
  const x1 = x + size * 0.18;
  const y1 = y + size * 0.52;
  const x2 = x + size * 0.4;
  const y2 = y + size * 0.78;
  const x3 = x + size * 0.84;
  const y3 = y + size * 0.22;
  drawPngLine(pixels, x1, y1, x2, y2, thickness, [15, 23, 42, 255]);
  drawPngLine(pixels, x2, y2, x3, y3, thickness, [15, 23, 42, 255]);
}

function makePng(template: PrintableTemplate, inputValues: TemplateInputValue[]) {
  const pixels = Buffer.alloc(pngWidth * pngHeight * 4, 255);
  const values = valuesByInputId(inputValues);
  fillRect(pixels, 80, 128, 1115, 4, [17, 24, 39, 255]);

  for (const definition of template.inputDefinitions) {
    const x = (definition.bounds.xPercent / 100) * pngWidth;
    const y = (definition.bounds.yPercent / 100) * pngHeight;
    const w = (definition.bounds.widthPercent / 100) * pngWidth;
    const h = (definition.bounds.heightPercent / 100) * pngHeight;
    const rawValue = values.get(definition.inputId);
    const checkedOptions = selectedCheckOptions(definition, rawValue);

    if (checkedOptions.length > 0) {
      for (const option of checkedOptions) {
        drawPngCheckMark(
          pixels,
          (option.bounds.xPercent / 100) * pngWidth,
          (option.bounds.yPercent / 100) * pngHeight,
          (option.bounds.widthPercent / 100) * pngWidth,
          (option.bounds.heightPercent / 100) * pngHeight,
        );
      }
      continue;
    }

    if (shouldDrawSimpleCheck(definition, rawValue)) {
      drawPngCheckMark(pixels, x, y, w, h);
      continue;
    }

    const hasValue = formatInputValue(definition, rawValue).length > 0;
    if (definition.displaySettings.useWhiteBackground) {
      fillRect(pixels, x, y, w, h, [255, 255, 255, 255]);
    }
    fillRect(pixels, x, y + h - 3, w, 3, hasValue ? [15, 23, 42, 255] : [148, 163, 184, 255]);
    fillRect(pixels, x, y, 3, h, [203, 213, 225, 255]);
    fillRect(pixels, x + w - 3, y, 3, h, [203, 213, 225, 255]);
  }

  const scanlines = Buffer.alloc((pngWidth * 4 + 1) * pngHeight);
  for (let row = 0; row < pngHeight; row += 1) {
    const scanlineOffset = row * (pngWidth * 4 + 1);
    scanlines[scanlineOffset] = 0;
    pixels.copy(scanlines, scanlineOffset + 1, row * pngWidth * 4, (row + 1) * pngWidth * 4);
  }

  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(pngWidth, 0);
  ihdr.writeUInt32BE(pngHeight, 4);
  ihdr[8] = 8;
  ihdr[9] = 6;
  return Buffer.concat([
    Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]),
    pngChunk("IHDR", ihdr),
    pngChunk("IDAT", deflateSync(scanlines)),
    pngChunk("IEND", Buffer.alloc(0)),
  ]);
}

export function renderTemplatePdf(template: PrintableTemplate, inputValues: TemplateInputValue[] = []) {
  return makePdf(template, inputValues);
}

export function renderTemplatePng(template: PrintableTemplate, inputValues: TemplateInputValue[] = []) {
  return makePng(template, inputValues);
}

export function toRenderedDocument(
  template: PrintableTemplate,
  mimeType: "application/pdf" | "image/png",
  data: Buffer,
): RenderedTemplateDocument | BlankTemplateDocument {
  const extension = mimeType === "application/pdf" ? "pdf" : "png";
  return {
    pageId: template.pageId,
    fileName: `${template.pageId}.${extension}`,
    mimeType,
    fileDataBase64: data.toString("base64"),
  };
}
