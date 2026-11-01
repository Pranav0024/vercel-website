import { mkdir, readFile, rename, writeFile, unlink } from "node:fs/promises";
import path from "node:path";
import { createHash, randomUUID } from "node:crypto";
import seed from "../data/catalogue.json";
import type { CatalogueDocument, PublicProduct } from "./catalogue-types";
import {
  CatalogueError,
  imageExtension,
  validateProducts,
} from "./catalogue-validation";

const initial = seed as CatalogueDocument;
const root = () =>
  process.env.CATALOGUE_LOCAL_DIR || path.join(process.cwd(), ".data");
const filePath = () => path.join(root(), "catalogue.json");
const revisionOf = (content: string) =>
  createHash("sha256").update(content).digest("hex");
const seedText = () => JSON.stringify(initial, null, 2) + "\n";

export function storageMode(): "local" | "github" | "readonly" {
  if (process.env.CATALOGUE_STORAGE === "github") return "github";
  if (
    process.env.CATALOGUE_STORAGE === "local" ||
    process.env.NODE_ENV !== "production"
  )
    return "local";
  return "readonly";
}
function githubConfig() {
  const repository =
    process.env.CATALOGUE_GITHUB_REPOSITORY || "Pranav0024/paniar-catalogue";
  const token = process.env.CATALOGUE_GITHUB_TOKEN;
  const branch = process.env.CATALOGUE_GITHUB_BRANCH || "main";
  if (!token || !/^[\w.-]+\/[\w.-]+$/.test(repository))
    throw new CatalogueError(
      "GitHub storage needs a restricted repository token. See ADMIN_SETUP.md.",
      503,
      "setup_required",
    );
  return { repository, token, branch };
}
let privacyCheck:
  | { key: string; expires: number; promise: Promise<void> }
  | undefined;
async function requirePrivateRepository() {
  const { repository, token } = githubConfig();
  const key = repository + ":" + revisionOf(token);
  if (privacyCheck?.key === key && privacyCheck.expires > Date.now())
    return privacyCheck.promise;
  const promise = (async () => {
    let response: Response;
    try {
      response = await fetch(`https://api.github.com/repos/${repository}`, {
        cache: "no-store",
        signal: AbortSignal.timeout(15000),
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/vnd.github+json",
          "X-GitHub-Api-Version": "2026-03-10",
        },
      });
    } catch {
      throw new CatalogueError(
        "Unable to verify private catalogue storage. Please retry shortly.",
        503,
      );
    }
    if (!response.ok)
      throw new CatalogueError(
        "The catalogue token cannot access the private storage repository. Check its repository selection and permissions.",
        503,
        "setup_required",
      );
    const metadata = await response.json();
    if (metadata.private !== true)
      throw new CatalogueError(
        "Catalogue storage must use a private repository. Refusing to store drafts or internal prices in a public repository.",
        503,
        "setup_required",
      );
  })();
  privacyCheck = { key, expires: Date.now() + 15000, promise };
  await promise;
  if (privacyCheck?.promise === promise)
    privacyCheck.expires = Date.now() + 5 * 60 * 1000;
}
async function githubFile(file: string, raw = false, update?: object) {
  const { repository, token, branch } = githubConfig();
  await requirePrivateRepository();
  const url = `https://api.github.com/repos/${repository}/contents/${file.split("/").map(encodeURIComponent).join("/")}${update ? "" : `?ref=${encodeURIComponent(branch)}`}`;
  try {
    return await fetch(url, {
      method: update ? "PUT" : "GET",
      cache: "no-store",
      signal: AbortSignal.timeout(15000),
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: raw
          ? "application/vnd.github.raw+json"
          : "application/vnd.github+json",
        "X-GitHub-Api-Version": "2026-03-10",
        ...(update ? { "Content-Type": "application/json" } : {}),
      },
      ...(update ? { body: JSON.stringify({ ...update, branch }) } : {}),
    });
  } catch {
    throw new CatalogueError(
      "GitHub storage is temporarily unavailable. Your changes have not been confirmed; reload before retrying.",
      503,
    );
  }
}
function parseDocument(text: string): CatalogueDocument {
  try {
    const doc = JSON.parse(text);
    if (
      doc.version !== 1 ||
      (doc.publishedAt !== null && typeof doc.publishedAt !== "string")
    )
      throw new Error();
    return {
      version: 1,
      products: validateProducts(doc.products),
      publishedProducts: validateProducts(doc.publishedProducts),
      publishedAt: doc.publishedAt,
    };
  } catch {
    throw new CatalogueError(
      "The saved catalogue is invalid. Restore a valid copy before editing.",
      503,
    );
  }
}
type Snapshot = {
  document: CatalogueDocument;
  revision: string;
  storage: ReturnType<typeof storageMode>;
};
let remoteCache:
  | { key: string; expires: number; promise: Promise<Snapshot> }
  | undefined;
function remoteKey() {
  const config = githubConfig();
  return (
    config.repository + ":" + config.branch + ":" + revisionOf(config.token)
  );
}
export async function readCatalogue(fresh = false): Promise<Snapshot> {
  const storage = storageMode();
  if (storage === "readonly")
    return { document: initial, revision: revisionOf(seedText()), storage };
  if (storage === "github") {
    const key = remoteKey();
    if (!fresh && remoteCache?.key === key && remoteCache.expires > Date.now())
      return remoteCache.promise;
    const promise = (async (): Promise<Snapshot> => {
      const response = await githubFile("data/catalogue.json");
      if (response.status === 404)
        throw new CatalogueError(
          "Catalogue file or repository was not found. Push the admin files and check the repository, branch and token access.",
          503,
          "setup_required",
        );
      if (!response.ok)
        throw new CatalogueError(
          "Unable to read the GitHub catalogue. Check repository access and rate limits.",
          503,
        );
      const body = await response.json();
      if (!body.content || typeof body.sha !== "string")
        throw new CatalogueError(
          "GitHub returned an invalid catalogue file.",
          503,
        );
      return {
        document: parseDocument(
          Buffer.from(body.content, "base64").toString("utf8"),
        ),
        revision: body.sha,
        storage: "github",
      };
    })();
    remoteCache = { key, expires: Date.now() + 15000, promise };
    return promise;
  }
  let content: string;
  try {
    content = await readFile(filePath(), "utf8");
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code !== "ENOENT") throw error;
    content = seedText();
  }
  return {
    document: parseDocument(content),
    revision: revisionOf(content),
    storage,
  };
}
export function adminView(snapshot: Awaited<ReturnType<typeof readCatalogue>>) {
  return {
    products: snapshot.document.products,
    revision: snapshot.revision,
    storage: snapshot.storage,
    publishedAt: snapshot.document.publishedAt,
    hasUnpublishedChanges:
      JSON.stringify(snapshot.document.products) !==
      JSON.stringify(snapshot.document.publishedProducts),
  };
}
export async function readPublicCatalogue(): Promise<PublicProduct[]> {
  const { document } = await readCatalogue();
  return document.publishedProducts
    .filter((p) => p.published)
    .map((p) => ({
      id: p.id,
      name: p.name,
      mainImage: p.mainImage,
      category: p.category,
      description: p.description,
      featured: p.featured,
    }));
}
async function mutate(
  expected: string,
  change: (doc: CatalogueDocument) => CatalogueDocument,
) {
  if (typeof expected !== "string" || !expected || expected.length > 100)
    throw new CatalogueError("A catalogue revision is required.");
  const mode = storageMode();
  if (mode === "readonly")
    throw new CatalogueError(
      "Hosted editing needs durable storage. Configure free GitHub storage using ADMIN_SETUP.md.",
      503,
    );
  // Local storage is for one Node process (development or a single-worker host).
  // A process-wide guard survives HMR and cannot leave a stale file after a crash.
  const processState = globalThis as typeof globalThis & {
    paniarCatalogueWrites?: Set<string>;
  };
  const writes = (processState.paniarCatalogueWrites ||= new Set<string>());
  const key = root();
  if (mode === "local") {
    if (writes.has(key))
      throw new CatalogueError(
        "Another save is in progress. Please reload and try again.",
        409,
      );
    writes.add(key);
  }
  try {
    const snapshot = await readCatalogue(true);
    if (snapshot.revision !== expected)
      throw new CatalogueError(
        "The catalogue changed in another tab. Reload before saving so those changes are preserved.",
        409,
      );
    const document = change(snapshot.document);
    const content = JSON.stringify(document, null, 2) + "\n";
    if (Buffer.byteLength(content) > 900 * 1024)
      throw new CatalogueError(
        "The catalogue is too large. Shorten descriptions or remove unused products before saving.",
      );
    if (mode === "github") {
      const response = await githubFile("data/catalogue.json", false, {
        message: "Update Paniar catalogue",
        content: Buffer.from(content).toString("base64"),
        sha: snapshot.revision,
      });
      if (response.status === 409 || response.status === 422)
        throw new CatalogueError(
          "The catalogue changed on GitHub. Reload before saving.",
          409,
        );
      if (!response.ok)
        throw new CatalogueError(
          "GitHub could not save the catalogue. Check token write permission and branch protection.",
          503,
        );
      const result = await response.json();
      const updated: Snapshot = {
        document,
        revision: result.content.sha,
        storage: "github",
      };
      remoteCache = {
        key: remoteKey(),
        expires: Date.now() + 15000,
        promise: Promise.resolve(updated),
      };
      return adminView(updated);
    }
    await mkdir(root(), { recursive: true });
    const temporary = path.join(root(), `catalogue-${randomUUID()}.tmp`);
    try {
      await writeFile(temporary, content, { encoding: "utf8", mode: 0o600 });
      await rename(temporary, filePath());
    } finally {
      await unlink(temporary).catch(() => undefined);
    }
    return adminView({
      document,
      revision: revisionOf(content),
      storage: "local",
    });
  } finally {
    if (mode === "local") writes.delete(key);
  }
}
export async function saveDraft(products: unknown, revision: string) {
  const validated = validateProducts(products);
  return mutate(revision, (doc) => ({ ...doc, products: validated }));
}
export async function publishCatalogue(revision: string) {
  return mutate(revision, (doc) => ({
    ...doc,
    publishedProducts: doc.products.map((p) => ({ ...p })),
    publishedAt: new Date().toISOString(),
  }));
}
export async function saveImage(bytes: Buffer): Promise<string> {
  const ext = imageExtension(bytes);
  const name = `${randomUUID()}.${ext}`;
  const mode = storageMode();
  if (mode === "readonly")
    throw new CatalogueError(
      "Configure durable catalogue storage before uploading.",
      503,
    );
  if (mode === "github") {
    const response = await githubFile(`data/catalogue-images/${name}`, false, {
      message: "Add catalogue image",
      content: bytes.toString("base64"),
    });
    if (!response.ok)
      throw new CatalogueError("The image could not be saved to GitHub.", 503);
  } else {
    await mkdir(path.join(root(), "images"), { recursive: true });
    await writeFile(path.join(root(), "images", name), bytes, {
      flag: "wx",
      mode: 0o600,
    });
  }
  return `/api/catalogue/images/${name}`;
}
const imageCache = new Map<string, { bytes: Buffer; expires: number }>();
const imageMisses = new Map<string, number>();
const imageReads = new Map<string, Promise<Buffer>>();
let imageBudget = { requests: 0, resetAt: 0 };
function rememberImage(key: string, bytes: Buffer) {
  while (
    imageCache.size &&
    [...imageCache.values()].reduce((n, v) => n + v.bytes.length, 0) +
      bytes.length >
      8 * 1024 * 1024
  )
    imageCache.delete(imageCache.keys().next().value!);
  imageCache.set(key, { bytes, expires: Date.now() + 5 * 60 * 1000 });
}
export async function readImage(
  name: string,
  allowDraft = false,
): Promise<Buffer> {
  if (!/^[a-f0-9-]{36}\.(png|jpg|webp)$/.test(name))
    throw new CatalogueError("Image not found.", 404);
  if (!allowDraft) {
    const publicProducts = await readPublicCatalogue();
    if (
      !publicProducts.some(
        (p) => p.mainImage === "/api/catalogue/images/" + name,
      )
    )
      throw new CatalogueError("Image not found.", 404);
  }
  if (storageMode() === "github") {
    const key = remoteKey() + ":" + name;
    if ((imageMisses.get(key) || 0) > Date.now())
      throw new CatalogueError("Image not found.", 404);
    const cached = imageCache.get(key);
    if (cached && cached.expires > Date.now()) return cached.bytes;
    const pending = imageReads.get(key);
    if (pending) return pending;
    if (imageBudget.resetAt <= Date.now())
      imageBudget = { requests: 0, resetAt: Date.now() + 60000 };
    if (imageBudget.requests >= 60)
      throw new CatalogueError(
        "Images are temporarily busy. Please retry shortly.",
        429,
      );
    imageBudget.requests++;
    const task = (async () => {
      const response = await githubFile("data/catalogue-images/" + name, true);
      if (!response.ok) {
        if (imageMisses.size >= 100)
          imageMisses.delete(imageMisses.keys().next().value!);
        imageMisses.set(key, Date.now() + 15000);
        throw new CatalogueError("Image not found.", 404);
      }
      const bytes = Buffer.from(await response.arrayBuffer());
      if (bytes.length > 4 * 1024 * 1024)
        throw new CatalogueError("Image exceeds the supported size.", 413);
      rememberImage(key, bytes);
      return bytes;
    })();
    imageReads.set(key, task);
    try {
      return await task;
    } finally {
      imageReads.delete(key);
    }
  }
  try {
    return await readFile(path.join(root(), "images", name));
  } catch {
    throw new CatalogueError("Image not found.", 404);
  }
}
