import GameView from "./GameView";

function App() {
  return <GameView mainPlayerIndex={Math.random() > 0.5 ? 1 : 0} />;
}

export default App;
