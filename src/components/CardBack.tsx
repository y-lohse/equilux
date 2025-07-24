import BackImage from "../assets/back.png";
const CardBack: React.FC = () => {
  return (
    <div className="inline-block h-[10dvh] aspect-[2.5/3.5] shrink-0 rounded-md overflow-hidden bg-gradient-to-bl from-stone-50/70 to-stone-50/30 backdrop-blur-xs p-0.5 drop-shadow-md">
      <div
        className="w-full h-full bg-black rounded-sm"
        style={{
          backgroundImage: `url(${BackImage})`,
          backgroundSize: "contain",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      ></div>
    </div>
  );
};

export default CardBack;
