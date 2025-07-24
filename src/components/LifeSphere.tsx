const LifeSphere: React.FC<{
  lives: number;
  position: "top" | "bottom";
}> = ({ lives, position }) => {
  const maxLives = 9;
  const availableSpace = 50;
  const step = availableSpace / maxLives;

  const prop = position === "top" ? "bottom" : "top";
  const justify = position === "top" ? "justify-end" : "justify-start";

  // todo: dont fixed height, but probably overflow hide, height based on lives so orbs can just auto adjust

  return (
    <div className="w-full overflow-hidden h-1/5 relative">
      <div
        className={`w-[150%] aspect-square bg-white rounded-full absolute flex flex-col ${justify} items-center`}
        style={{
          left: "-25%",
          [prop]: `${60 - lives * step}%`,
        }}
      >
        <div className=" text-stone-500 mt-2 text-3xl">{lives}</div>
      </div>
    </div>
  );
};

export default LifeSphere;
