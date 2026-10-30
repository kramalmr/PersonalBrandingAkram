import { useRef, useState } from "react";
import { gsap, useGSAP, Draggable, InertiaPlugin } from "./gsapSetup";

/**
 * Draggable sticker powered by GSAP Draggable + InertiaPlugin (throw & glide).
 *
 * Positioning is relative to the parent's `--w` CSS variable:
 *   size -> width as a fraction of --w
 *   x    -> 1 = centre, <1 left, >1 right  (in units of --w)
 *   y    -> 0 = centre, <0 up,   >0 down   (in units of --w)
 *
 * The sticker is centred with plain CSS (left/top calculated from its size and
 * the image's real aspect ratio), NOT with GSAP xPercent/yPercent, so GSAP and
 * Draggable only ever touch x / y / scale / rotation and can never push a
 * sticker off its anchor.
 *
 * z-index: every sticker starts at z-50 and Draggable lifts the pressed one
 * above everything else (Draggable.zIndex starts at 1000).
 */
export default function DraggableImage({
  src,
  alt = "",
  size = 1,
  x = 1,
  y = 0,
  delay = 0,
}) {
  const ref = useRef(null);
  const [ratio, setRatio] = useState(1); // height / width of the image

  useGSAP(
    () => {
      const el = ref.current;

      // pop-in
      const intro = gsap.from(el, {
        scale: 0,
        rotation: gsap.utils.random(-35, 35),
        duration: 1.3,
        delay: 0.4 + delay,
        ease: "elastic.out(1, 0.55)",
      });

      // tilt with motion, settle when still
      const rotateTo = gsap.quickTo(el, "rotation", {
        duration: 0.7,
        ease: "power3",
      });

      const [drag] = Draggable.create(el, {
        type: "x,y",
        inertia: true,
        edgeResistance: 0.65,
        onPress() {
          intro.kill();
          gsap.to(el, { scale: 1.06, duration: 0.25, ease: "power2.out" });
          el.style.cursor = "grabbing";
        },
        onDrag() {
          rotateTo(gsap.utils.clamp(-20, 20, this.deltaX * 1.4));
        },
        onThrowUpdate() {
          rotateTo(
            gsap.utils.clamp(-20, 20, InertiaPlugin.getVelocity(el, "x") / 60),
          );
        },
        onThrowComplete: () => rotateTo(0),
        onRelease() {
          gsap.to(el, {
            scale: 1,
            duration: 0.7,
            ease: "elastic.out(1, 0.5)",
          });
          el.style.cursor = "grab";
        },
      });

      return () => drag.kill();
    },
    { scope: ref },
  );

  return (
    <div
      ref={ref}
      className="absolute cursor-grab select-none will-change-transform"
      style={{
        width: `calc(var(--w) * ${size})`,
        left: `calc(var(--w) * ${x - 1 - size / 2})`,
        top: `calc(var(--w) * ${y - (size * ratio) / 2})`,
        zIndex: 50,
      }}
    >
      <img
        src={src}
        alt={alt}
        draggable={false}
        onLoad={(e) =>
          setRatio(e.currentTarget.naturalHeight / e.currentTarget.naturalWidth)
        }
        className="pointer-events-none h-auto w-full drop-shadow-[0_18px_28px_rgba(0,0,0,0.18)]"
      />
    </div>
  );
}
