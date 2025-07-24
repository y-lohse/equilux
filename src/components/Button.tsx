import type { PropsWithChildren } from "react";

type ButtonProps = {
  backgroundColor: string;
  onClick?: () => void;
  disabled?: boolean;
};

const Button: React.FC<PropsWithChildren<ButtonProps>> = ({
  backgroundColor,
  onClick,
  disabled = false,
  children,
}) => {
  const actualColor = disabled ? "grey" : backgroundColor;
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      style={{
        background: actualColor,
        boxShadow: `inset 0 0 0 3px ${actualColor}, inset 0 0 0 4px white`,
      }}
      className=" px-5 pt-3 pb-1 rounded-lg text-white text-3xl font-light uppercase border-none inline-flex justify-center items-center"
    >
      {children}
    </button>
  );
};

export default Button;
