import Button from "./components/Button";

const Menu: React.FC<{
  onSelect: (what: "play" | "howToPlay") => void;
}> = ({ onSelect }) => {
  return (
    <div className="w-full h-screen  bg-mat-green text-white font-josefin">
      <div className="max-w-sm h-full mx-auto p-6 flex flex-col gap-5">
        <Button
          onClick={() => onSelect("play")}
          backgroundColor={"var(--color-imperial-red)"}
        >
          Start
        </Button>
        <Button
          onClick={() => onSelect("howToPlay")}
          backgroundColor={"var(--color-violet-800)"}
        >
          How to Play
        </Button>
      </div>
    </div>
  );
};

export default Menu;
