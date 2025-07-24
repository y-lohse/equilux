import type { CardString } from "../game";
import Card from "./Card";

type HandProps = {
  cards: CardString[];
};

const Hand: React.FC<HandProps> = ({ cards }) => {
  return (
    <div
      className="w-full grid justify-center gap-2 overflow-hidden"
      style={{
        gridTemplateColumns: "repeat(auto-fit,  minmax(1%, max-content))",
      }}
    >
      {cards.map((card) => (
        <Card key={card} card={card} />
      ))}
    </div>
  );
};

export default Hand;
