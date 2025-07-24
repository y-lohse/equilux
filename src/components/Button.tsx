import type { PropsWithChildren } from "react";

type ButtonProps = {
  backgroundColor: string;
};

const Button: React.FC<PropsWithChildren<ButtonProps>> = ({
  backgroundColor,
  children,
}) => {
  return (
    <button
      style={{
        background: backgroundColor,
        boxShadow: `inset 0 0 0 3px ${backgroundColor}, inset 0 0 0 4px white`,
      }}
      className=" px-5 pt-3 pb-1 rounded-lg text-white text-3xl font-light uppercase border-none inline-flex justify-center items-center"
    >
      {children}
    </button>
  );
};

export default Button;
