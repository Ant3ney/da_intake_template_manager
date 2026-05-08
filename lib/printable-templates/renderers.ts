import { promises as fs } from "fs";
import path from "path";
import { PDFDocument, rgb, StandardFonts } from "pdf-lib";
import sharp from "sharp";
import { getChoiceOtherText, selectedCheckOptions, shouldDrawSimpleCheck } from "./check-options";
import { formatInputValue, valuesByInputId } from "./format";
import type {
  BlankTemplateDocument,
  PrintableTemplate,
  RenderedTemplateDocument,
  TemplateInputValue,
} from "./types";

function publicAssetPath(src: string) {
  const cleanSrc = src.startsWith("/") ? src.slice(1) : src;
  return path.join(process.cwd(), "public", cleanSrc);
}

async function readBackgroundImage(template: PrintableTemplate) {
  return fs.readFile(publicAssetPath(template.backgroundImage.src));
}

function escapeXml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function svgTextAnchor(textAlign: "left" | "center" | "right" | undefined) {
  if (textAlign === "center") return "middle";
  if (textAlign === "right") return "end";
  return "start";
}

function alignedSvgX(x: number, w: number, textAlign: "left" | "center" | "right" | undefined) {
  if (textAlign === "center") return x + w / 2;
  if (textAlign === "right") return x + w - 4;
  return x + 4;
}

function alignedPdfX(x: number, w: number, textWidth: number, textAlign: "left" | "center" | "right" | undefined) {
  if (textAlign === "center") return x + (w - textWidth) / 2;
  if (textAlign === "right") return x + w - textWidth - 3;
  return x + 3;
}

async function backgroundPngBuffer(template: PrintableTemplate) {
  const image = await readBackgroundImage(template);
  if (template.backgroundImage.mimeType === "image/png") return image;
  return sharp(image).png().toBuffer();
}

function drawPdfCheckMark(page: import("pdf-lib").PDFPage, x: number, y: number, w: number, h: number) {
  const size = Math.min(w, h);
  const stroke = Math.max(1.1, size * 0.12);
  page.drawLine({
    start: { x: x + size * 0.18, y: y + size * 0.48 },
    end: { x: x + size * 0.4, y: y + size * 0.22 },
    thickness: stroke,
    color: rgb(0, 0, 0),
  });
  page.drawLine({
    start: { x: x + size * 0.4, y: y + size * 0.22 },
    end: { x: x + size * 0.84, y: y + size * 0.78 },
    thickness: stroke,
    color: rgb(0, 0, 0),
  });
}

export async function renderTemplatePdf(template: PrintableTemplate, inputValues: TemplateInputValue[] = []) {
  const pageWidth = 612;
  const pageHeight = pageWidth * (template.layoutSettings.heightIn / template.layoutSettings.widthIn);
  const background = await backgroundPngBuffer(template);
  const pdf = await PDFDocument.create();
  const page = pdf.addPage([pageWidth, pageHeight]);
  const font = await pdf.embedFont(StandardFonts.Helvetica);
  const backgroundImage = await pdf.embedPng(background);
  const values = valuesByInputId(inputValues);

  page.drawImage(backgroundImage, { x: 0, y: 0, width: pageWidth, height: pageHeight });

  for (const definition of template.inputDefinitions) {
    const x = (definition.bounds.xPercent / 100) * pageWidth;
    const yTop = (definition.bounds.yPercent / 100) * pageHeight;
    const w = (definition.bounds.widthPercent / 100) * pageWidth;
    const h = (definition.bounds.heightPercent / 100) * pageHeight;
    const y = pageHeight - yTop - h;
    const rawValue = values.get(definition.inputId);
    const otherText = getChoiceOtherText(rawValue);
    const checkedOptions = selectedCheckOptions(definition, rawValue);

    if (checkedOptions.length > 0) {
      for (const option of checkedOptions) {
        const optionX = (option.bounds.xPercent / 100) * pageWidth;
        const optionYTop = (option.bounds.yPercent / 100) * pageHeight;
        const optionW = (option.bounds.widthPercent / 100) * pageWidth;
        const optionH = (option.bounds.heightPercent / 100) * pageHeight;
        drawPdfCheckMark(page, optionX, pageHeight - optionYTop - optionH, optionW, optionH);
        if (option.textBoxBounds && otherText) {
          const textBoxX = (option.textBoxBounds.xPercent / 100) * pageWidth;
          const textBoxYTop = (option.textBoxBounds.yPercent / 100) * pageHeight;
          const textBoxW = (option.textBoxBounds.widthPercent / 100) * pageWidth;
          const textBoxH = (option.textBoxBounds.heightPercent / 100) * pageHeight;
          page.drawRectangle({
            x: textBoxX,
            y: pageHeight - textBoxYTop - textBoxH,
            width: textBoxW,
            height: textBoxH,
            color: rgb(1, 1, 1),
          });
          page.drawText(otherText, {
            x: textBoxX + 3,
            y: pageHeight - textBoxYTop - textBoxH + Math.max(2, textBoxH - 11),
            size: 10,
            font,
            color: rgb(0, 0, 0),
          });
        }
      }
      continue;
    }

    if (shouldDrawSimpleCheck(definition, rawValue)) {
      drawPdfCheckMark(page, x, y, w, h);
      continue;
    }

    const value = formatInputValue(definition, rawValue);
    if (!value) continue;

    if (definition.displaySettings.useWhiteBackground) {
      page.drawRectangle({ x, y, width: w, height: h, color: rgb(1, 1, 1) });
    }

    const fontSize = definition.displaySettings.fontSizePt ?? 10;
    const textWidth = font.widthOfTextAtSize(value, fontSize);
    page.drawText(value, {
      x: alignedPdfX(x, w, textWidth, definition.displaySettings.textAlign),
      y: y + Math.max(2, h - fontSize - 1),
      size: fontSize,
      font,
      color: rgb(0, 0, 0),
    });
  }

  return Buffer.from(await pdf.save());
}

function checkMarkSvg(x: number, y: number, w: number, h: number) {
  const size = Math.min(w, h);
  const stroke = Math.max(2, size * 0.12);
  const x1 = x + size * 0.18;
  const y1 = y + size * 0.52;
  const x2 = x + size * 0.4;
  const y2 = y + size * 0.78;
  const x3 = x + size * 0.84;
  const y3 = y + size * 0.22;
  return `<path d="M ${x1} ${y1} L ${x2} ${y2} L ${x3} ${y3}" fill="none" stroke="#000" stroke-width="${stroke}" stroke-linecap="round" stroke-linejoin="round" />`;
}

export async function renderTemplatePng(template: PrintableTemplate, inputValues: TemplateInputValue[] = []) {
  const background = await readBackgroundImage(template);
  const base = sharp(background).resize(template.backgroundImage.widthPx, template.backgroundImage.heightPx, {
    fit: "fill",
  });
  const values = valuesByInputId(inputValues);
  const svgParts: string[] = [];
  const width = template.backgroundImage.widthPx;
  const height = template.backgroundImage.heightPx;

  for (const definition of template.inputDefinitions) {
    const x = (definition.bounds.xPercent / 100) * width;
    const y = (definition.bounds.yPercent / 100) * height;
    const w = (definition.bounds.widthPercent / 100) * width;
    const h = (definition.bounds.heightPercent / 100) * height;
    const rawValue = values.get(definition.inputId);
    const otherText = getChoiceOtherText(rawValue);
    const checkedOptions = selectedCheckOptions(definition, rawValue);

    if (checkedOptions.length > 0) {
      for (const option of checkedOptions) {
        const optionX = (option.bounds.xPercent / 100) * width;
        const optionY = (option.bounds.yPercent / 100) * height;
        const optionW = (option.bounds.widthPercent / 100) * width;
        const optionH = (option.bounds.heightPercent / 100) * height;
        svgParts.push(checkMarkSvg(optionX, optionY, optionW, optionH));
        if (option.textBoxBounds && otherText) {
          const textX = (option.textBoxBounds.xPercent / 100) * width;
          const textY = (option.textBoxBounds.yPercent / 100) * height;
          const textW = (option.textBoxBounds.widthPercent / 100) * width;
          const textH = (option.textBoxBounds.heightPercent / 100) * height;
          svgParts.push(`<rect x="${textX}" y="${textY}" width="${textW}" height="${textH}" fill="#fff" />`);
          svgParts.push(`<text x="${textX + 8}" y="${textY + textH - 8}" font-family="Arial, Helvetica, sans-serif" font-size="42" fill="#000">${escapeXml(otherText)}</text>`);
        }
      }
      continue;
    }

    if (shouldDrawSimpleCheck(definition, rawValue)) {
      svgParts.push(checkMarkSvg(x, y, w, h));
      continue;
    }

    const value = formatInputValue(definition, rawValue);
    if (!value) continue;

    if (definition.displaySettings.useWhiteBackground) {
      svgParts.push(`<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="#fff" />`);
    }

    const fontSize = ((definition.displaySettings.fontSizePt ?? 10) / 72) * (width / template.layoutSettings.widthIn);
    const textX = alignedSvgX(x, w, definition.displaySettings.textAlign);
    const anchor = svgTextAnchor(definition.displaySettings.textAlign);
    svgParts.push(
      `<text x="${textX}" y="${y + h - Math.max(4, fontSize * 0.22)}" text-anchor="${anchor}" font-family="Arial, Helvetica, sans-serif" font-size="${fontSize}" fill="#000">${escapeXml(value)}</text>`,
    );
  }

  const overlay = Buffer.from(
    `<svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">${svgParts.join("")}</svg>`,
  );

  return base.composite([{ input: overlay, left: 0, top: 0 }]).png().toBuffer();
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
