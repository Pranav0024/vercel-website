import assert from "node:assert/strict";
import { readFile, unlink } from "node:fs/promises";
import { randomUUID } from "node:crypto";
import path from "node:path";
import { createRequire } from "node:module";

// Local integration test only. It never publishes, never touches GitHub storage,
// and removes only the draft and upload created by this invocation.
const base = "http://127.0.0.1:3000";
const load = createRequire(import.meta.url);
const password = load("@next/env").loadEnvConfig(process.cwd(), true)
  .combinedEnv.ADMIN_PASSWORD;
assert.ok(password, "Run npm run admin:setup before the local HTTP test.");
let cookie = "";
async function request(url, method = "GET", body, origin = base) {
  return fetch(base + url, {
    method,
    headers: {
      ...(method !== "GET" ? { Origin: origin } : {}),
      ...(cookie ? { Cookie: cookie } : {}),
      ...(body instanceof FormData
        ? {}
        : body
          ? { "Content-Type": "application/json" }
          : {}),
    },
    ...(body
      ? { body: body instanceof FormData ? body : JSON.stringify(body) }
      : {}),
  });
}
assert.equal((await request("/api/admin/catalogue")).status, 401);
assert.equal(
  (
    await request(
      "/api/admin/login",
      "POST",
      { password },
      "https://evil.example",
    )
  ).status,
  403,
);
const login = await request("/api/admin/login", "POST", { password });
assert.equal(login.status, 200);
const setCookie = login.headers.get("set-cookie");
assert.ok(setCookie?.includes("HttpOnly"));
assert.ok(setCookie?.includes("SameSite=strict"));
cookie = setCookie.split(";")[0];
const snapshot = await (await request("/api/admin/catalogue")).json();
assert.equal(
  snapshot.storage,
  "local",
  "Refusing to mutate hosted or GitHub-backed data.",
);
const publicBefore = await (await request("/api/catalogue")).text();
const id = "qa-http-" + randomUUID();
let uploadedName;
try {
  const form = new FormData();
  const bytes = await readFile(
    new URL("../public/images/materials-interior.jpg", import.meta.url),
  );
  form.set("image", new Blob([bytes], { type: "image/jpeg" }), "qa-image.jpg");
  const upload = await request("/api/admin/images", "POST", form);
  assert.equal(upload.status, 200);
  const { url } = await upload.json();
  uploadedName = url.split("/").at(-1);
  assert.match(uploadedName, /^[a-f0-9-]{36}\.jpg$/);
  assert.equal(
    (await request(url)).status,
    404,
    "Draft upload must not be public.",
  );
  const preview = await request(url.replace("/api/catalogue/", "/api/admin/"));
  assert.equal(preview.status, 200);
  assert.equal(preview.headers.get("cache-control"), "private, no-store");
  assert.deepEqual(Buffer.from(await preview.arrayBuffer()), bytes);
  const added = {
    ...snapshot.products[0],
    id,
    name: "Temporary HTTP test product",
    mainImage: url,
    published: false,
    featured: false,
  };
  const saved = await request("/api/admin/catalogue", "PUT", {
    products: [...snapshot.products, added],
    revision: snapshot.revision,
  });
  assert.equal(saved.status, 200);
  let latest = await saved.json();
  assert.equal(latest.hasUnpublishedChanges, true);
  assert.equal(await (await request("/api/catalogue")).text(), publicBefore);
  assert.equal(
    (
      await request("/api/admin/catalogue", "PUT", {
        products: snapshot.products,
        revision: snapshot.revision,
      })
    ).status,
    409,
  );
  const edited = await request("/api/admin/catalogue", "PUT", {
    products: latest.products.map((p) =>
      p.id === id ? { ...p, name: "Updated HTTP test product" } : p,
    ),
    revision: latest.revision,
  });
  assert.equal(edited.status, 200);
  latest = await edited.json();
  assert.equal(
    latest.products.find((p) => p.id === id).name,
    "Updated HTTP test product",
  );
} finally {
  const latestResponse = await request("/api/admin/catalogue");
  if (latestResponse.ok) {
    const latest = await latestResponse.json();
    if (latest.products.some((p) => p.id === id))
      assert.equal(
        (
          await request("/api/admin/catalogue", "PUT", {
            products: latest.products.filter((p) => p.id !== id),
            revision: latest.revision,
          })
        ).status,
        200,
      );
  }
  if (uploadedName && /^[a-f0-9-]{36}\.jpg$/.test(uploadedName))
    await unlink(path.join(process.cwd(), ".data", "images", uploadedName));
}
assert.equal(await (await request("/api/catalogue")).text(), publicBefore);
assert.equal((await request("/api/admin/logout", "POST")).status, 200);
console.log(
  "HTTP checks passed: authentication, CSRF, private upload, draft add/edit/delete, stale revision rejection, and unchanged public catalogue. Test data removed.",
);
