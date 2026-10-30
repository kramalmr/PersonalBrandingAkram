import { useRef } from "react";
import { gsap, useGSAP, ScrollTrigger } from "./gsapSetup";
import duckImg from "./assets/duck.png";

// Scroll indicator: your rubber duck rides down a thin track on the left edge.
// The track fills with your three theme colours, and the duck tilts with
// scroll speed.
export default function ScrollDuck() {
  const root = useRef(null);

  useGSAP(
    () => {
      const track = root.current.querySelector(".sd-track");
      const duck = root.current.querySelector(".sd-duck");
      const fill = root.current.querySelector(".sd-fill");

      gsap.set(fill, { scaleY: 0, transformOrigin: "top" });
      gsap.set(duck, { y: 0 });

      const moveY = gsap.quickTo(duck, "y", { duration: 0.4, ease: "power3" });
      const tilt = gsap.quickTo(duck, "rotation", { duration: 0.5, ease: "power3" });
      const grow = gsap.quickTo(fill, "scaleY", { duration: 0.4, ease: "power3" });

      let t;
      ScrollTrigger.create({
        start: 0,
        end: "max",
        onUpdate(self) {
          moveY(self.progress * track.clientHeight);
          grow(self.progress);
          tilt(gsap.utils.clamp(-25, 25, self.getVelocity() / -150));
          clearTimeout(t);
          t = setTimeout(() => tilt(0), 120);
        },
      });

      return () => clearTimeout(t);
    },
    { scope: root },
  );

  return (
    <div
      ref={root}
      aria-hidden="true"
      className="pointer-events-none fixed left-2 top-1/2 z-[90] h-[36vh] -translate-y-1/2 md:left-4"
    >
      <div className="sd-track relative h-full w-1.5 rounded-full bg-black/15">
        <div className="sd-fill absolute inset-0 rounded-full bg-linear-to-b from-[#DE7272] via-[#B4E4D6] to-[#FFCA88]" />
        <img
          src={duckImg}
          alt=""
          className="sd-duck absolute -left-[11px] -top-3.5 w-7 drop-shadow-md"
        />
      </div>
    </div>
  );
}
