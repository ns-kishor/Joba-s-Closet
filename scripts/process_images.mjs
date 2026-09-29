import fs from "fs";
import path from "path";
import sharp from "sharp";

const JSON_DIR = "/home/z/my-project/scripts/img-json";
const OUT = "/home/z/my-project/public/images/products";
fs.mkdirSync(OUT, { recursive: true });

const jsonFiles = fs
  .readdirSync(JSON_DIR)
  .filter((f) => f.endsWith(".json") && !f.startsWith("_"));

async function fetchBuffer(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return Buffer.from(await res.arrayBuffer());
}

async function processOne(key, idx, url) {
  const dest = path.join(OUT, `${key}-${idx}.jpg`);
  if (fs.existsSync(dest)) return `SKIP ${key}-${idx}`;
  try {
    const buf = await fetchBuffer(url);
    const meta = await sharp(buf).metadata();
    let pipeline = sharp(buf).rotate();
    if ((meta.width ?? 0) > 1000) pipeline = pipeline.resize({ width: 1000, withoutEnlargement: true });
    await pipeline.jpeg({ quality: 80, mozjpeg: true }).toFile(dest);
    return `OK   ${key}-${idx}`;
  } catch (e) {
    return `ERR  ${key}-${idx}: ${e.message}`;
  }
}

let total = 0;
for (const file of jsonFiles) {
  const key = file.replace(/\.json$/, "");
  let data;
  try {
    data = JSON.parse(fs.readFileSync(path.join(JSON_DIR, file), "utf8"));
  } catch {
    console.log(`BADJSON ${key}`);
    continue;
  }
  if (!data.success || !Array.isArray(data.results) || data.results.length === 0) {
    console.log(`NORESULTS ${key}`);
    continue;
  }
  const results = data.results.slice(0, 5);
  const settled = await Promise.allSettled(
    results.map((r, i) => processOne(key, i + 1, r.original_url)),
  );
  for (const s of settled) {
    const msg = s.status === "fulfilled" ? s.value : `ERR ${key}: ${s.reason?.message}`;
    console.log(msg);
    if (!msg.startsWith("SKIP")) total++;
  }
}

// report inventory
const files = fs.readdirSync(OUT).filter((f) => f.endsWith(".jpg"));
const byKey = {};
for (const f of files) {
  const k = f.replace(/-\d+\.jpg$/, "");
  byKey[k] = (byKey[k] ?? 0) + 1;
}
console.log("\n=== INVENTORY ===");
for (const [k, v] of Object.entries(byKey).sort()) console.log(`${k}: ${v}`);
console.log(`TOTAL FILES: ${files.length}`);
