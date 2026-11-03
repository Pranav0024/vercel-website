"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import VariationEditor from "./VariationEditor";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowUpRight,
  Check,
  ImagePlus,
  LockKeyhole,
  LogOut,
  Package,
  Plus,
  RefreshCw,
  Search,
  Send,
  X,
} from "lucide-react";
import { CATEGORIES, orderProducts, type CatalogueProduct } from "@/lib/catalogue-types";

type Catalogue = {
  products: CatalogueProduct[];
  revision: string;
  storage: "local" | "github";
  hasUnpublishedChanges: boolean;
  publishedAt: string | null;
};
class ApiError extends Error {
  constructor(
    public status: number,
    message: string,
  ) {
    super(message);
  }
}
const emptyProduct = (): CatalogueProduct => ({
  id: crypto.randomUUID(),
  name: "",
  price: "",
  mainImage: "",
  category: CATEGORIES[0],
  description: "",
  published: true,
  featured: false,
});

function previewSource(value: string): string | null {
  if (
    !value.startsWith("/") ||
    value.startsWith("//") ||
    /[\\?#]/.test(value) ||
    value.split("/").includes("..")
  )
    return null;
  return value.replace("/api/catalogue/images/", "/api/admin/images/");
}

export default function AdminPanel() {
  const [catalogue, setCatalogue] = useState<Catalogue | null>(null);
  const [authenticated, setAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState<string | null>("Loading catalogue");
  const [error, setError] = useState("");
  const [setup, setSetup] = useState(false);
  const [notice, setNotice] = useState("");
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [status, setStatus] = useState("all");
  const [draft, setDraft] = useState<CatalogueProduct | null>(null);
  const [isNew, setIsNew] = useState(false);
  const editorRef = useRef<HTMLHeadingElement>(null);
  const addRef = useRef<HTMLButtonElement>(null);
  const working = useRef(false);

  async function api(path: string, init?: RequestInit) {
    const response = await fetch(path, {
      ...init,
      credentials: "same-origin",
      cache: "no-store",
    });
    if (response.status === 401) {
      setAuthenticated(false);
      setCatalogue(null);
      setDraft(null);
      setPassword("");
      setNotice("");
      throw new ApiError(
        401,
        "Please sign in to continue. Your session may have expired.",
      );
    }
    const data = await response.json().catch(() => null);
    if (response.status === 503) {
      if (data?.code === "setup_required") setSetup(true);
      throw new ApiError(503, data?.error || "Admin setup is incomplete.");
    }
    if (!response.ok)
      throw new ApiError(
        response.status,
        data?.error || `Request failed (${response.status}). Please try again.`,
      );
    return data;
  }

  function accept(data: Catalogue) {
    if (
      !data ||
      !Array.isArray(data.products) ||
      typeof data.revision !== "string" ||
      !["local", "github"].includes(data.storage) ||
      typeof data.hasUnpublishedChanges !== "boolean" ||
      !(data.publishedAt === null || typeof data.publishedAt === "string")
    ) {
      throw new Error(
        "The server returned an invalid catalogue. Reload before continuing.",
      );
    }
    setCatalogue(data);
    setAuthenticated(true);
    setSetup(false);
  }

  async function reload() {
    accept(await api("/api/admin/catalogue"));
  }

  async function run(label: string, action: () => Promise<void>) {
    if (working.current) return;
    working.current = true;
    setBusy(label);
    setError("");
    setNotice("");
    try {
      await action();
    } catch (failure) {
      if (failure instanceof ApiError && failure.status === 409) {
        setDraft(null);
        setCatalogue(null);
        try {
          await reload();
          setError(
            "Another session changed the catalogue. The latest version has been reloaded. Review it and make your changes again.",
          );
        } catch (reloadError) {
          setError(
            reloadError instanceof Error
              ? reloadError.message
              : "Could not reload the latest catalogue.",
          );
        }
      } else
        setError(
          failure instanceof Error
            ? failure.message
            : "Something went wrong. Please try again.",
        );
    } finally {
      working.current = false;
      setBusy(null);
    }
  }

  useEffect(() => {
    let active = true;
    working.current = true;
    (async () => {
      try {
        const data = await api("/api/admin/catalogue");
        if (active) accept(data);
      } catch (failure) {
        if (
          active &&
          !(failure instanceof ApiError && failure.status === 401)
        ) {
          setError(
            failure instanceof Error
              ? failure.message
              : "Could not load the catalogue.",
          );
        }
      } finally {
        if (active) {
          setBusy(null);
          working.current = false;
        }
      }
    })();
    return () => {
      active = false;
    };
  }, []);

  const draftId = draft?.id;
  useEffect(() => {
    if (draftId) editorRef.current?.focus();
  }, [draftId]);

  async function login(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    await run("Signing in", async () => {
      await api("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      setPassword("");
      await reload();
    });
  }

  async function saveProducts(products: CatalogueProduct[]) {
    if (!catalogue) throw new Error("Reload the catalogue before saving.");
    const data = await api("/api/admin/catalogue", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ products, revision: catalogue.revision }),
    });
    accept(data);
  }

  function closeEditor() {
    setDraft(null);
    requestAnimationFrame(() => addRef.current?.focus());
  }

  async function save(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!draft || !catalogue) return;
    const product = {
      ...draft,
      name: draft.name.trim(),
      price: draft.price.trim(),
      mainImage: draft.mainImage.trim(),
      description: draft.description.trim(),
    };
    if (!product.name || !product.mainImage) {
      setError("Enter a product name and an image path, or upload an image.");
      return;
    }
    await run("Saving draft", async () => {
      await saveProducts(
        isNew
          ? [...catalogue.products, product]
          : catalogue.products.map((item) =>
              item.id === product.id ? product : item,
            ),
      );
      closeEditor();
      setNotice(
        "Draft saved. Publish the catalogue when you are ready to make changes public.",
      );
    });
  }

  async function upload(file: File | undefined, variationId?: string) {
    if (!file || !draft) return;
    if (
      !["image/jpeg", "image/png", "image/webp"].includes(file.type) ||
      file.size > 4 * 1024 * 1024
    ) {
      setError("Choose a JPG, PNG or WebP image no larger than 4 MB.");
      return;
    }
    await run("Uploading image", async () => {
      const body = new FormData();
      body.append("image", file);
      const data = await api("/api/admin/images", { method: "POST", body });
      if (!data || typeof data.url !== "string" || !data.url)
        throw new Error(
          "The upload did not return an image URL. Please try again.",
        );
      setDraft((current) =>
        current ? variationId ? { ...current, variations: (current.variations ?? []).map(v => v.id === variationId ? { ...v, mainImage: data.url } : v) } : { ...current, mainImage: data.url } : current,
      );
      setNotice("Image uploaded. Save the draft to attach it to this product.");
    });
  }

  const products = catalogue?.products ?? [];
  const visible = orderProducts(products).filter(
    (product) =>
      `${product.name} ${product.description}`
        .toLowerCase()
        .includes(search.toLowerCase()) &&
      (category === "all" || product.category === category) &&
      (status === "all" ||
        (status === "visible" && product.published) ||
        (status === "hidden" && !product.published) ||
        (status === "featured" && product.featured)),
  );
  const publishedDate = catalogue?.publishedAt
    ? new Date(catalogue.publishedAt)
    : null;
  const lastPublished =
    publishedDate && !Number.isNaN(publishedDate.getTime())
      ? publishedDate.toLocaleString()
      : "Never published";

  return (
    <main id="main-content" className="admin-shell" aria-busy={!!busy}>
      <header className="admin-heading">
        <div>
          <span className="admin-eyebrow">Paniar / Workspace</span>
          <h1>
            Catalogue studio<span>.</span>
          </h1>
          <p>A thoughtful home for everything you offer.</p>
        </div>
        <div className="admin-actions">
          <Link
            className="admin-button admin-secondary"
            href="/shop"
            target="_blank"
            rel="noopener noreferrer"
          >
            View public catalogue <ArrowUpRight size={16} />
          </Link>
          {authenticated && (
            <button
              className="admin-button admin-secondary"
              disabled={!!busy}
              onClick={() =>
                void run("Signing out", async () => {
                  await api("/api/admin/logout", { method: "POST" });
                  setCatalogue(null);
                  setDraft(null);
                  setAuthenticated(false);
                  setPassword("");
                  setNotice("Signed out.");
                })
              }
            >
              <LogOut size={16} /> Sign out
            </button>
          )}
        </div>
      </header>

      <div className="admin-messages" aria-live="polite" aria-atomic="true">
        {busy && (
          <p className="admin-message">
            <RefreshCw size={16} className="admin-spin" />
            {busy}…
          </p>
        )}
        {notice && (
          <p className="admin-message admin-success">
            <Check size={17} />
            {notice}
          </p>
        )}
      </div>
      {error && (
        <p className="admin-message admin-error" role="alert">
          {error}
        </p>
      )}
      {setup && (
        <section className="glass-panel admin-setup">
          <h2>One-time setup needed</h2>
          <p>
            Run <code>npm run admin:setup</code> in the project folder, then
            restart the app. Admin credentials belong in <code>.env.local</code>
            ; keep that file private.
          </p>
          <button
            className="admin-button admin-primary"
            disabled={!!busy}
            onClick={() => void run("Checking setup", reload)}
          >
            Check again
          </button>
        </section>
      )}

      {!authenticated && !setup && !busy && (
        <section className="glass-panel admin-login">
          <span className="admin-lock">
            <LockKeyhole size={25} />
          </span>
          <span className="admin-eyebrow">Private workspace</span>
          <h2>Welcome back.</h2>
          <p>Sign in to prepare your next catalogue update.</p>
          <form onSubmit={login}>
            <label htmlFor="admin-password">Admin password</label>
            <input
              id="admin-password"
              type="password"
              autoComplete="current-password"
              required
              value={password}
              onChange={(event) => setPassword(event.target.value)}
            />
            <button
              className="admin-button admin-primary"
              type="submit"
              disabled={!!busy}
            >
              Sign in <ArrowUpRight size={17} />
            </button>
          </form>
          <p className="admin-small">
            Use the credentials configured in <code>.env.local</code>.
          </p>
        </section>
      )}

      {authenticated && !catalogue && !setup && !busy && (
        <button
          className="admin-button admin-primary"
          onClick={() => void run("Reloading catalogue", reload)}
        >
          Reload catalogue
        </button>
      )}
      {authenticated && catalogue && (
        <>
          <section
            className="glass-panel admin-publish"
            aria-label="Publication status"
          >
            <div>
              <span
                className={`admin-pill ${catalogue.hasUnpublishedChanges ? "admin-pending" : ""}`}
              >
                {catalogue.hasUnpublishedChanges
                  ? "Unpublished changes"
                  : "Catalogue up to date"}
              </span>
              <h2>Prepare here. Publish when ready.</h2>
              <p>
                Saving changes updates your draft. Publishing replaces the
                public catalogue with this draft.
              </p>
              <p className="admin-small">Last published: {lastPublished}</p>
            </div>
            <button
              className="admin-button admin-primary"
              disabled={!!busy || !catalogue.hasUnpublishedChanges || !!draft}
              onClick={() => {
                if (
                  !window.confirm(
                    "Publish this draft catalogue? All saved draft changes will become public, including product visibility and featured settings.",
                  )
                )
                  return;
                void run("Publishing catalogue", async () => {
                  accept(
                    await api("/api/admin/publish", {
                      method: "POST",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify({ revision: catalogue.revision }),
                    }),
                  );
                  setNotice("Catalogue published successfully.");
                });
              }}
            >
              <Send size={17} /> Publish catalogue
            </button>
          </section>
          <section
            className="admin-stats"
            aria-label="Draft catalogue statistics"
          >
            {[
              ["Total products", products.length],
              [
                "Visible on next publish",
                products.filter((p) => p.published).length,
              ],
              [
                "Hidden on next publish",
                products.filter((p) => !p.published).length,
              ],
              ["Featured in draft", products.filter((p) => p.featured).length],
            ].map(([label, value]) => (
              <div className="glass-panel admin-stat" key={label}>
                <span>{label}</span>
                <strong>{value}</strong>
              </div>
            ))}
          </section>
          <p className="admin-storage">
            <span className="status-dot" />
            {catalogue.storage === "local"
              ? "Local storage · Free for development. Local files may not persist on production hosting. Use an existing GitHub repository for optional production storage; no paid service is required."
              : "GitHub storage · Using your configured repository. No paid storage service is required."}
          </p>
          <section className="glass-panel admin-workspace">
            <div className="admin-section-heading">
              <div>
                <span className="admin-eyebrow">Your collection</span>
                <h2>
                  Draft products{" "}
                  <span className="admin-count">{products.length}</span>
                </h2>
              </div>
              <div className="admin-actions">
                <button
                  className="admin-button admin-secondary"
                  disabled={!!busy || !!draft}
                  onClick={() => void run("Refreshing catalogue", reload)}
                >
                  <RefreshCw size={15} /> Refresh
                </button>
                <button
                  ref={addRef}
                  className="admin-button admin-primary"
                  disabled={!!busy || !!draft}
                  onClick={() => {
                    setIsNew(true);
                    setDraft(emptyProduct());
                    setError("");
                    setNotice("");
                  }}
                >
                  <Plus size={17} /> Add product
                </button>
              </div>
            </div>
            <div className="admin-filters">
              <label className="admin-search" htmlFor="admin-search">
                <Search size={17} />
                <span className="sr-only">Search products</span>
                <input
                  id="admin-search"
                  type="search"
                  placeholder="Search name or description"
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                />
              </label>
              <label htmlFor="admin-category">
                <span className="sr-only">Filter by category</span>
                <select
                  id="admin-category"
                  value={category}
                  onChange={(event) => setCategory(event.target.value)}
                >
                  <option value="all">All categories</option>
                  {CATEGORIES.map((item) => (
                    <option key={item}>{item}</option>
                  ))}
                </select>
              </label>
              <label htmlFor="admin-status">
                <span className="sr-only">Filter by status</span>
                <select
                  id="admin-status"
                  value={status}
                  onChange={(event) => setStatus(event.target.value)}
                >
                  <option value="all">All statuses</option>
                  <option value="visible">Visible next publish</option>
                  <option value="hidden">Hidden next publish</option>
                  <option value="featured">Featured</option>
                </select>
              </label>
            </div>
            <p className="admin-small admin-results">
              {visible.length} of {products.length} products · Visibility and
              featured settings take effect on the next publish.
            </p>
            <div className="admin-product-list">
              {visible.length === 0 ? (
                <div className="admin-empty">
                  <Package size={32} />
                  <h3>
                    {products.length
                      ? "No matching products"
                      : "Start your collection"}
                  </h3>
                  <p>
                    {products.length
                      ? "Try another search or filter."
                      : "Add your first product, save a draft, then publish when ready."}
                  </p>
                </div>
              ) : (
                visible.map((product) => (
                  <article className="admin-product" key={product.id}>
                    <div className="admin-product-mark" aria-hidden="true">
                      {previewSource(product.mainImage) ? (
                        <Image
                          src={previewSource(product.mainImage)!}
                          alt=""
                          width={64}
                          height={64}
                          unoptimized
                        />
                      ) : (
                        <Package size={23} />
                      )}
                    </div>
                    <div className="admin-product-info">
                      <h3>{product.name}</h3>
                      <p>{product.category}</p>
                      <p>Display order: {product.rank ?? "Not set"}</p>
                      <div className="admin-tags">
                        <span
                          className={`admin-pill ${!product.published ? "admin-hidden" : ""}`}
                        >
                          {product.published
                            ? "Visible next publish"
                            : "Hidden next publish"}
                        </span>
                        {product.featured && (
                          <span className="admin-pill">Featured</span>
                        )}
                      </div>
                    </div>
                    <div className="admin-product-price">
                      {product.price || "Price on enquiry"}
                      <span>Public price</span>
                    </div>
                    <div className="admin-row-actions">
                      <button
                        className="admin-button admin-secondary"
                        disabled={!!busy || !!draft}
                        onClick={() => {
                          setIsNew(false);
                          setDraft({ ...product });
                          setError("");
                          setNotice("");
                        }}
                      >
                        Edit<span className="sr-only"> {product.name}</span>
                      </button>
                      <button
                        className="admin-button admin-delete"
                        disabled={!!busy || !!draft}
                        onClick={() => {
                          if (
                            !window.confirm(
                              `Delete “${product.name}” from the draft? This removes it from the public catalogue only after publishing.`,
                            )
                          )
                            return;
                          void run("Deleting product", async () => {
                            await saveProducts(
                              products.filter((item) => item.id !== product.id),
                            );
                            setNotice(
                              "Product removed from the draft. Publish to update the public catalogue.",
                            );
                          });
                        }}
                      >
                        Delete<span className="sr-only"> {product.name}</span>
                      </button>
                    </div>
                  </article>
                ))
              )}
            </div>
          </section>
          {draft && (
            <section
              className="glass-panel admin-editor"
              aria-labelledby="admin-editor-title"
            >
              <div className="admin-section-heading">
                <div>
                  <span className="admin-eyebrow">
                    {isNew ? "New addition" : "Product details"}
                  </span>
                  <h2 id="admin-editor-title" tabIndex={-1} ref={editorRef}>
                    {isNew ? "Add a product" : "Edit product"}
                  </h2>
                </div>
                <button
                  className="admin-button admin-secondary"
                  disabled={!!busy}
                  onClick={closeEditor}
                  aria-label="Close product editor"
                >
                  <X size={18} />
                </button>
              </div>
              <form onSubmit={save}>
                <fieldset disabled={!!busy} className="admin-form-grid">
                  <legend className="sr-only">Product details</legend>
                  <label htmlFor="product-name">
                    Product name
                    <input
                      id="product-name"
                      required
                      maxLength={200}
                      value={draft.name}
                      onChange={(event) =>
                        setDraft({ ...draft, name: event.target.value })
                      }
                    />
                  </label>
                  <label htmlFor="product-category">
                    Category
                    <select
                      id="product-category"
                      value={draft.category}
                      onChange={(event) =>
                        setDraft({ ...draft, category: event.target.value })
                      }
                    >
                      {CATEGORIES.map((item) => (
                        <option key={item}>{item}</option>
                      ))}
                    </select>
                  </label>
                  <label htmlFor="product-rank">
                    Display order <span className="admin-optional">(optional)</span>
                    <input
                      id="product-rank"
                      type="number"
                      min={1}
                      max={9999}
                      step={1}
                      value={draft.rank ?? ""}
                      onChange={(event) => setDraft({ ...draft, rank: event.target.value === "" ? undefined : Number(event.target.value) })}
                      placeholder="e.g. 10"
                    />
                    <span className="admin-help">
                      Lower numbers appear first: try 10 for mandalas, 100 for cards.
                      Blank items follow numbered items in their existing order.
                      Equal numbers keep their existing order. Featured items use this order on the home page.
                    </span>
                  </label>
                  <label htmlFor="product-price">
                    Public price{" "}
                    <span className="admin-optional">(optional)</span>
                    <input
                      id="product-price"
                      value={draft.price}
                      onChange={(event) =>
                        setDraft({ ...draft, price: event.target.value })
                      }
                      placeholder="e.g. ₹1,200 / unit"
                    />
                    <span className="admin-help">
                      Shown publicly after publishing.
                    </span>
                  </label>
                  <label htmlFor="product-image">
                    Image path
                    <input
                      id="product-image"
                      required
                      value={draft.mainImage}
                      onChange={(event) =>
                        setDraft({ ...draft, mainImage: event.target.value })
                      }
                      placeholder="/images/product.jpg"
                    />
                    <span className="admin-help">
                      Use a path from the public folder or upload below.
                    </span>
                  </label>
                  <label
                    className="admin-upload admin-full"
                    htmlFor="product-upload"
                  >
                    <span>
                      <ImagePlus size={21} /> Upload a product image
                    </span>
                    <span className="admin-help">
                      JPG, PNG or WebP · up to 4 MB. Uploading alone does not
                      save the product.
                    </span>
                    <input
                      id="product-upload"
                      type="file"
                      accept="image/jpeg,image/png,image/webp"
                      onChange={(event) => {
                        const file = event.target.files?.[0];
                        event.target.value = "";
                        void upload(file);
                      }}
                    />
                  </label>
                  <label className="admin-full" htmlFor="product-description">
                    Description
                    <textarea
                      id="product-description"
                      rows={5}
                      value={draft.description}
                      onChange={(event) =>
                        setDraft({ ...draft, description: event.target.value })
                      }
                      placeholder="Materials, finishes, applications and useful details…"
                    />
                  </label>
                  <VariationEditor variations={draft.variations ?? []} onChange={variations => setDraft({ ...draft, variations })} upload={(file, id) => void upload(file, id)} />
                  <div className="admin-toggles admin-full">
                    <label htmlFor="product-visible">
                      <input
                        id="product-visible"
                        type="checkbox"
                        checked={draft.published}
                        onChange={(event) =>
                          setDraft({
                            ...draft,
                            published: event.target.checked,
                          })
                        }
                      />
                      <span>
                        Visible in catalogue
                        <small>Shown publicly after the next publish.</small>
                      </span>
                    </label>
                    <label htmlFor="product-featured">
                      <input
                        id="product-featured"
                        type="checkbox"
                        checked={draft.featured}
                        onChange={(event) =>
                          setDraft({ ...draft, featured: event.target.checked })
                        }
                      />
                      <span>
                        Featured product
                        <small>Featured when visible and published.</small>
                      </span>
                    </label>
                  </div>
                  <div className="admin-form-footer admin-full">
                    <p>
                      Save this product to the draft. Publish separately when
                      ready.
                    </p>
                    <div className="admin-actions">
                      <button
                        className="admin-button admin-secondary"
                        type="button"
                        onClick={closeEditor}
                      >
                        Cancel
                      </button>
                      <button
                        className="admin-button admin-primary"
                        type="submit"
                      >
                        <Check size={17} /> Save draft
                      </button>
                    </div>
                  </div>
                </fieldset>
              </form>
            </section>
          )}
        </>
      )}
      <footer className="admin-footer">Paniar · Catalogue workspace</footer>
    </main>
  );
}
