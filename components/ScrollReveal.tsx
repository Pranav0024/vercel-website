"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

const targets = [
  "main section", ".page-intro", ".section-heading", ".capability-strip",
  ".perspective-image", ".perspective-copy", ".process-header", ".process-card",
  ".product-preview", ".catalogue-card", ".catalogue-toolbar", ".catalogue-summary",
  ".catalogue-note", ".enquiry-banner", ".two-column > *", ".site-footer",
].join(", ");

export default function ScrollReveal() {
  const pathname = usePathname();

  useEffect(() => {
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (!("IntersectionObserver" in window)) return;
    const seen = new WeakSet<Element>();
    const pending = new Set<Element>();
    let frame = 0;

    function reveal(element: Element) {
      element.classList.remove("scroll-reveal-pending");
      pending.delete(element);
      observer.unobserve(element);
    }

    const observer = new IntersectionObserver(entries => {
      for (const entry of entries) if (entry.isIntersecting) reveal(entry.target);
    }, { rootMargin: "0px 0px -32px 0px", threshold: 0 });

    function scan() {
      if (motion.matches) return;
      for (const element of document.querySelectorAll(targets)) {
        // Animate individual blocks, never both a section and its children.
        if (seen.has(element) || element.querySelector(targets)) continue;
        seen.add(element);
        // Keep the initial viewport and restored scroll positions fully visible.
        if (element.getBoundingClientRect().top < window.innerHeight) continue;
        element.classList.add("scroll-reveal", "scroll-reveal-pending");
        pending.add(element);
        observer.observe(element);
      }
    }

    function onMotionChange() {
      if (motion.matches) pending.forEach(reveal);
      else scan();
    }

    const changes = new MutationObserver(records => {
      if (!records.some(record => [...record.addedNodes].some(node => node.nodeType === 1))) return;
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(scan);
    });
    scan();
    changes.observe(document.body, { childList: true, subtree: true });
    motion.addEventListener("change", onMotionChange);
    // Keyboard navigation must never focus a visually hidden element.
    function onFocus(event: FocusEvent) {
      if (event.target instanceof Element) {
        const element = event.target.closest(".scroll-reveal-pending");
        if (element) reveal(element);
      }
    }
    document.addEventListener("focusin", onFocus);
    return () => {
      cancelAnimationFrame(frame);
      changes.disconnect();
      observer.disconnect();
      pending.forEach(element => element.classList.remove("scroll-reveal-pending"));
      motion.removeEventListener("change", onMotionChange);
      document.removeEventListener("focusin", onFocus);
    };
  }, [pathname]);

  return null;
}
