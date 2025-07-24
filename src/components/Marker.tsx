type MarkerProps = {
  level: number;
  position: "top" | "bottom";
};

const Marker: React.FC<MarkerProps> = ({ level, position }) => {
  const verticalPosition = position === "top" ? "top-2" : "bottom-2";
  return (
    <div
      className={`w-12 h-12 flex items-center justify-center absolute z-10 right-4 ${verticalPosition}`}
    >
      <div className="w-75/100 h-75/100 bg-gradient-to-br from-rose-600 via-rose-400 to-rose-600 text-white flex items-center justify-center text-2xl rotate-45">
        <span className="-rotate-45">{level}</span>
      </div>
    </div>
  );
};

export default Marker;
