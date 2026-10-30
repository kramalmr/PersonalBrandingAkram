import { useState, useRef } from "react";


function DraggableImage({ src, alt = "", size = 1, x = 0, y = 0 }) {
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const [dragging, setDragging] = useState(false);
  const start = useRef({ x: 0, y: 0 });

  const handlePointerDown = (e) => {
    e.currentTarget.setPointerCapture(e.pointerId);
    start.current = { x: e.clientX - pos.x, y: e.clientY - pos.y };
    setDragging(true);
  };

  const handlePointerMove = (e) => {
    if (!dragging) return;
    setPos({
      x: e.clientX - start.current.x,
      y: e.clientY - start.current.y,
    });
  };

  const handlePointerUp = (e) => {
    if (e.currentTarget.hasPointerCapture(e.pointerId)) {
      e.currentTarget.releasePointerCapture(e.pointerId);
    }
    setDragging(false);
  };

  return (
    <div
      className="absolute select-none touch-none"
      style={{
        width: `calc(var(--w) * ${size})`,
        left: `calc(var(--w) * ${x})`,
        top: `calc(var(--w) * ${y})`,
        transform: `translate(calc(-50% + ${pos.x}px), calc(-50% + ${pos.y}px)) scale(${
          dragging ? 1.05 : 1
        })`,
        filter: dragging
          ? "drop-shadow(0 20px 20px rgba(0,0,0,0.35))"
          : "drop-shadow(0 0 0 rgba(0,0,0,0))",
        cursor: dragging ? "grabbing" : "grab",
        transition: dragging
          ? "filter 0.2s ease"
          : "transform 0.2s ease, filter 0.2s ease",
        zIndex: dragging ? 20 : undefined,
      }}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
    >
      <img
        src={src}
        alt={alt}
        draggable="false"
        className="block w-full h-auto max-w-none pointer-events-none"
      />
    </div>
  );
}

export default DraggableImage;
