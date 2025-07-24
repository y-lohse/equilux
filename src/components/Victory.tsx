import type { PropsWithChildren } from "react";

const PlayArea: React.FC<PropsWithChildren> = ({ children }) => {
  return (
    <div className="w-full flex-1 py-10 flex flex-col justify-around items-center text-white text-4xl">
      {children}
    </div>
  );
};

export default PlayArea;
