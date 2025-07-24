import Orb from "./Orb";

type OrbsProps = {
  count: number;
  position: "top" | "bottom";
  lives: number;
};

const Orbs: React.FC<OrbsProps> = ({ count, position, lives }) => {
  const center = (count - 1) / 2;
  const base = position === "top" ? -32 : 32;
  const translateY = (lives: number) => {
    return position === "top" ? -9 + lives : 9 - lives;
  };

  return (
    <div
      className="w-full flex flex-row justify-center gap-x-28 px-12"
      style={{
        transform: `translateY(${translateY(lives)}vh)`,
      }}
    >
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          style={{
            width: "4vw",
            height: "4vw",
            transform: `translateY(${base * Math.abs(i - center)}px)`,
          }}
        >
          <Orb />
        </div>
      ))}
    </div>
  );
};

export default Orbs;
