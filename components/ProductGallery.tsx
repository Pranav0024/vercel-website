"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, Pause, Play } from "lucide-react";
import { productSlides } from "@/lib/product-imagery";

export default function ProductGallery({ mainImage, name, number }: {
  mainImage: string;
  name: string;
  number: number;
}) {
  const slides = productSlides(mainImage);
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);
  const [visible, setVisible] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(true);
  const [failed, setFailed] = useState<string[]>([]);
  const root = useRef<HTMLDivElement>(null);
  const available = slides.filter(slide => !failed.includes(slide.src));
  const count = available.length;
  const selected = count ? active % count : 0;

  useEffect(() => {
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReducedMotion(preference.matches);
    update();
    preference.addEventListener("change", update);
    const observer = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting), { threshold: 0.2 });
    if (root.current) observer.observe(root.current);
    return () => { preference.removeEventListener("change", update); observer.disconnect(); };
  }, []);

  useEffect(() => {
    if (count < 2 || paused || hovered || focused || reducedMotion || !visible) return;
    const timer = window.setInterval(() => {
      if (!document.hidden) setActive(value => (value + 1) % count);
    }, 5500);
    return () => window.clearInterval(timer);
  }, [count, paused, hovered, focused, reducedMotion, visible]);

  function choose(index: number) {
    setActive((index + count) % count);
    setPaused(true);
  }

  return (
    <div ref={root} className="catalogue-image product-gallery" role="group" aria-roledescription="carousel" aria-label={`${name} photos`}
      onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}
      onFocus={() => setFocused(true)} onBlur={event => { if (!event.currentTarget.contains(event.relatedTarget)) setFocused(false); }}>
      <span className="product-number">{String(number).padStart(2, "0")}</span>
      {available.map((slide, index) => (
        <div key={slide.src} className={`product-gallery-slide ${index === selected ? "is-active" : ""} ${slide.generated ? "is-styled" : "is-original"}`} aria-hidden={index !== selected}>
          <Image src={slide.src} alt={`${name} — ${slide.label.toLowerCase()}`} fill sizes="(max-width: 540px) 90vw, (max-width: 950px) 45vw, 30vw"
            onError={() => setFailed(previous => previous.includes(slide.src) ? previous : [...previous, slide.src])} />
        </div>
      ))}
      {count > 1 && <div className="gallery-controls">
        <button type="button" aria-label={`Previous photo of ${name}`} onClick={() => choose(selected - 1)}><ChevronLeft size={15} /></button>
        <div className="gallery-dots">{available.map((slide, index) => <button key={slide.src} type="button" aria-label={`Show ${slide.label.toLowerCase()} of ${name}`} aria-pressed={selected === index} onClick={() => choose(index)}><span /></button>)}</div>
        {!reducedMotion && <button type="button" aria-label={`${paused ? "Play" : "Pause"} slideshow for ${name}`} aria-pressed={paused} onClick={() => setPaused(value => !value)}>{paused ? <Play size={13} /> : <Pause size={13} />}</button>}
        <button type="button" aria-label={`Next photo of ${name}`} onClick={() => choose(selected + 1)}><ChevronRight size={15} /></button>
      </div>}
    </div>
  );
}
