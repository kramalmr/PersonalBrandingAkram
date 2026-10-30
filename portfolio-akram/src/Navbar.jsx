import { useRef } from "react";
import { gsap, useGSAP, ScrollTrigger, ScrollSmoother } from "./gsapSetup";
import duckImg from "./assets/duck.png";
const LINKS = [
  { label: "About", target: "#about", hover: "hover:bg-[#DE7272] hover:text-white" },
  { label: "Work", target: "#projects", hover: "hover:bg-[#B4E4D6]" },
  { label: "Contact", target: "contact", hover: "hover:bg-[#FFCA88]" },
];

// const DOTS = ["#DE7272", "#B4E4D6", "#FFCA88"];

// Pill-shaped bar: visible at the very top and whenever you scroll UP,
// slides away while you scroll DOWN.
export default function Navbar() {
  const bar = useRef(null);

  useGSAP(
    () => {
      let hidden = true;
      gsap.set(bar.current, { yPercent: -220 });

      const setHidden = (h) => {
        if (h === hidden) return;
        hidden = h;
        gsap.to(bar.current, {
          yPercent: h ? -220 : 0,
          duration: 0.55,
          ease: "power3.inOut",
          overwrite: true,
        });
      };

      gsap.delayedCall(1.2, () => setHidden(false)); // entrance

      ScrollTrigger.create({
        start: 0,
        end: "max",
        onUpdate: (self) => {
          if (self.scroll() <= 40) setHidden(false);
          else setHidden(self.direction === 1);
        },
      });
    },
    { scope: bar },
  );

  const go = (target) => {
    const smoother = ScrollSmoother.get();
    if (!smoother) return;
    if (target === 0) smoother.scrollTo(0, true);
    else if (target === "contact")
      smoother.scrollTo(ScrollTrigger.maxScroll(window), true);
    else smoother.scrollTo(target, true, "top top");
  };

  return (
    <nav
      ref={bar}
      className="pointer-events-none fixed inset-x-0 top-3 z-[100] flex justify-center px-3 md:top-5"
    >
      <div className="pointer-events-auto flex items-center gap-1 rounded-full border border-black bg-[#FFF0D8] p-1.5 pl-4">
        <button
          type="button"
          onClick={() => go(0)}
          className="mr-1 flex cursor-pointer items-center gap-2 md:mr-3"
          aria-label="Back to top"
        >
          <img src={duckImg} alt="" width={36}/>
        </button>
        {LINKS.map((l) => (
          <button
            key={l.label}
            type="button"
            onClick={() => go(l.target)}
            className={`cursor-pointer rounded-full px-3 py-1.5 text-sm transition-colors duration-300 md:px-4 md:text-base ${l.hover}`}
          >
            {l.label}
          </button>
        ))}
      </div>
    </nav>
  );
}
