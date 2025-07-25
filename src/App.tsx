import { useState } from "react";
import GameView from "./GameView";
import HowToPlay from "./HowToPlay";
import Menu from "./Menu";

const App = () => {
  const [currentView, setCurrentView] = useState<"menu" | "howToPlay" | "play">(
    "menu",
  );

  if (currentView === "howToPlay") {
    return <HowToPlay onClose={() => setCurrentView("menu")} />;
  }
  if (currentView === "play") {
    return (
      <GameView
        mainPlayerIndex={Math.random() > 0.5 ? 1 : 0}
        onClose={() => setCurrentView("menu")}
      />
    );
  }
  if (currentView === "menu") {
    return <Menu onSelect={setCurrentView} />;
  }
};

export default App;
