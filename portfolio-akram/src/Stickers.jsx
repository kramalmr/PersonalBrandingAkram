import { useEffect, useMemo, useRef, useState } from "react";
import {
  gsap,
  useGSAP,
  ScrollSmoother,
  Draggable,
  InertiaPlugin,
} from "./gsapSetup";
import duckImg from "./assets/duck.png";
import eyesImg from "./assets/eyes.png";
import numberImg from "./assets/seventeen.png";

/* -------------------------------------------------------------------------
 * Trim the transparent padding off an image (once, cached) so accessories can
 * be placed in percentages of the *visible* duck.
 * ----------------------------------------------------------------------- */
const trimCache = new Map();
function trim(src) {
  if (!trimCache.has(src)) {
    trimCache.set(
      src,
      new Promise((resolve) => {
        const img = new Image();
        img.onerror = () => resolve({ url: src, ratio: 1 });
        img.onload = () => {
          const { naturalWidth: W, naturalHeight: H } = img;
          const c = document.createElement("canvas");
          c.width = W;
          c.height = H;
          const ctx = c.getContext("2d");
          ctx.drawImage(img, 0, 0);
          const { data } = ctx.getImageData(0, 0, W, H);
          let x0 = W, y0 = H, x1 = -1, y1 = -1;
          for (let y = 0; y < H; y++)
            for (let x = 0; x < W; x++)
              if (data[(y * W + x) * 4 + 3] > 60) {
                if (x < x0) x0 = x;
                if (x > x1) x1 = x;
                if (y < y0) y0 = y;
                if (y > y1) y1 = y;
              }
          if (x1 < 0) return resolve({ url: src, ratio: H / W });
          const w = x1 - x0 + 1, h = y1 - y0 + 1;
          const out = document.createElement("canvas");
          out.width = w;
          out.height = h;
          out.getContext("2d").drawImage(c, x0, y0, w, h, 0, 0, w, h);
          resolve({ url: out.toDataURL("image/png"), ratio: h / w });
        };
        img.src = src;
      }),
    );
  }
  return trimCache.get(src);
}

function useTrimmed(src) {
  const [r, setR] = useState({ url: src, ratio: 1.1, ready: false });
  useEffect(() => {
    let alive = true;
    trim(src).then((v) => alive && setR({ ...v, ready: true }));
    return () => {
      alive = false;
    };
  }, [src]);
  return r;
}

/* -------------------------------------------------------------------------
 * Rubber duck variants: colour tints + little accessories
 * ----------------------------------------------------------------------- */
const TINTS = {
  classic: "none",
  coral: "hue-rotate(-40deg) saturate(0.8) brightness(1.05)",
  mint: "hue-rotate(118deg) saturate(0.55) brightness(1.2)",
  sky: "hue-rotate(170deg) saturate(0.9)",
  peach: "saturate(0.5) brightness(1.2)",
  ink: "grayscale(1) brightness(0.3) contrast(1.3)",
};

// All positions are % of the trimmed duck box (head ≈ x .19–.68, y 0–.47).
const ACCESSORIES = {
  hat: (
    <svg viewBox="0 0 60 80" className="absolute overflow-visible"
      style={{ left: "22%", top: "-30%", width: "36%", rotate: "-14deg" }}>
      <path d="M30 4 L56 74 Q30 82 4 74 Z" fill="#DE7272" stroke="#000" strokeWidth="3" strokeLinejoin="round" />
      <circle cx="30" cy="40" r="4" fill="#FFCA88" />
      <circle cx="22" cy="58" r="3.5" fill="#B4E4D6" />
      <circle cx="40" cy="55" r="3.5" fill="#FFCA88" />
      <circle cx="30" cy="4" r="6" fill="#B4E4D6" stroke="#000" strokeWidth="3" />
    </svg>
  ),
  shades: (
    <svg viewBox="0 0 100 50" className="absolute overflow-visible"
      style={{ left: "30%", top: "10%", width: "42%", rotate: "-6deg" }}>
      <path d="M24 22 L0 14" stroke="#000" strokeWidth="4" strokeLinecap="round" />
      <rect x="24" y="12" width="36" height="28" rx="11" fill="#111" stroke="#000" strokeWidth="3" />
      <rect x="70" y="4" width="24" height="22" rx="9" fill="#111" stroke="#000" strokeWidth="3" />
      <path d="M60 22 L70 16" stroke="#000" strokeWidth="4" />
      <path d="M30 19 L40 17" stroke="#fff" strokeWidth="3" strokeLinecap="round" opacity="0.7" />
    </svg>
  ),
  cap: (
    <svg viewBox="0 0 100 50" className="absolute overflow-visible"
      style={{ left: "14%", top: "-12%", width: "58%", rotate: "-8deg" }}>
      <path d="M26 24 L26 40 Q50 52 74 40 L74 24 Z" fill="#222" stroke="#000" strokeWidth="3" strokeLinejoin="round" />
      <path d="M50 2 L98 18 L50 34 L2 18 Z" fill="#111" stroke="#000" strokeWidth="3" strokeLinejoin="round" />
      <path d="M50 18 L88 22 L88 40" stroke="#FFCA88" strokeWidth="3" fill="none" strokeLinecap="round" />
      <circle cx="88" cy="42" r="4" fill="#FFCA88" />
    </svg>
  ),
  phones: (
    <svg viewBox="0 0 100 70" className="absolute overflow-visible"
      style={{ left: "10%", top: "-10%", width: "66%", rotate: "-4deg" }}>
      <path d="M10 56 C8 -6 92 -6 90 50" stroke="#111" strokeWidth="7" fill="none" strokeLinecap="round" />
      <rect x="0" y="36" width="22" height="32" rx="9" fill="#DE7272" stroke="#000" strokeWidth="3" />
      <rect x="82" y="30" width="16" height="26" rx="7" fill="#DE7272" stroke="#000" strokeWidth="3" />
    </svg>
  ),
  bow: (
    <svg viewBox="0 0 60 30" className="absolute overflow-visible"
      style={{ left: "20%", top: "44%", width: "34%", rotate: "10deg" }}>
      <path d="M30 15 L4 2 L4 28 Z" fill="#DE7272" stroke="#000" strokeWidth="3" strokeLinejoin="round" />
      <path d="M30 15 L56 2 L56 28 Z" fill="#DE7272" stroke="#000" strokeWidth="3" strokeLinejoin="round" />
      <rect x="25" y="9" width="10" height="12" rx="3" fill="#FFCA88" stroke="#000" strokeWidth="3" />
    </svg>
  ),
};

const LOOKS = [
  { tint: "classic", acc: "shades" },
  { tint: "coral", acc: "hat" },
  { tint: "mint", acc: "cap" },
  { tint: "ink", acc: null },
  { tint: "sky", acc: "phones" },
  { tint: "peach", acc: "bow" },
  { tint: "classic", acc: "cap" },
  { tint: "mint", acc: "shades" },
];

/** A fresh random order of duck looks on every page load. */
export function useDuckLooks() {
  return useMemo(() => {
    const a = [...LOOKS];
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }, []);
}

function Duck({ tint = "classic", acc = null }) {
  const { url, ratio, ready } = useTrimmed(duckImg);
  return (
    <div
      className="relative"
      style={{
        aspectRatio: `1 / ${ratio}`,
        filter: "drop-shadow(0 10px 14px rgba(0,0,0,0.18))",
      }}
    >
      <img
        src={url}
        alt=""
        draggable={false}
        className="pointer-events-none h-full w-full"
        style={{ filter: TINTS[tint], opacity: ready ? 1 : 0 }}
      />
      {ready && acc && ACCESSORIES[acc]}
    </div>
  );
}

/* -------------------------------------------------------------------------
 * Sticker
 *   outer -> ScrollSmoother parallax
 *   mid   -> Draggable (throw & glide)
 *   inner -> pop-in on scroll + idle float
 * ----------------------------------------------------------------------- */
let zTop = 20;

export function StickerLayer({ children, className = "" }) {
  return (
    <div
      className={`pointer-events-none absolute inset-0 [--sticker-scale:0.7] md:[--sticker-scale:1] ${className}`}
    >
      {children}
    </div>
  );
}

export function Sticker({
  type = "duck", // "duck" | "eyes" | "number" | "text"
  left,
  top,
  size = 80, // px at desktop (scaled down on mobile)
  rotate = 0,
  speed = 1, // ScrollSmoother parallax: <1 slower, >1 faster
  tint,
  acc,
  text = "",
  color = "#FFCA88",
  hideMobile = false,
  parallax = true,
}) {
  const outer = useRef(null);
  const mid = useRef(null);
  const inner = useRef(null);

  useGSAP(
    () => {
      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      const kills = [];

      // parallax
      const smoother = parallax ? ScrollSmoother.get() : null;
      if (smoother && speed !== 1 && !reduce) {
        const fx = smoother.effects(outer.current, { speed });
        kills.push(() => fx?.forEach((st) => st.kill()));
      }

      // pop in, then float
      if (!reduce) {
        gsap.from(inner.current, {
          scale: 0,
          rotation: gsap.utils.random(-45, 45),
          duration: 1.1,
          ease: "elastic.out(1, 0.55)",
          scrollTrigger: { trigger: outer.current, start: "top 92%" },
        });
        gsap.to(inner.current, {
          y: gsap.utils.random(6, 12) * (Math.random() > 0.5 ? 1 : -1),
          duration: gsap.utils.random(2, 3.4),
          ease: "sine.inOut",
          yoyo: true,
          repeat: -1,
        });
      }

      // eyes follow the cursor
      if (type === "eyes") {
        const look = outer.current.querySelector(".look");
        const lx = gsap.quickTo(look, "x", { duration: 0.3, ease: "power3" });
        const ly = gsap.quickTo(look, "y", { duration: 0.3, ease: "power3" });
        const onMove = (e) => {
          const r = outer.current.getBoundingClientRect();
          const dx = e.clientX - (r.left + r.width / 2);
          const dy = e.clientY - (r.top + r.height / 2);
          const d = Math.hypot(dx, dy) || 1;
          const m = Math.min(7, d / 40);
          lx((dx / d) * m);
          ly((dy / d) * m);
        };
        window.addEventListener("pointermove", onMove);
        kills.push(() => window.removeEventListener("pointermove", onMove));
      }

      // drag + throw
      const el = mid.current;
      const rotateTo = gsap.quickTo(el, "rotation", { duration: 0.7, ease: "power3" });
      const [drag] = Draggable.create(el, {
        type: "x,y",
        inertia: true,
        edgeResistance: 0.65,
        onPress() {
          outer.current.style.zIndex = ++zTop; // always bring to the front
          gsap.to(el, { scale: 1.1, duration: 0.25, ease: "power2.out" });
        },
        onDrag() {
          rotateTo(gsap.utils.clamp(-20, 20, this.deltaX * 1.4));
        },
        onThrowUpdate() {
          rotateTo(gsap.utils.clamp(-20, 20, InertiaPlugin.getVelocity(el, "x") / 60));
        },
        onThrowComplete: () => rotateTo(0),
        onRelease() {
          gsap.to(el, { scale: 1, duration: 0.7, ease: "elastic.out(1, 0.5)" });
        },
      });
      kills.push(() => drag.kill());

      return () => kills.forEach((k) => k());
    },
    { scope: outer },
  );

  let content;
  if (type === "duck") {
    content = (
      <div style={{ rotate: `${rotate}deg` }}>
        <Duck tint={tint} acc={acc} />
      </div>
    );
  } else if (type === "eyes" || type === "number") {
    content = (
      <span className="look block" style={{ rotate: `${rotate}deg` }}>
        <img
          src={type === "eyes" ? eyesImg : numberImg}
          alt=""
          draggable={false}
          className="pointer-events-none h-auto w-full"
        />
      </span>
    );
  } else {
    content = (
      <span
        className="block whitespace-nowrap rounded-2xl border-2 border-black px-4 py-1.5 text-sm shadow-[3px_3px_0_#000] md:text-xl"
        style={{ background: color, rotate: `${rotate}deg` }}
      >
        {text}
      </span>
    );
  }

  return (
    <div
      ref={outer}
      className={`pointer-events-auto absolute select-none ${hideMobile ? "hidden md:block" : ""}`}
      style={{ left, top, zIndex: 20 }}
    >
      <div
        ref={mid}
        className="cursor-grab will-change-transform"
        style={{
          width: type === "text" ? "max-content" : `calc(${size}px * var(--sticker-scale, 1))`,
        }}
      >
        <div ref={inner}>{content}</div>
      </div>
    </div>
  );
}
