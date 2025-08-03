import type { ReactNode } from "react";

interface TooltipProps {
  children: ReactNode;
  content: string;
  position?: "top" | "bottom" | "left" | "right";
}

function Tooltip({ children, content, position = "top" }: TooltipProps) {
  const positionClasses = {
    top: "bottom-full left-1/2 -translate-x-1/2 mb-1",
    bottom: "top-full left-1/2 -translate-x-1/2 mt-1",
    left: "right-full top-1/2 -translate-y-1/2 mr-1",
    right: "left-full top-1/2 -translate-y-1/2 ml-1",
  };

  return (
    <div className="relative group inline-block">
      {children}
      <div
        className={`absolute z-10 hidden group-hover:block bg-black text-white text-sm rounded px-2 py-1 whitespace-pre-wrap w-max max-w-xs shadow-lg ${positionClasses[position]}`}
      >
        {content}
      </div>
    </div>
  );
}

export default Tooltip;
