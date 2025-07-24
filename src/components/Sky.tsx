import type { PropsWithChildren } from "react";

const Sky: React.FC<PropsWithChildren> = ({ children }) => {
  return (
    <div
      className="w-full h-full flex flex-col"
      style={{
        background:
          "linear-gradient(to bottom, #D9E9FF 0%, #8DAFFA 25%, #3A0080 75%, #1E0042 100%)",
      }}
    >
      {children}
    </div>
  );
};

export default Sky;
