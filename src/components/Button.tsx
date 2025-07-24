import type { PropsWithChildren } from "react";

type ButtonProps = {
  backgroundColor: string;
  onClick?: () => void;
};

const Button: React.FC<PropsWithChildren<ButtonProps>> = ({
  backgroundColor,
  onClick,
  children,
}) => {
  return (
    <button
      onClick={onClick}
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
