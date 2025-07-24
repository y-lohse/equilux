import type { CardString } from "../game";
import Card from "./Card";

type CardChoiceProps = {
  card: CardString;
};

const CardChoice: React.FC<CardChoiceProps> = ({ card }) => {
  return (
    <div className="w-full flex flex-row items-center justify-center relative overflow-hidden">
      <div
        className="absolute left-0 flex items-center h-full"
        style={{ transform: "translateX(-70%)" }}
      >
        <button
          className="h-full pl-28 pr-4 flex flex-col justify-center items-center bg-imperial-red text-white rounded-md"
          style={{
            boxShadow:
              "0 0 0 5px var(--color-imperial-red) inset, 0 0 0 6px white inset",
          }}
        >
          {"DISCARD".split("").map((char, i) => (
            <span key={i} className="leading-none">
              {char}
            </span>
          ))}
        </button>
      </div>
      <div className="flex-1 flex justify-center items-center">
        <Card card={card} />
      </div>
      <div
        className="absolute right-0 flex items-center h-full"
        style={{ transform: "translateX(70%)" }}
      >
        <button
          className="h-full pr-28 pl-4  flex flex-col justify-center items-center bg-mat-green text-white rounded-md"
          style={{
            boxShadow:
              "0 0 0 5px var(--color-mat-green) inset, 0 0 0 6px white inset",
          }}
        >
          {"RETAIN".split("").map((char, i) => (
            <span key={i} className="leading-none">
              {char}
            </span>
          ))}
        </button>
      </div>
    </div>
  );
};

export default CardChoice;
