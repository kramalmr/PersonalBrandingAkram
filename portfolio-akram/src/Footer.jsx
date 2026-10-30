import { useEffect, useRef } from "react";
import { gsap, ScrollSmoother } from "./gsapSetup";

const LETTERS = ["A", "K", "R", "A", "M"];
const COLORS = ["#DE7272", "#B4E4D6", "#FFCA88", "#DE7272", "#B4E4D6"];

// TODO: replace with your real contact links.
const LINKS = [
  { label: "Email", href: "mailto:hello@example.com" },
  { label: "Instagram", href: "https://instagram.com/" },
  { label: "Behance", href: "https://behance.net/" },
  { label: "GitHub", href: "https://github.com/" },
];

// ---- block physics (GSAP Physics2DPlugin) ---------------------------------
// Every letter is a heavy block: it free-falls with gravity, hits the floor,
// squashes, bounces with a lot of energy loss, and settles.
const G = 3400; // gravity, px/s²
const RESTITUTION = 0.34; // fraction of speed kept after each impact
const MIN_SPEED = 240; // below this the block just rests

// one flight up and back down to the floor, then the next impact
function hop(el, v) {
  gsap.to(el, {
    duration: (2 * v) / G, // time to go up and come back to y = 0
    ease: "none",
    physics2D: { velocity: v, angle: -90, gravity: G },
    onComplete() {
      gsap.set(el, { y: 0 });
      land(el, v);
    },
  });
  // a tiny wobble in the air
  gsap.to(el, {
    rotation: gsap.utils.random(-4, 4),
    duration: v / G,
    ease: "sine.out",
    yoyo: true,
    repeat: 1,
  });
}

// impact: squash proportional to speed, then bounce again or come to rest
function land(el, v) {
  const s = Math.min(0.28, v / 7000);
  gsap.fromTo(
    el,
    { scaleY: 1 - s, scaleX: 1 + s * 0.7, transformOrigin: "50% 100%" },
    { scaleY: 1, scaleX: 1, duration: 0.55, ease: "elastic.out(1, 0.4)" },
  );
  const next = v * RESTITUTION;
  if (next < MIN_SPEED) {
    gsap.set(el, { y: 0 });
    gsap.to(el, { rotation: 0, duration: 0.2 });
    el._busy = false;
    return;
  }
  hop(el, next);
}

// start high above the footer and fall
function drop(el, height, delay) {
  el._busy = true;
  const fall = Math.sqrt((2 * height) / G);
  gsap.set(el, {
    y: -height,
    autoAlpha: 1,
    rotation: gsap.utils.random(-14, 14),
  });
  gsap.to(el, {
    delay,
    duration: fall,
    ease: "none",
    physics2D: { velocity: 1, angle: 90, gravity: G },
    onComplete() {
      gsap.set(el, { y: 0 });
      land(el, G * fall); // impact speed = g * t
    },
  });
  gsap.to(el, { delay, duration: fall, rotation: 0, ease: "power2.in" });
}

// hover / click: knock a settled block into the air
function poke(el, speed) {
  if (!el || el._busy) return;
  el._busy = true;
  hop(el, speed);
}

export default function Footer({ active, zIndex = 10 }) {
  const root = useRef(null);

  // Once the footer is fully open the letters fall in one after another.
  // Scrolling back up clears them away again.
  useEffect(() => {
    if (!active) return;
    const els = [...root.current.querySelectorAll(".fl")];
    const top = root.current.getBoundingClientRect().top;
    els.forEach((el, i) => {
      const bottom = el.getBoundingClientRect().bottom;
      drop(el, bottom - top + 80, 0.15 + i * 0.22);
    });
    return () => {
      gsap.killTweensOf(els);
      gsap.set(els, {
        x: 0,
        y: 0,
        rotation: 0,
        scaleX: 1,
        scaleY: 1,
        autoAlpha: 0,
      });
      els.forEach((el) => (el._busy = false));
    };
  }, [active]);

  return (
    <footer
      id="contact"
      ref={root}
      className="layer layer-footer absolute inset-0 flex flex-col justify-between overflow-hidden bg-[#141414] text-white"
      style={{ zIndex }}
    >
      <div className="flex flex-col gap-8 px-5 pt-8 md:flex-row md:justify-between md:px-10 md:pt-12">
        <p className="reveal max-w-[14ch] text-4xl leading-[1.05] tracking-tight sm:text-5xl md:text-7xl">
          Got an idea? Let&apos;s make it{" "}
          <span className="text-[#FFCA88]">playful</span>.
        </p>

        <ul className="flex flex-wrap gap-x-6 gap-y-2 md:flex-col md:items-end md:gap-2">
          {LINKS.map((l) => (
            <li key={l.label} className="reveal">
              <a
                href={l.href}
                target={l.href.startsWith("http") ? "_blank" : undefined}
                rel="noreferrer"
                className="text-xl underline decoration-white/30 underline-offset-4 transition-colors hover:text-[#B4E4D6] hover:decoration-[#B4E4D6] md:text-3xl"
              >
                {l.label}
              </a>
            </li>
          ))}
        </ul>
      </div>

      <div className="reveal flex items-center justify-between px-5 text-sm text-white/60 md:px-10 md:text-base">
        <span>© 2026 Muhammad Akram</span>
        <button
          type="button"
          onClick={() => ScrollSmoother.get()?.scrollTo(0, true)}
          className="cursor-pointer rounded-full border border-white/30 px-4 py-1.5 text-white transition-colors hover:bg-white hover:text-black"
        >
          Back to top
        </button>
      </div>

      <div
        className="flex w-full translate-y-[8%] select-none justify-center font-Jacquard leading-[0.72]"
        style={{ fontSize: "clamp(6rem, 31vw, 44rem)" }}
        aria-label="Akram"
      >
        {LETTERS.map((ch, i) => (
          <span
            key={i}
            className="fl invisible inline-block cursor-pointer will-change-transform"
            style={{ color: COLORS[i] }}
            onPointerEnter={(e) => poke(e.currentTarget, 900)}
            onClick={(e) => poke(e.currentTarget, 1500)}
          >
            {ch}
          </span>
        ))}
      </div>
    </footer>
  );
}
