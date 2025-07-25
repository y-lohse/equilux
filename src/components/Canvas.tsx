import type { PropsWithChildren } from "react";

const Canvas: React.FC<PropsWithChildren> = ({ children }) => {
  return (
    <div className="bg-black min-h-screen w-full flex justify-center items-center font-josefin">
      <div className="h-screen aspect-[2.5/3.5] max-w-[70vh] min-w-0 relative overflow-hidden">
        {children}
      </div>
    </div>
  );
};

export default Canvas;
