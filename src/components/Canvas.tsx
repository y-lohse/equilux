import type { PropsWithChildren } from "react";

const Canvas: React.FC<PropsWithChildren> = ({ children }) => {
  return (
    <div className="bg-black min-h-screen w-full flex justify-center items-center font-josefin">
      <div className="h-screen w-full max-w-[70vh] min-w-0 relative">
        {children}
      </div>
    </div>
  );
};

export default Canvas;
