import { useState, useRef } from "react";

function DraggableImage({ src, alt = "", w, position}) {
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
    e.currentTarget.releasePointerCapture(e.pointerId);
    setDragging(false);
  };

  return (
    <div
      className={`absolute ${position} h-auto select-none touch-none`}
      style={{
        // scale only while dragging
        transform: `translate(calc(-50% + ${pos.x}px), calc(-50% + ${pos.y}px)) scale(${
          dragging ? 1.05 : 1
        })`,
        // shadow only while dragging
        filter: dragging
          ? "drop-shadow(0 20px 20px rgba(0,0,0,0.35))"
          : "drop-shadow(0 0 0 rgba(0,0,0,0))",
        cursor: dragging ? "grabbing" : "grab",
        // no transform transition while dragging so it follows the pointer instantly
        transition: dragging
          ? "filter 0.2s ease"
          : "transform 0.2s ease, filter 0.2s ease",
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
        width={w}
        className="h-auto pointer-events-none"
      />
    </div>
  );
}

export default DraggableImage;
