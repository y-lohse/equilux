import type { PropsWithChildren } from "react";

const PlayArea: React.FC<PropsWithChildren> = ({ children }) => {
  return (
    <div className="w-full flex-1 flex flex-col justify-around items-center">
      {children}
    </div>
  );
};

export default PlayArea;
