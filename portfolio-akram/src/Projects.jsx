import { useRef, useState } from "react";
import { gsap, useGSAP, ScrollSmoother } from "./gsapSetup";
import { projects } from "./projectsData";
import Footer from "./Footer";

const n = projects.length;
// A small pill at the bottom centre, like a bubble about to inflate.
const CLIP_START = "inset(100% 14% 0% 14% round 500px)";
const CLIP_CARD_END = "inset(0% 0% 0% 0% round 32px)";
const CLIP_FOOTER_END = "inset(0% 0% 0% 0% round 0px)";

// Infinite poster marquee. The list is rendered twice and the track slides left
// by exactly half its width, so the loop is seamless. Slows down on hover.
function Posters({ list }) {
  const root = useRef(null);

  useGSAP(
    () => {
      const el = root.current;
      const loop = gsap.to(".marquee-track", {
        xPercent: -50,
        duration: 32,
        ease: "none",
        repeat: -1,
      });
      const slow = () => gsap.to(loop, { timeScale: 0.2, duration: 0.6 });
      const fast = () => gsap.to(loop, { timeScale: 1, duration: 0.6 });
      el.addEventListener("pointerenter", slow);
      el.addEventListener("pointerleave", fast);
      return () => {
        el.removeEventListener("pointerenter", slow);
        el.removeEventListener("pointerleave", fast);
      };
    },
    { scope: root },
  );

  const items = [...list, ...list];

  return (
    <div
      ref={root}
      className="h-full overflow-hidden pb-28 pt-20 md:pb-32"
    >
      <div className="marquee-track flex h-full w-max gap-4 pr-4 md:gap-6 md:pr-6">
        {items.map((src, k) => (
          <img
            key={k}
            src={src}
            alt=""
            draggable={false}
            className="h-full w-auto shrink-0 rounded-lg shadow-xl"
            style={{
              rotate: `${((k % list.length) - 3) * 2}deg`,
              translate: `0 ${k % 2 ? 14 : -14}px`,
            }}
          />
        ))}
      </div>
    </div>
  );
}

export default function Projects() {
  const stage = useRef(null);
  const stRef = useRef(null);
  const [footerOn, setFooterOn] = useState(false);

  useGSAP(
    () => {
      const q = gsap.utils.selector(stage);
      const layers = q(".layer-card");
      const footer = q(".layer-footer")[0];
      const dots = q(".dot");

      gsap.set(q(".card"), { clipPath: CLIP_START });
      gsap.set(footer, { clipPath: CLIP_START });

      const tl = gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: {
          trigger: stage.current,
          start: "top top",
          end: `+=${(n + 1) * 80}%`,
          pin: true,
          scrub: 0.6,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          onUpdate(self) {
            // highlight the active project dot
            const idx = gsap.utils.clamp(0, n - 1, Math.round(tl.time()) - 1);
            dots.forEach((d, i) => d.setAttribute("data-active", i === idx));
            // trigger the physics once the footer is fully open
            if (self.progress > 0.95) setFooterOn(true);
            else if (self.progress < 0.88) setFooterOn(false);
          },
        },
      });
      stRef.current = tl.scrollTrigger;

      layers.forEach((layer, i) => {
        const card = layer.querySelector(".card");
        const media = layer.querySelector(".card-media");
        const copy = layer.querySelectorAll(".reveal");

        // each card inflates from the bottom
        tl.fromTo(
          card,
          { clipPath: CLIP_START },
          { clipPath: CLIP_CARD_END, duration: 1, ease: "power2.inOut" },
          i,
        )
          .fromTo(
            media,
            { scale: 1.35 },
            { scale: 1, duration: 1, ease: "power2.out" },
            i,
          )
          .fromTo(
            copy,
            { y: 70, opacity: 0 },
            {
              y: 0,
              opacity: 1,
              stagger: 0.06,
              duration: 0.5,
              ease: "power3.out",
            },
            i + 0.45,
          );

        // the previous card steps back as the next one arrives
        if (i > 0) {
          tl.to(
            layers[i - 1],
            { scale: 0.92, yPercent: -3, duration: 1, ease: "power2.inOut" },
            i,
          ).to(
            layers[i - 1].querySelector(".dim"),
            { opacity: 0.55, duration: 1 },
            i,
          );
        }
      });

      // finish: the footer inflates over the last card
      tl.to(
        layers[n - 1],
        { scale: 0.92, yPercent: -3, duration: 1, ease: "power2.inOut" },
        n,
      )
        .to(".dots", { autoAlpha: 0, duration: 0.3 }, n - 0.1)
        .fromTo(
          footer,
          { clipPath: CLIP_START },
          { clipPath: CLIP_FOOTER_END, duration: 1, ease: "power2.inOut" },
          n,
        )
        .fromTo(
          footer.querySelectorAll(".reveal"),
          { y: 50, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            stagger: 0.08,
            duration: 0.5,
            ease: "power3.out",
          },
          n + 0.5,
        );
    },
    { scope: stage },
  );

  const goTo = (i) => {
    const st = stRef.current;
    if (!st) return;
    // card i is fully open at timeline time i + 1
    const y = st.start + ((i + 1) / (n + 1)) * (st.end - st.start);
    ScrollSmoother.get()?.scrollTo(y, true);
  };

  return (
    <section
      id="projects"
      ref={stage}
      className="relative h-svh w-full overflow-hidden"
    >
      {projects.map((p, i) => (
        <div
          key={p.id}
          className="layer layer-card absolute inset-0 p-3 md:p-5"
          style={{ zIndex: i + 1, transformOrigin: "50% 0%" }}
        >
          <a
            href={p.href}
            target="_blank"
            rel="noreferrer"
            aria-label={`Open ${p.title}`}
            className="card group relative block h-full w-full overflow-hidden rounded-4xl text-white"
            style={{ background: p.bg ?? "#222" }}
          >
            <div className="card-media absolute inset-0">
              {p.posters ? (
                <Posters list={p.posters} />
              ) : (
                <img
                  src={p.image}
                  alt={`${p.title} preview`}
                  draggable={false}
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
              )}
            </div>

            <div className="absolute inset-0 bg-linear-to-t from-black/75 via-black/10 to-black/20" />
            <div className="dim pointer-events-none absolute inset-0 bg-black opacity-0" />

            <div className="absolute inset-x-0 top-0 flex items-start justify-between p-5 md:p-8">
              <span className="reveal rounded-full bg-white px-4 py-1.5 text-sm text-black md:text-base">
                {i + 1} of {n}
              </span>
              <span
                className="reveal rounded-full px-4 py-1.5 text-sm text-black md:text-base"
                style={{ background: p.color }}
              >
                {p.category}
              </span>
            </div>

            <div className="absolute inset-x-0 bottom-0 flex flex-col gap-4 p-5 md:flex-row md:items-end md:justify-between md:p-10">
              <div className="reveal">
                <h3
                  className="font-Jacquard leading-[0.85] tracking-tight"
                  style={{ fontSize: "clamp(3rem, 11vw, 9rem)" }}
                >
                  {p.title}
                </h3>
                <p className="mt-3 max-w-md text-base text-white/85 md:text-lg">
                  {p.description}
                </p>
              </div>

              <span className="reveal flex w-fit items-center gap-2 rounded-full bg-white px-5 py-2.5 text-base text-black transition-transform duration-300 group-hover:scale-105 md:text-lg">
                View project
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  className="h-5 w-5 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M7 17l10-10M7 7h10v10"
                  />
                </svg>
              </span>
            </div>
          </a>
        </div>
      ))}

      <Footer
        active={footerOn}
        zIndex={n + 2}
      />

      <nav
        className="dots absolute right-3 top-1/2 z-40 hidden -translate-y-1/2 flex-col gap-3 sm:flex md:right-8"
        aria-label="Projects"
      >
        {projects.map((p, i) => (
          <button
            key={p.id}
            type="button"
            onClick={() => goTo(i)}
            aria-label={`Go to ${p.title}`}
            data-active={i === 0}
            className="dot h-3 w-3 cursor-pointer rounded-full border border-white bg-transparent transition-all duration-300 data-[active=true]:h-7 data-[active=true]:bg-white"
          />
        ))}
      </nav>
    </section>
  );
}
