import Orb from "./Orb";

type OrbsProps = {
  count: number;
  position: "top" | "bottom";
  selected: number[];
  onToggle?: (index: number) => void;
};

const Orbs: React.FC<OrbsProps> = ({ count, position, selected, onToggle }) => {
  const center = (count - 1) / 2;
  const base = position === "top" ? -20 : 20;

  return (
    <div className="w-full flex flex-row justify-center gap-x-28 px-12">
      {Array.from({ length: count }).map((_, i) => (
        <button
          key={i}
          style={{
            width: "4vw",
            height: "4vw",
            transform: `translateY(${-base + base * Math.abs(i - center)}px)`,
          }}
          onClick={() => onToggle?.(i)}
        >
          <Orb selected={selected.includes(i)} />
        </button>
      ))}
    </div>
  );
};

export default Orbs;
