import type { CardString } from "../game";

type CardProps = {
  card: CardString;
};

const Card: React.FC<CardProps> = ({ card }) => {
  const value = card.substring(0, card.length - 1);
  const suite = card[card.length - 1];
  const suiteSYmbol =
    suite === "H" ? "♥" : suite === "D" ? "♦" : suite === "C" ? "♣" : "♠";

  const color =
    suiteSYmbol === "♥" || suite === "♦" ? "text-imperial-red" : "text-black";
  return (
    <div className="h-[20dvh] aspect-[2.5/3.5] shrink-0 rounded-md overflow-hidden bg-gradient-to-bl from-stone-50/70 to-stone-50/30 p-1 drop-shadow-md">
      <div className="w-full h-full bg-white rounded-sm flex flex-col justify-between items-stretch relative">
        <div className={`absolute top-1 left-1 text-lg ${color}`}>
          {suiteSYmbol}
        </div>
        <div
          className={`flex flex-1 items-center justify-center text-5xl ${color}`}
        >
          {value}
        </div>
        <div
          className={`absolute bottom-1 right-1 text-lg rotate-180 ${color}`}
        >
          {suiteSYmbol}
        </div>
      </div>
    </div>
  );
};

export default Card;
