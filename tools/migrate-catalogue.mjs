import { execFileSync } from "node:child_process";
import { readFile } from "node:fs/promises";
import path from "node:path";

// Workstation-only migration. Uses gh's existing login, not a token copied into
// application configuration. Refuses public repositories and remote overwrites.
const gh =
  process.platform === "win32"
    ? path.join(
        process.env.ProgramFiles || "C:/Program Files",
        "GitHub CLI",
        "gh.exe",
      )
    : "gh";
const repository = "Pranav0024/paniar-catalogue";
const branch = "main";
function api(endpoint, body) {
  try {
    return JSON.parse(
      execFileSync(
        gh,
        ["api", endpoint, ...(body ? ["--method", "PUT", "--input", "-"] : [])],
        {
          encoding: "utf8",
          input: body ? JSON.stringify(body) : undefined,
          stdio: ["pipe", "pipe", "pipe"],
          maxBuffer: 16 * 1024 * 1024,
        },
      ),
    );
  } catch (error) {
    if (String(error.stderr).includes("HTTP 404")) return null;
    throw new Error(
      "GitHub migration request failed. Check gh authentication and repository access.",
    );
  }
}
const repo = api(`repos/${repository}`);
if (!repo?.private)
  throw new Error(
    "Refusing to store drafts or internal prices in a public repository.",
  );
let content;
try {
  content = await readFile(
    new URL("../.data/catalogue.json", import.meta.url),
    "utf8",
  );
} catch (error) {
  if (error.code !== "ENOENT") throw error;
  content = await readFile(
    new URL("../data/catalogue.json", import.meta.url),
    "utf8",
  );
}
const document = JSON.parse(content);
if (
  document.version !== 1 ||
  !Array.isArray(document.products) ||
  !Array.isArray(document.publishedProducts)
)
  throw new Error("Invalid local catalogue.");
const existing = api(
  `repos/${repository}/contents/data/catalogue.json?ref=${branch}`,
);
if (existing) {
  if (
    Buffer.from(existing.content || "", "base64").toString("utf8") === content
  ) {
    console.log("Private catalogue is already seeded; no overwrite was made.");
    process.exit(0);
  }
  throw new Error(
    "A different remote catalogue already exists. Refusing to overwrite it; reconcile it before migrating.",
  );
}
const names = new Set(
  [...document.products, ...document.publishedProducts]
    .map((p) => p.mainImage)
    .filter(
      (url) =>
        typeof url === "string" && url.startsWith("/api/catalogue/images/"),
    )
    .map((url) => url.split("/").at(-1)),
);
for (const name of names) {
  if (!/^[a-f0-9-]{36}\.(jpg|png|webp)$/.test(name))
    throw new Error("Invalid uploaded image reference.");
  const bytes = await readFile(
    new URL(`../.data/images/${name}`, import.meta.url),
  );
  if (bytes.length > 4 * 1024 * 1024)
    throw new Error("Image exceeds the upload limit.");
  const endpoint = `repos/${repository}/contents/data/catalogue-images/${name}`;
  const old = api(endpoint + `?ref=${branch}`);
  if (old) {
    if (Buffer.from(old.content || "", "base64").equals(bytes)) continue;
    throw new Error(
      "An uploaded image already exists with different content; refusing to overwrite it.",
    );
  }
  const result = api(endpoint, {
    message: "Migrate catalogue image",
    branch,
    content: bytes.toString("base64"),
  });
  if (!result) throw new Error("Image migration was not confirmed.");
}
const result = api(`repos/${repository}/contents/data/catalogue.json`, {
  message: "Initialize private Paniar catalogue storage",
  branch,
  content: Buffer.from(content).toString("base64"),
});
if (!result?.content?.sha)
  throw new Error("Catalogue migration was not confirmed.");
console.log(
  `Private storage seeded: ${document.products.length} draft products, ${document.publishedProducts.length} published records, ${names.size} uploaded images. No existing remote data was overwritten.`,
);
