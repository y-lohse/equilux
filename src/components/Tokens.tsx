import React from "react";

type TokensProps = {
  count: number;
  selected?: number[];
  color: "blue" | "red";
  onToggle?: (idx: number) => void;
};

const colorMap = {
  blue: {
    base: "bg-blue-400",
    selected: "bg-blue-600 border-blue-800",
    unselected: "bg-blue-200 border-blue-400",
  },
  red: {
    base: "bg-red-400",
    selected: "bg-red-600 border-red-800",
    unselected: "bg-red-200 border-red-400",
  },
};

const Tokens: React.FC<TokensProps> = ({
  count,
  selected = [],
  color,
  onToggle,
}) => {
  return (
    <div className="flex gap-2">
      {Array.from({ length: count }).map((_, i) => (
        <button
          key={i}
          type="button"
          className={`w-6 h-6 rounded-full border-2 transition ${
            selected.includes(i)
              ? colorMap[color].selected
              : colorMap[color].unselected
          }`}
          onClick={onToggle ? () => onToggle(i) : undefined}
          disabled={!onToggle}
        />
      ))}
    </div>
  );
};

export default Tokens;
