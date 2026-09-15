"use client";

import { useEffect, useMemo, useState } from "react";

export type HeroImage = { src: string; alt: string };

type KenBurnsProps = {
  images: HeroImage[];
  /** Time each image is visible before transitioning (ms). */
  hold?: number;
  /** Transition duration (ms). */
  crossfade?: number;
  className?: string;
};

/**
 * Cinematic Ken-Burns background that crossfades between a set of stills.
 * Respects `prefers-reduced-motion` (instant cuts, no zoom).
 * Wrap with `position: relative; overflow:hidden` parent (e.g. `hero-media`).
 */
export function KenBurns({
  images,
  hold = 7000,
  crossfade = 1200,
  className = "absolute inset-0",
}: KenBurnsProps) {
  const [active, setActive] = useState(0);

  const prefersReduced = useMemo(
    () => typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    [],
  );

  useEffect(() => {
    if (images.length <= 1) return;
    const prefersSlow = prefersReduced ? 0 : 1;
    const delay = hold * (prefersSlow ? 1 : 0.85) + crossfade * prefersSlow;
    const id = setInterval(() => {
      setActive((v) => (v + 1) % images.length);
    }, delay);
    return () => clearInterval(id);
  }, [images.length, hold, crossfade, prefersReduced]);

  return (
    <div className={className} aria-hidden>
      {images.map((img, i) => (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          key={img.src}
          src={img.src}
          alt=""
          className={i === active ? "is-active" : ""}
          loading={i === 0 ? "eager" : "lazy"}
          draggable={false}
        />
      ))}
    </div>
  );
}