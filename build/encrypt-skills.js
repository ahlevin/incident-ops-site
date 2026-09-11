#!/usr/bin/env node
/*
 * Encrypts the skill sources for the website.
 *
 * Usage:
 *     node build/encrypt-skills.js "your-passphrase"
 *
 * Reads every .md file from the folder set by SKILLS_DIR (default:
 * ../skills-source, i.e. a folder NEXT TO this repo, never inside it).
 * Writes js/skills-locked.js containing only AES-256-GCM ciphertext.
 *
 * No npm install required — Node's built-in crypto module does it all.
 */
const fs = require("fs");
const path = require("path");
const crypto = require("crypto");

const ITERATIONS = 310000;
const REPO = path.resolve(__dirname, "..");
const SRC = process.env.SKILLS_DIR
  ? path.resolve(process.env.SKILLS_DIR)
  : path.resolve(REPO, "..", "skills-source");

const password = process.argv[2];
if (!password) {
  console.error('Usage: node build/encrypt-skills.js "your-passphrase"');
  process.exit(1);
}

if (!fs.existsSync(SRC)) {
  console.error("Can't find the skill sources folder:\n   " + SRC);
  console.error("\nPut your skill .md files there, or set SKILLS_DIR:");
  console.error('   SKILLS_DIR=/path/to/folder node build/encrypt-skills.js "pw"');
  process.exit(1);
}

const files = fs.readdirSync(SRC).filter((f) => f.endsWith(".md"));
if (!files.length) {
  console.error("No .md files found in " + SRC);
  process.exit(1);
}

const payload = {};
for (const f of files) {
  const slug = f.replace(/\.md$/, "");
  const plaintext = fs.readFileSync(path.join(SRC, f), "utf8");

  const salt = crypto.randomBytes(16);
  const iv = crypto.randomBytes(12);
  const key = crypto.pbkdf2Sync(password, salt, ITERATIONS, 32, "sha256");

  const cipher = crypto.createCipheriv("aes-256-gcm", key, iv);
  const body = Buffer.concat([cipher.update(plaintext, "utf8"), cipher.final()]);
  const tag = cipher.getAuthTag();

  payload[slug] = {
    s: salt.toString("base64"),
    i: iv.toString("base64"),
    c: Buffer.concat([body, tag]).toString("base64"), // WebCrypto expects tag appended
  };
}

const out = path.join(REPO, "js", "skills-locked.js");
fs.writeFileSync(
  out,
  "// AES-256-GCM ciphertext only. No plaintext, no password.\n" +
    '// Regenerate: node build/encrypt-skills.js "<passphrase>"\n' +
    "const SKILL_ITERATIONS = " + ITERATIONS + ";\n" +
    "const SKILLS_LOCKED = " + JSON.stringify(payload) + ";\n"
);

console.log("Encrypted " + files.length + " skills.");
console.log("Wrote " + path.relative(REPO, out));
console.log("\nNext: git add js/skills-locked.js && git commit -m \"Rotate skill encryption\"");
