import { writeFile } from "node:fs/promises";
import { PDFDocument, StandardFonts, rgb } from "pdf-lib";

const outputPath = new URL("./template-manager-docker-3051-ops.pdf", import.meta.url);

const title = "Template Manager Docker 3051 Operations Guide";
const subtitle = "How to rebuild and restart the local Docker server with the newest project version";

const sections = [
  {
    heading: "Purpose",
    body: [
      "Use this guide when localhost:3051 is showing an older version of the Printable Intake Template Manager and you want it to run the newest version from this project folder.",
      "This project currently uses Docker image templatemanager:local, container templatemanager-3051, and host port 3051 mapped to container port 3000.",
    ],
  },
  {
    heading: "Start In The Project Folder",
    body: [
      "Open a terminal and move into the Template Manager repo before running any commands.",
      "cd /home/anthony/Desktop/AnthonysFolder/clients/DelAireBC/digitalintake/v1/digitalintake/templatemanager",
    ],
  },
  {
    heading: "Recommended Update Flow",
    body: [
      "Run these commands when you have changed templates, images, API routes, docs, or app code and want localhost:3051 to show the newest project state.",
      "npm run seed",
      "npm run lint",
      "docker build -t templatemanager:local .",
      "docker rm -f templatemanager-3051",
      "docker run -d --name templatemanager-3051 -p 3051:3000 templatemanager:local",
    ],
  },
  {
    heading: "What Those Commands Do",
    body: [
      "npm run seed refreshes data/printable-templates.json from the static template catalog. Run this after adding or editing PrintableTemplate records.",
      "npm run lint checks the project for code issues before building the image.",
      "docker build -t templatemanager:local . creates a fresh Docker image from the current files in this folder.",
      "docker rm -f templatemanager-3051 stops and removes the old running container. It does not delete the rebuilt image.",
      "docker run -d --name templatemanager-3051 -p 3051:3000 templatemanager:local starts a new container and exposes it at http://localhost:3051.",
    ],
  },
  {
    heading: "Verify It Worked",
    body: [
      "After the container starts, check that Docker shows the container and the port mapping.",
      "docker ps --filter name=templatemanager-3051",
      "Then check the app routes from your terminal.",
      "curl -I http://localhost:3051/",
      "curl http://localhost:3051/api/templates/page-ids",
      "For a specific template, open or query its editor/context route.",
      "http://localhost:3051/dev/test-template-editor/PAGE_ID",
      "http://localhost:3051/api/templates/PAGE_ID/context",
    ],
  },
  {
    heading: "Useful Docker Commands",
    body: [
      "See running containers:",
      "docker ps",
      "See all containers, including stopped ones:",
      "docker ps -a",
      "Read recent server logs:",
      "docker logs --tail 100 templatemanager-3051",
      "Follow live logs:",
      "docker logs -f templatemanager-3051",
      "Stop the server:",
      "docker stop templatemanager-3051",
      "Start it again without rebuilding:",
      "docker start templatemanager-3051",
      "Remove the container:",
      "docker rm -f templatemanager-3051",
      "List local images:",
      "docker images",
    ],
  },
  {
    heading: "When To Rebuild",
    body: [
      "Rebuild the image after any code change, template module change, public asset change, package change, or seeded data change that should appear in the Docker-served app.",
      "If you only stopped the container and did not change project files, you can use docker start templatemanager-3051 instead of rebuilding.",
      "If port 3051 is already in use, find the existing container with docker ps and remove or stop the container using that port before running the new one.",
    ],
  },
  {
    heading: "Important Files",
    body: [
      "Dockerfile defines how the production image is built.",
      ".dockerignore controls what files are excluded from the Docker build context.",
      "public/template-assets contains runtime image assets used by templates.",
      "data/printable-templates.json is the active local template store copied into the Docker image.",
      "lib/printable-templates/templates contains the static seed catalog.",
    ],
  },
  {
    heading: "One Command Block To Memorize",
    body: [
      "cd /home/anthony/Desktop/AnthonysFolder/clients/DelAireBC/digitalintake/v1/digitalintake/templatemanager",
      "npm run seed && npm run lint && docker build -t templatemanager:local . && docker rm -f templatemanager-3051 && docker run -d --name templatemanager-3051 -p 3051:3000 templatemanager:local",
      "Then open http://localhost:3051.",
    ],
  },
];

const pageWidth = 612;
const pageHeight = 792;
const margin = 54;
const contentWidth = pageWidth - margin * 2;
const lineHeight = 13;
const paragraphGap = 6;
const sectionGap = 14;

const pdfDoc = await PDFDocument.create();
const regularFont = await pdfDoc.embedFont(StandardFonts.Helvetica);
const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
const monoFont = await pdfDoc.embedFont(StandardFonts.Courier);

let page = pdfDoc.addPage([pageWidth, pageHeight]);
let y = pageHeight - margin;

const addPage = () => {
  page = pdfDoc.addPage([pageWidth, pageHeight]);
  y = pageHeight - margin;
};

const ensureSpace = (height) => {
  if (y - height < margin) addPage();
};

const drawText = (text, x, currentY, size, font, color = rgb(0.08, 0.09, 0.1)) => {
  page.drawText(text, { x, y: currentY, size, font, color });
};

const wrapText = (text, font, size, maxWidth) => {
  const words = text.split(/\s+/);
  const lines = [];
  let current = "";

  for (const word of words) {
    const candidate = current ? `${current} ${word}` : word;
    if (font.widthOfTextAtSize(candidate, size) <= maxWidth) {
      current = candidate;
      continue;
    }

    if (current) lines.push(current);
    if (font.widthOfTextAtSize(word, size) <= maxWidth) {
      current = word;
      continue;
    }

    let chunk = "";
    for (const char of word) {
      const charCandidate = `${chunk}${char}`;
      if (font.widthOfTextAtSize(charCandidate, size) <= maxWidth) {
        chunk = charCandidate;
      } else {
        if (chunk) lines.push(chunk);
        chunk = char;
      }
    }
    current = chunk;
  }

  if (current) lines.push(current);
  return lines;
};

const isCommandLike = (text) =>
  /^(cd |npm |docker |curl |http:\/\/localhost:3051|\.dockerignore|Dockerfile|public\/|data\/|lib\/)/.test(text);

drawText(title, margin, y, 19, boldFont);
y -= 24;
for (const line of wrapText(subtitle, regularFont, 10.5, contentWidth)) {
  drawText(line, margin, y, 10.5, regularFont, rgb(0.25, 0.27, 0.31));
  y -= lineHeight;
}
y -= 16;

for (const section of sections) {
  ensureSpace(48);
  drawText(section.heading, margin, y, 13, boldFont);
  y -= 18;

  for (const paragraph of section.body) {
    const command = isCommandLike(paragraph);
    const font = command ? monoFont : regularFont;
    const size = command ? 8.7 : 9.7;
    const x = command ? margin + 12 : margin;
    const maxWidth = command ? contentWidth - 24 : contentWidth;
    const lines = wrapText(paragraph, font, size, maxWidth);
    const blockHeight = lines.length * lineHeight + paragraphGap + (command ? 8 : 0);

    ensureSpace(blockHeight);

    if (command) {
      page.drawRectangle({
        x: margin,
        y: y - lines.length * lineHeight - 3,
        width: contentWidth,
        height: lines.length * lineHeight + 9,
        color: rgb(0.95, 0.96, 0.97),
        borderColor: rgb(0.82, 0.84, 0.87),
        borderWidth: 0.5,
      });
    }

    for (const line of lines) {
      drawText(line, x, y, size, font, command ? rgb(0.05, 0.08, 0.12) : rgb(0.11, 0.12, 0.14));
      y -= lineHeight;
    }
    y -= paragraphGap + (command ? 5 : 0);
  }

  y -= sectionGap;
}

const pages = pdfDoc.getPages();
pages.forEach((pdfPage, index) => {
  pdfPage.drawText(`Page ${index + 1} of ${pages.length}`, {
    x: pageWidth - margin - 62,
    y: 30,
    size: 8,
    font: regularFont,
    color: rgb(0.42, 0.44, 0.48),
  });
});

await writeFile(outputPath, await pdfDoc.save());
console.log(`Wrote ${outputPath.pathname}`);
