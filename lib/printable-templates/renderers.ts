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

function splitLongToken(token: string, fontSize: number, maxWidth: number, measureText: (text: string, size: number) => number) {
  const chunks: string[] = [];
  let current = "";

  for (const character of token) {
    const next = `${current}${character}`;
    if (current && measureText(next, fontSize) > maxWidth) {
      chunks.push(current);
      current = character;
    } else {
      current = next;
    }
  }

  if (current) chunks.push(current);
  return chunks;
}

function wrapTextToWidth(
  text: string,
  fontSize: number,
  maxWidth: number,
  measureText: (text: string, size: number) => number,
) {
  const lines: string[] = [];
  const paragraphs = text.replace(/\r\n?/g, "\n").split("\n");

  for (const paragraph of paragraphs) {
    const tokens = paragraph.trim().split(/\s+/).filter(Boolean);
    if (tokens.length === 0) {
      lines.push("");
      continue;
    }

    let current = "";
    for (const token of tokens) {
      const tokenParts =
        measureText(token, fontSize) > maxWidth ? splitLongToken(token, fontSize, maxWidth, measureText) : [token];

      for (const part of tokenParts) {
        const next = current ? `${current} ${part}` : part;
        if (current && measureText(next, fontSize) > maxWidth) {
          lines.push(current);
          current = part;
        } else {
          current = next;
        }
      }
    }

    if (current) lines.push(current);
  }

  return lines;
}

function ellipsizeText(text: string, fontSize: number, maxWidth: number, measureText: (text: string, size: number) => number) {
  if (measureText(text, fontSize) <= maxWidth) return text;
  const ellipsis = "...";
  let current = text;

  while (current.length > 0 && measureText(`${current}${ellipsis}`, fontSize) > maxWidth) {
    current = current.slice(0, -1);
  }

  return current ? `${current}${ellipsis}` : ellipsis;
}

function fitTextInBox(
  text: string,
  baseFontSize: number,
  boxWidth: number,
  boxHeight: number,
  measureText: (text: string, size: number) => number,
) {
  const minFontSize = Math.max(5, Math.min(baseFontSize, 7));
  const xPadding = 6;
  const yPadding = 4;
  const maxWidth = Math.max(1, boxWidth - xPadding);
  const maxHeight = Math.max(1, boxHeight - yPadding);

  for (let fontSize = baseFontSize; fontSize >= minFontSize; fontSize -= 0.5) {
    const lineHeight = fontSize * 1.16;
    const maxLines = Math.max(1, Math.floor(maxHeight / lineHeight));
    const lines = wrapTextToWidth(text, fontSize, maxWidth, measureText);

    if (lines.length <= maxLines) {
      return { fontSize, lineHeight, lines };
    }
  }

  const fontSize = minFontSize;
  const lineHeight = fontSize * 1.16;
  const maxLines = Math.max(1, Math.floor(maxHeight / lineHeight));
  const lines = wrapTextToWidth(text, fontSize, maxWidth, measureText).slice(0, maxLines);
  const lastIndex = lines.length - 1;
  if (lastIndex >= 0) {
    lines[lastIndex] = ellipsizeText(lines[lastIndex], fontSize, maxWidth, measureText);
  }

  return { fontSize, lineHeight, lines };
}

function drawPdfFittedText(
  page: import("pdf-lib").PDFPage,
  font: import("pdf-lib").PDFFont,
  text: string,
  x: number,
  y: number,
  w: number,
  h: number,
  baseFontSize: number,
  textAlign: "left" | "center" | "right" | undefined,
) {
  const fitted = fitTextInBox(text, baseFontSize, w, h, (value, size) => font.widthOfTextAtSize(value, size));
  const topPadding = Math.max(1, Math.min(3, h * 0.15));

  fitted.lines.forEach((line, index) => {
    const textWidth = font.widthOfTextAtSize(line, fitted.fontSize);
    page.drawText(line, {
      x: alignedPdfX(x, w, textWidth, textAlign),
      y: y + h - topPadding - fitted.fontSize - index * fitted.lineHeight,
      size: fitted.fontSize,
      font,
      color: rgb(0, 0, 0),
    });
  });
}

function svgApproxTextWidth(text: string, fontSize: number) {
  return text.length * fontSize * 0.54;
}

function svgFittedText(
  text: string,
  x: number,
  y: number,
  w: number,
  h: number,
  baseFontSize: number,
  textAlign: "left" | "center" | "right" | undefined,
) {
  const fitted = fitTextInBox(text, baseFontSize, w, h, svgApproxTextWidth);
  const textX = alignedSvgX(x, w, textAlign);
  const anchor = svgTextAnchor(textAlign);
  const topPadding = Math.max(2, Math.min(8, h * 0.15));
  const tspans = fitted.lines
    .map(
      (line, index) =>
        `<tspan x="${textX}" y="${y + topPadding + fitted.fontSize + index * fitted.lineHeight}">${escapeXml(line)}</tspan>`,
    )
    .join("");

  return `<text text-anchor="${anchor}" font-family="Arial, Helvetica, sans-serif" font-size="${fitted.fontSize}" fill="#000">${tspans}</text>`;
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
          drawPdfFittedText(
            page,
            font,
            otherText,
            textBoxX,
            pageHeight - textBoxYTop - textBoxH,
            textBoxW,
            textBoxH,
            10,
            "left",
          );
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
    drawPdfFittedText(page, font, value, x, y, w, h, fontSize, definition.displaySettings.textAlign);
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
          svgParts.push(svgFittedText(otherText, textX, textY, textW, textH, 42, "left"));
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
    svgParts.push(svgFittedText(value, x, y, w, h, fontSize, definition.displaySettings.textAlign));
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
