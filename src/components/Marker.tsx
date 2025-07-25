type MarkerProps = {
  level: number;
};

const Marker: React.FC<MarkerProps> = ({ level }) => {
  return (
    <div className="w-75/100 h-75/100 bg-gradient-to-br from-rose-600 via-rose-400 to-rose-600 text-white flex items-center justify-center text-2xl rotate-45">
      <span className="-rotate-45">{level}</span>
    </div>
  );
};

export default Marker;
