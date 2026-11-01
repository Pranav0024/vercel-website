import { randomBytes } from "node:crypto";
import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";

const file = path.join(process.cwd(), ".env.local");
let content = "";
try {
  content = await readFile(file, "utf8");
} catch (error) {
  if (error.code !== "ENOENT") throw error;
}
let changed = false;
function fillEmpty(name, generated) {
  const matches = [...content.matchAll(new RegExp(`^${name}\\s*=(.*)$`, "gm"))];
  const last = matches.at(-1);
  const value = last?.[1].trim();
  if (value && value !== '""' && value !== "''" && !value.startsWith("#"))
    return;
  const line = `${name}=${generated}`;
  if (last)
    content =
      content.slice(0, last.index) +
      line +
      content.slice(last.index + last[0].length);
  else content = content.trimEnd() + "\n" + line + "\n";
  changed = true;
}
fillEmpty("ADMIN_PASSWORD", randomBytes(24).toString("base64url"));
fillEmpty("ADMIN_SESSION_SECRET", randomBytes(48).toString("hex"));
if (changed) await writeFile(file, content, { mode: 0o600 });
console.log(
  "Admin credentials are saved in your ignored .env.local file. Open it to copy ADMIN_PASSWORD, then visit /admin. Existing values were preserved. Restart the server if necessary.",
);
