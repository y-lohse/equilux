import CardBack from "./CardBack";

const DeckStack: React.FC<{ count: number }> = ({ count }) => {
  return (
    <div className="h-0 leading-0 absolute top-45/100 right-1">
      {Array.from({ length: count }, (_, i) => (
        <div
          key={i}
          style={{
            transform: `translateY(-${i * 80}%)`,
          }}
        >
          <CardBack />
        </div>
      ))}
    </div>
  );
};

export default DeckStack;
