import type { CardString } from "../game";

type CardProps = {
  card: CardString;
  size?: "md" | "sm";
};

const Card: React.FC<CardProps> = ({ card, size = "md" }) => {
  const value = card.substring(0, card.length - 1);
  const suite = card[card.length - 1];
  const suiteSymbol =
    suite === "H" ? "♥" : suite === "D" ? "♦" : suite === "C" ? "♣" : "♠";

  const color =
    suiteSymbol === "♥" || suite === "♦" ? "text-imperial-red" : "text-black";

  const height = size === "sm" ? "h-[10dvh]" : "h-[20dvh]";
  const padding = size === "sm" ? "p-0.5" : "p-1";
  const valueText = size === "sm" ? "text-2xl" : "text-5xl";
  const suiteText = size === "sm" ? "text-sm" : "text-lg";
  const topLeft = size === "sm" ? "top-0.5 left-0.5" : "top-1 left-1";
  const bottomRight =
    size === "sm" ? "bottom-0.5 right-0.5" : "bottom-1 right-1";

  return (
    <div
      className={`inline-block aspect-[2.5/3.5] ${height} shrink-0 rounded-md overflow-hidden bg-gradient-to-bl from-stone-50/70 to-stone-50/30 backdrop-blur-xs ${padding} drop-shadow-md`}
    >
      <div className="w-full h-full bg-white rounded-sm flex flex-col justify-between items-stretch relative">
        <div className={`absolute ${topLeft} ${suiteText} ${color}`}>
          {suiteSymbol}
        </div>
        <div
          className={`flex flex-1 items-center justify-center ${valueText} ${color}`}
        >
          {value}
        </div>
        <div
          className={`absolute ${bottomRight} ${suiteText} rotate-180 ${color}`}
        >
          {suiteSymbol}
        </div>
      </div>
    </div>
  );
};

export default Card;
