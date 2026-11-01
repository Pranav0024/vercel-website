import { createRequire } from "node:module";
const load = createRequire(import.meta.url);
load("@next/env").loadEnvConfig(process.cwd(), true);
const token = process.env.CATALOGUE_GITHUB_TOKEN;
if (!token)
  throw new Error(
    "Add the restricted CATALOGUE_GITHUB_TOKEN to your ignored .env.local file first. Do not paste it into chat.",
  );
if (token.startsWith("gho_"))
  throw new Error(
    "Use a repository-restricted fine-grained token, not the GitHub CLI OAuth credential.",
  );
const repository =
  process.env.CATALOGUE_GITHUB_REPOSITORY || "Pranav0024/paniar-catalogue";
const branch = process.env.CATALOGUE_GITHUB_BRANCH || "main";
if (!/^[\w.-]+\/[\w.-]+$/.test(repository))
  throw new Error("Invalid storage repository.");
const headers = {
  Authorization: `Bearer ${token}`,
  Accept: "application/vnd.github+json",
  "X-GitHub-Api-Version": "2026-03-10",
};
async function api(endpoint, body) {
  const response = await fetch(
    `https://api.github.com/repos/${repository}${endpoint}`,
    {
      method: body ? "PUT" : "GET",
      headers: {
        ...headers,
        ...(body ? { "Content-Type": "application/json" } : {}),
      },
      ...(body ? { body: JSON.stringify(body) } : {}),
      signal: AbortSignal.timeout(15000),
    },
  );
  if (!response.ok)
    throw new Error(
      `Storage access failed (HTTP ${response.status}). Check the selected repository, token permissions and branch.`,
    );
  return response.json();
}
const repo = await api("");
if (repo.private !== true)
  throw new Error("Refusing public catalogue storage.");
const file = await api(
  `/contents/data/catalogue.json?ref=${encodeURIComponent(branch)}`,
);
if (!file.content || !file.sha)
  throw new Error("The remote catalogue is missing or unsupported.");
const doc = JSON.parse(Buffer.from(file.content, "base64").toString("utf8"));
if (
  doc.version !== 1 ||
  !Array.isArray(doc.products) ||
  !Array.isArray(doc.publishedProducts)
)
  throw new Error("Invalid stored catalogue.");
if (process.argv.includes("--check-write")) {
  await api("/contents/data/catalogue.json", {
    message: "Verify catalogue storage connection (no data changes)",
    branch,
    sha: file.sha,
    content: file.content.replace(/\s/g, ""),
  });
}
console.log(
  `Verified private GitHub storage: ${repository} (${branch}), ${doc.products.length} drafts, ${doc.publishedProducts.filter((p) => p.published).length} visible published products. ${process.argv.includes("--check-write") ? "Write access verified without changing catalogue data." : "Read access verified; use --check-write to check saving permissions."}`,
);
