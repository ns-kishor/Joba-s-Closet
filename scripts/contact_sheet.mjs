import fs from "fs";
import path from "path";
import sharp from "sharp";

const DIR = "/home/z/my-project/public/images/products";
const files = fs.readdirSync(DIR).filter((f) => f.endsWith(".jpg")).sort();

const COLS = 8, CELL = 190, LABEL = 22;
const rows = Math.ceil(files.length / COLS);
const sheet = sharp({
  create: {
    width: COLS * CELL,
    height: rows * (CELL + LABEL),
    channels: 3,
    background: { r: 250, g: 244, b: 238 },
  },
});

const composites = [];
for (let i = 0; i < files.length; i++) {
  const x = (i % COLS) * CELL;
  const y = Math.floor(i / COLS) * (CELL + LABEL);
  const buf = await sharp(path.join(DIR, files[i]))
    .resize(CELL - 8, CELL - 8, { fit: "cover" })
    .jpeg({ quality: 70 })
    .toBuffer();
  composites.push({ input: buf, left: x + 4, top: y + 2 });
  const label = Buffer.from(
    `<svg width="${CELL}" height="${LABEL}"><text x="6" y="15" font-size="13" font-family="sans-serif" fill="#333">${files[i].replace(".jpg", "")}</text></svg>`,
  );
  composites.push({ input: label, left: x, top: y + CELL });
}
await sheet.composite(composites).jpeg({ quality: 78 }).toFile("/home/z/my-project/scripts/contact-sheet.jpg");
console.log("saved", files.length, "thumbs");
