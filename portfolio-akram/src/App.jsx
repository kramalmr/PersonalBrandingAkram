import { useRef, useState } from "react";
import {
  gsap,
  useGSAP,
  ScrollTrigger,
  ScrollSmoother,
  SplitText,
} from "./gsapSetup";

import heroImg from "./assets/hero.png";
import eyesImg from "./assets/eyes.png";
import duckImg from "./assets/duck.png";
import numberImg from "./assets/seventeen.png";
import note from "./assets/note.png";

import DraggableImage from "./DraggableImage";
import Projects from "./Projects";
import Navbar from "./Navbar";
import ScrollDuck from "./ScrollDuck";
import "./ui.css";

const TAGS = [
  {
    label: "High School Student",
    cls: "bg-[#DE7272] -rotate-[8deg] md:top-[47%] md:left-[34%]",
  },
  {
    label: "Front-end Developer",
    cls: "bg-[#B4E4D6] rotate-3 md:top-[18%] md:left-[5%]",
  },
  {
    label: "Graphic Designer",
    cls: "bg-[#FFCA88] rotate-12 md:top-[30%] md:left-[44%]",
  },
];

const SKILLS = [
  "HTML(5)",
  "CSS(3)",
  "Javascript",
  "UI/UX Development",
  "Graphics Design",
  "Responsive Web",
  "WordPress Dev",
  "React JS",
  "Flutter",
  "Various CSS Frameworks",
];

const CHIP_HOVERS = [
  "hover:bg-[#DE7272] hover:text-white",
  "hover:bg-[#B4E4D6]",
  "hover:bg-[#FFCA88]",
];

function Arrow({ className = "" }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      stroke="black"
      strokeWidth="1"
      className={className}
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M7 17l10-10M7 7h10v10" />
    </svg>
  );
}

function Hero() {
  const root = useRef(null);
  const title = useRef(null);

  useGSAP(
    () => {
      // headline letters spring up
      SplitText.create(title.current, {
        type: "chars",
        autoSplit: true,
        onSplit: (self) =>
          gsap.from(self.chars, {
            yPercent: 120,
            opacity: 0,
            rotate: () => gsap.utils.random(-25, 25),
            stagger: 0.05,
            duration: 1.2,
            ease: "expo.out",
            delay: 0.15,
          }),
      });

      // tags pop in, then float forever
      gsap.from(".hero-tag", {
        scale: 0,
        opacity: 0,
        stagger: 0.12,
        duration: 0.9,
        ease: "back.out(2.4)",
        delay: 0.8,
      });
      gsap.utils.toArray(".hero-tag").forEach((tag) => {
        gsap.to(tag, {
          y: gsap.utils.random(-12, 12),
          duration: gsap.utils.random(1.8, 2.8),
          ease: "sine.inOut",
          yoyo: true,
          repeat: -1,
        });
      });

      gsap.from(".hero-cta", {
        y: 30,
        opacity: 0,
        duration: 0.9,
        ease: "power3.out",
        delay: 1.3,
      });

      // parallax as you scroll away
      gsap.to(".hero-group", {
        yPercent: -25,
        ease: "none",
        scrollTrigger: {
          trigger: root.current,
          start: "top top",
          end: "bottom top",
          scrub: true,
        },
      });
      gsap.to(title.current, {
        yPercent: -12,
        ease: "none",
        scrollTrigger: {
          trigger: root.current,
          start: "top top",
          end: "bottom top",
          scrub: true,
        },
      });
    },
    { scope: root },
  );

  const toContact = () =>
    ScrollSmoother.get()?.scrollTo(ScrollTrigger.maxScroll(window), true);

  return (
    // z-50 keeps the hero (and the stickers dragged out of it) above every later section
    <section
      ref={root}
      className="relative z-50 flex min-h-svh w-full flex-col justify-end px-5 pb-10 pt-24 md:px-8"
    >
      <div
        className="hero-group absolute left-1/2 top-[36%] z-40 [--w:min(520px,82vw,52vh)] md:left-[76%] md:top-[60%] md:[--w:min(460px,30vw,46vh)]"
      >
        <DraggableImage src={heroImg} alt="Akram" size={1} x={1} y={0} />
        <DraggableImage src={duckImg} alt="" size={0.29} x={1.44} y={0} delay={0.15} />
        <DraggableImage src={eyesImg} alt="" size={0.115} x={0.56} y={0.2} delay={0.3} />
        <DraggableImage src={numberImg} alt="" size={0.23} x={0.8} y={-0.3} delay={0.45} />
      </div>

      <div className="mb-5 flex flex-wrap justify-center gap-2 md:mb-0">
        {TAGS.map((t) => (
          <div
            key={t.label}
            className={`hero-tag z-30 w-fit rounded-2xl px-4 py-1.5 text-sm text-white sm:text-base md:absolute md:px-6 md:py-2 md:text-xl ${t.cls}`}
          >
            {t.label}
          </div>
        ))}
      </div>

      <h1
        ref={title}
        className="relative z-10 whitespace-nowrap text-left font-Jacquard leading-[0.78] tracking-tight"
        style={{ fontSize: "calc((100vw - 4rem) / 4.1)" }}
      >
        Muhammad
        <br /> Akram
      </h1>

      <button
        type="button"
        onClick={toContact}
        className="hero-cta group mt-5 flex w-fit cursor-pointer flex-row items-center gap-0"
      >
        <div className="h-fit overflow-hidden rounded-full border border-black px-2 py-2 text-[18px] font-extralight transition-all delay-100 duration-400 ease-in-out group-hover:scale-0 lg:px-4 lg:py-4">
          <Arrow className="h-5 w-5 transform transition-transform duration-300 group-hover:-translate-y-8 group-hover:translate-x-8 group-hover:scale-150" />
        </div>
        <div className="h-fit rounded-full border border-black px-4 py-2 font-extralight transition-all delay-100 group-hover:-translate-x-12 md:text-[14px] lg:px-8 lg:py-4 lg:text-[18px]">
          Get in contact!
        </div>
        <div className="h-fit -translate-x-12 scale-0 overflow-hidden rounded-full border border-black px-2 py-2 text-[18px] font-extralight transition-all delay-100 duration-400 ease-in-out group-hover:scale-100 lg:px-4 lg:py-4">
          <Arrow className="h-5 w-5 -translate-x-8 translate-y-8 scale-150 transform transition-all delay-200 duration-300 group-hover:translate-x-0 group-hover:translate-y-0 group-hover:scale-100" />
        </div>
      </button>
    </section>
  );
}

function About() {
  const root = useRef(null);
  const text = useRef(null);

  useGSAP(
    () => {
      // words light up as you scroll through the statement
      SplitText.create(text.current, {
        type: "words",
        autoSplit: true,
        onSplit: (self) =>
          gsap.fromTo(
            self.words,
            { opacity: 0.15 },
            {
              opacity: 1,
              stagger: 0.1,
              ease: "none",
              scrollTrigger: {
                trigger: text.current,
                start: "top 85%",
                end: "bottom 50%",
                scrub: true,
              },
            },
          ),
      });

      gsap.to(".note", {
        rotate: 14,
        ease: "none",
        scrollTrigger: {
          trigger: root.current,
          start: "top bottom",
          end: "bottom top",
          scrub: true,
        },
      });

      // skill chips bounce in as a group
      gsap.set(".chip", { opacity: 0, y: 40, scale: 0.85 });
      ScrollTrigger.batch(".chip", {
        start: "top 92%",
        once: true,
        onEnter: (els) =>
          gsap.to(els, {
            opacity: 1,
            y: 0,
            scale: 1,
            stagger: 0.06,
            duration: 0.8,
            ease: "back.out(2)",
          }),
      });
    },
    { scope: root },
  );

  return (
    <section
      id="about"
      ref={root}
      className="relative flex w-full flex-col gap-16 overflow-hidden px-5 py-20 md:min-h-svh md:gap-24 md:px-8 md:py-28"
    >
      <div className="relative">
        <p
          ref={text}
          className="text-center text-3xl leading-[1.05] tracking-tight sm:text-5xl md:w-[80%] md:text-left lg:text-7xl"
        >
          Actively participating in developing new skills and competing in
          various competitions related to my graphic design skills.
        </p>
        <img
          src={note}
          alt=""
          className="note absolute -top-6 right-0 hidden w-24 md:block lg:w-44"
        />
      </div>

      <div className="flex flex-col gap-12 md:flex-row">
        <div className="hidden md:block md:flex-2" />
        <div className="flex flex-col justify-center gap-8 md:flex-3 md:gap-12 md:pl-18 lg:pl-32">
          <h2 className="text-2xl leading-tight tracking-tight">
            Skills I acquired
          </h2>
          <div className="flex flex-row flex-wrap gap-3 md:gap-4">
            {SKILLS.map((s, i) => (
              <div
                key={s}
                className={`chip w-fit cursor-default border-2 border-black px-4 py-1.5 text-center text-sm text-black transition-colors duration-300 sm:text-base md:text-xl ${CHIP_HOVERS[i % 3]}`}
              >
                {s}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export default function App() {
  const [ready, setReady] = useState(false);

  // ScrollSmoother must exist BEFORE any ScrollTrigger is created, so the
  // sections only mount once it is ready.
  useGSAP(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    ScrollSmoother.create({
      wrapper: "#smooth-wrapper",
      content: "#smooth-content",
      smooth: reduce ? 0 : 1.2,
      effects: true,
      smoothTouch: 0.1,
    });
    setReady(true);
  }, []);

  // after the sections mount (and again once fonts load), re-measure everything
  useGSAP(
    () => {
      if (!ready) return;
      ScrollTrigger.refresh();
      document.fonts?.ready.then(() => ScrollTrigger.refresh());
    },
    { dependencies: [ready] },
  );

  return (
    <>
      {/* fixed UI lives OUTSIDE the smooth wrapper so it never gets transformed */}
      {ready && (
        <>
          <Navbar />
          <ScrollDuck />
        </>
      )}
      <div id="smooth-wrapper">
        <div id="smooth-content" className="overflow-x-clip">
          {ready && (
            <>
              <Hero />
              <About />
              <Projects />
            </>
          )}
        </div>
      </div>
    </>
  );
}
