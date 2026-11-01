import assert from "node:assert/strict";
import { createRequire } from "node:module";
import { mkdtemp, mkdir, readFile, writeFile, rm } from "node:fs/promises";
import path from "node:path";
import os from "node:os";
import { test, after } from "node:test";

const load = createRequire(import.meta.url);
const ts = load("typescript");
const directory = await mkdtemp(path.join(os.tmpdir(), "paniar-admin-tests-"));
await mkdir(path.join(directory, "lib"));
await mkdir(path.join(directory, "data"));
await writeFile(
  path.join(directory, "data/catalogue.json"),
  await readFile(new URL("../data/catalogue.json", import.meta.url)),
);
for (const name of [
  "catalogue-types",
  "catalogue-validation",
  "catalogue-store",
  "admin-auth",
]) {
  const source = await readFile(
    new URL(`../lib/${name}.ts`, import.meta.url),
    "utf8",
  );
  const output = ts.transpileModule(source, {
    compilerOptions: {
      module: ts.ModuleKind.CommonJS,
      target: ts.ScriptTarget.ES2022,
      esModuleInterop: true,
    },
  }).outputText;
  await writeFile(path.join(directory, `lib/${name}.js`), output);
}
const store = load(path.join(directory, "lib/catalogue-store.js"));
const auth = load(path.join(directory, "lib/admin-auth.js"));
const validation = load(path.join(directory, "lib/catalogue-validation.js"));
process.env.CATALOGUE_LOCAL_DIR = path.join(directory, "storage");
process.env.CATALOGUE_STORAGE = "local";
process.env.ADMIN_PASSWORD = "test-only-password-not-a-real-credential";
process.env.ADMIN_SESSION_SECRET =
  "test-only-signing-secret-at-least-thirty-two-characters";

after(async () => {
  const resolved = path.resolve(directory);
  assert.ok(resolved.startsWith(path.resolve(os.tmpdir()) + path.sep));
  assert.ok(path.basename(resolved).startsWith("paniar-admin-tests-"));
  await rm(resolved, { recursive: true, force: true });
});

test("sessions reject wrong passwords, tampering, expiry and rotated credentials", () => {
  assert.equal(auth.checkPassword("wrong"), false);
  assert.equal(auth.checkPassword(process.env.ADMIN_PASSWORD), true);
  const now = Date.now();
  const session = auth.createSession(now);
  assert.equal(auth.validSession(session, now), true);
  assert.equal(auth.validSession(session + "0", now), false);
  assert.equal(
    auth.validSession(
      session.replace(/.$/, session.endsWith("a") ? "b" : "a"),
      now,
    ),
    false,
  );
  assert.equal(
    auth.validSession(session, now + 8 * 60 * 60 * 1000 + 1000),
    false,
  );
  const original = process.env.ADMIN_PASSWORD;
  process.env.ADMIN_PASSWORD = "a-different-strong-test-password";
  assert.equal(auth.validSession(session, now), false);
  process.env.ADMIN_PASSWORD = original;
});
test("same-origin guard and admin authentication fail closed", () => {
  const headers = new Headers({ origin: "https://evil.example" });
  assert.throws(
    () =>
      auth.requireSameOrigin({
        headers,
        nextUrl: { origin: "http://localhost:3000" },
      }),
    { status: 403 },
  );
  headers.set("origin", "http://localhost:3000");
  assert.doesNotThrow(() =>
    auth.requireSameOrigin({
      headers,
      nextUrl: { origin: "http://localhost:3000" },
    }),
  );
  assert.throws(
    () => auth.requireAdmin({ cookies: { get: () => undefined } }),
    { status: 401 },
  );
  const original = process.env.ADMIN_SESSION_SECRET;
  delete process.env.ADMIN_SESSION_SECRET;
  assert.throws(() => auth.createSession(), { status: 503 });
  process.env.ADMIN_SESSION_SECRET = original;
});

test("attempt limits are enforced per requester, not as a shared account lockout", () => {
  for (let index = 0; index < 8; index++)
    assert.throws(() => auth.attemptLogin("wrong", "attacker"), {
      status: 401,
    });
  assert.throws(() => auth.attemptLogin("wrong", "attacker"), { status: 429 });
  assert.throws(() => auth.attemptLogin("wrong", "other"), { status: 401 });
  assert.throws(
    () => auth.attemptLogin(process.env.ADMIN_PASSWORD, "attacker"),
    { status: 429 },
  );
  assert.doesNotThrow(() =>
    auth.attemptLogin(process.env.ADMIN_PASSWORD, "legitimate"),
  );
  assert.doesNotThrow(() =>
    auth.attemptLogin(
      process.env.ADMIN_PASSWORD,
      "attacker",
      Date.now() + 61000,
    ),
  );
  const headers = new Headers({
    host: "127.0.0.1:3000",
    origin: "http://127.0.0.1:3000",
  });
  assert.doesNotThrow(() =>
    auth.requireSameOrigin({
      headers,
      nextUrl: { origin: "http://localhost:3000", protocol: "http:" },
    }),
  );
});
test("product validation rejects duplicate references, scripts and unsafe paths", async () => {
  const { document } = await store.readCatalogue();
  const first = document.products[0];
  for (const mainImage of [
    "https://example.com/image.jpg",
    "//evil.example/x.jpg",
    "/../secret.jpg",
    "/%2e%2e/secret.png",
    "/api/admin/secret.png",
    "/image.svg",
    "/image.jpg?url=evil",
  ]) {
    assert.throws(
      () => validation.validateProducts([{ ...first, mainImage }]),
      { status: 400 },
    );
  }
  assert.throws(() => validation.validateProducts([first, first]), {
    status: 400,
  });
  assert.throws(
    () => validation.validateProducts([{ ...first, published: "yes" }]),
    { status: 400 },
  );
  assert.throws(
    () => validation.validateProducts([{ ...first, category: "Invented" }]),
    { status: 400 },
  );
});
test("draft edits persist but remain private until publish; deletions follow the same rule", async () => {
  let snapshot = await store.readCatalogue();
  const count = (await store.readPublicCatalogue()).length;
  const added = {
    ...snapshot.document.products[0],
    id: "isolated-qa-product",
    name: "Isolated QA material",
    price: "private-123",
    featured: false,
  };
  let view = await store.saveDraft(
    [...snapshot.document.products, added],
    snapshot.revision,
  );
  assert.equal(view.hasUnpublishedChanges, true);
  assert.equal((await store.readPublicCatalogue()).length, count);
  snapshot = await store.readCatalogue();
  assert.equal(snapshot.document.products.at(-1).name, added.name);
  view = await store.publishCatalogue(snapshot.revision);
  assert.equal(view.hasUnpublishedChanges, false);
  const published = await store.readPublicCatalogue();
  assert.equal(published.length, count + 1);
  assert.equal(Object.hasOwn(published.at(-1), "price"), false);
  view = await store.saveDraft(
    view.products.filter((p) => p.id !== added.id),
    view.revision,
  );
  assert.equal((await store.readPublicCatalogue()).length, count + 1);
  await store.publishCatalogue(view.revision);
  assert.equal((await store.readPublicCatalogue()).length, count);
});
test("stale and simultaneous saves cannot overwrite someone else's changes", async () => {
  const snapshot = await store.readCatalogue();
  const results = await Promise.allSettled([
    store.saveDraft(snapshot.document.products, snapshot.revision),
    store.saveDraft(snapshot.document.products, snapshot.revision),
  ]);
  assert.equal(results.filter((r) => r.status === "fulfilled").length, 1);
  assert.equal(results.find((r) => r.status === "rejected").reason.status, 409);
  assert.equal(
    (await store.readCatalogue()).document.products.length,
    snapshot.document.products.length,
  );
});
test("uploads are bounded, reject SVGs, and cannot traverse filesystem paths", async () => {
  assert.throws(
    () => validation.imageExtension(Buffer.alloc(4 * 1024 * 1024 + 1)),
    { status: 400 },
  );
  assert.throws(
    () =>
      validation.imageExtension(
        Buffer.from("<svg><script>alert(1)</script></svg>"),
      ),
    { status: 400 },
  );
  const image = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10, 0, 0, 0, 0]);
  const url = await store.saveImage(image);
  assert.deepEqual(await store.readImage(url.split("/").at(-1), true), image);
  await assert.rejects(store.readImage(url.split("/").at(-1)), { status: 404 });
  const snapshot = await store.readCatalogue();
  const added = {
    ...snapshot.document.products[0],
    id: "isolated-image-test",
    mainImage: url,
  };
  let view = await store.saveDraft(
    [...snapshot.document.products, added],
    snapshot.revision,
  );
  await assert.rejects(store.readImage(url.split("/").at(-1)), { status: 404 });
  view = await store.publishCatalogue(view.revision);
  assert.deepEqual(await store.readImage(url.split("/").at(-1)), image);
  view = await store.saveDraft(
    view.products.filter((p) => p.id !== added.id),
    view.revision,
  );
  await store.publishCatalogue(view.revision);
  await assert.rejects(store.readImage(url.split("/").at(-1)), { status: 404 });
  await assert.rejects(store.readImage("../catalogue.json"), { status: 404 });
});
test("unconfigured production storage never writes ephemeral files", async () => {
  const environment = process.env.NODE_ENV;
  process.env.NODE_ENV = "production";
  delete process.env.CATALOGUE_STORAGE;
  const snapshot = await store.readCatalogue();
  assert.equal(snapshot.storage, "readonly");
  await assert.rejects(
    store.saveDraft(snapshot.document.products, snapshot.revision),
    { status: 503 },
  );
  process.env.CATALOGUE_STORAGE = "local";
  if (environment === undefined) delete process.env.NODE_ENV;
  else process.env.NODE_ENV = environment;
});
test("GitHub adapter uses authenticated revisions, preserves draft/publish split and detects conflicts", async () => {
  const originalFetch = globalThis.fetch;
  process.env.CATALOGUE_STORAGE = "github";
  process.env.CATALOGUE_GITHUB_TOKEN = "test-token-only";
  let document = JSON.parse(
    await readFile(new URL("../data/catalogue.json", import.meta.url), "utf8"),
  );
  let sha = "abc123";
  let conflict = false;
  let requests = 0;
  let imageFetches = 0;
  globalThis.fetch = async (url, options) => {
    requests++;
    if (
      String(url) === "https://api.github.com/repos/Pranav0024/paniar-catalogue"
    )
      return Response.json({ private: true });
    assert.ok(
      String(url).startsWith(
        "https://api.github.com/repos/Pranav0024/paniar-catalogue/contents/",
      ),
    );
    assert.equal(options.headers.Authorization, "Bearer test-token-only");
    if (String(url).includes("/catalogue-images/")) {
      imageFetches++;
      await new Promise((resolve) => setTimeout(resolve, 5));
      return new Response(
        new Uint8Array([137, 80, 78, 71, 13, 10, 26, 10, 0, 0, 0, 0]),
      );
    }
    if (options.method === "GET")
      return Response.json({
        sha,
        content: Buffer.from(JSON.stringify(document)).toString("base64"),
      });
    if (conflict)
      return Response.json({ message: "conflict" }, { status: 409 });
    const body = JSON.parse(options.body);
    assert.equal(body.sha, sha);
    document = JSON.parse(Buffer.from(body.content, "base64").toString("utf8"));
    sha += "1";
    return Response.json({ content: { sha } });
  };
  try {
    const snapshot = await store.readCatalogue();
    const requestsBeforeInvalidImages = requests;
    for (let index = 0; index < 20; index++)
      await assert.rejects(
        store.readImage(
          "00000000-0000-0000-0000-" + String(index).padStart(12, "0") + ".png",
        ),
        { status: 404 },
      );
    assert.equal(
      requests,
      requestsBeforeInvalidImages,
      "Unknown images must not trigger requests to GitHub.",
    );
    const edited = snapshot.document.products.map((p, i) =>
      i ? p : { ...p, name: "Draft only" },
    );
    const view = await store.saveDraft(edited, snapshot.revision);
    assert.equal(view.storage, "github");
    assert.notEqual((await store.readPublicCatalogue())[0].name, "Draft only");
    await store.publishCatalogue(view.revision);
    assert.equal((await store.readPublicCatalogue())[0].name, "Draft only");
    conflict = true;
    const latest = await store.readCatalogue();
    await assert.rejects(
      store.saveDraft(latest.document.products, latest.revision),
      { status: 409 },
    );
    const names = Array.from(
      { length: 61 },
      (_, index) =>
        "20000000-0000-0000-0000-" + String(index).padStart(12, "0") + ".png",
    );
    document.publishedProducts = names.map((name, index) => ({
      ...document.products[0],
      id: "image-ref-" + index,
      published: true,
      mainImage: "/api/catalogue/images/" + name,
    }));
    await store.readCatalogue(true);
    await Promise.all(
      Array.from({ length: 20 }, () => store.readImage(names[0])),
    );
    assert.equal(
      imageFetches,
      1,
      "Concurrent reads of one image must share one upstream request.",
    );
    for (let index = 1; index < 60; index++)
      await store.readImage(names[index]);
    await assert.rejects(store.readImage(names[60]), { status: 429 });
    assert.equal(
      imageFetches,
      60,
      "Image cache misses must respect the upstream request budget.",
    );
  } finally {
    globalThis.fetch = originalFetch;
    process.env.CATALOGUE_STORAGE = "local";
    delete process.env.CATALOGUE_GITHUB_TOKEN;
  }
});

test("GitHub storage refuses public repositories before reading or writing catalogue files", async () => {
  const originalFetch = globalThis.fetch;
  process.env.CATALOGUE_STORAGE = "github";
  process.env.CATALOGUE_GITHUB_TOKEN = "test-public-repository-token";
  globalThis.fetch = async (url) => {
    assert.equal(
      String(url),
      "https://api.github.com/repos/Pranav0024/paniar-catalogue",
    );
    return Response.json({ private: false });
  };
  try {
    await assert.rejects(store.readCatalogue(true), { status: 503 });
  } finally {
    globalThis.fetch = originalFetch;
    process.env.CATALOGUE_STORAGE = "local";
    delete process.env.CATALOGUE_GITHUB_TOKEN;
  }
});
