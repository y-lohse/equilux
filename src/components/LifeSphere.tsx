const LifeSphere: React.FC<{
  lives: number;
  position: "top" | "bottom";
}> = ({ lives, position }) => {
  const prop = position === "top" ? "bottom" : "top";
  const justify = position === "top" ? "justify-end" : "justify-start";

  return (
    <div
      className={`w-full overflow-hidden relative`}
      style={{
        height: `${9 + lives}dvh`,
      }}
    >
      <div
        className={`w-[150%] aspect-square bg-stone-200 rounded-full absolute flex flex-col ${justify} items-center`}
        style={{
          left: "-25%",
          [prop]: 0,
        }}
      >
        <div className=" text-stone-500 mt-2 text-4xl">{lives}</div>
      </div>
    </div>
  );
};

export default LifeSphere;
