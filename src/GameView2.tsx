import { useState } from "react";
import Canvas from "./components/Canvas";
import Hand from "./components/Hand";
import LifeSphere from "./components/LifeSphere";
import Marker from "./components/Marker";
import Orbs from "./components/Orbs";
import PlayArea from "./components/PlayArea";
import Score from "./components/Score";
import Sky from "./components/Sky";
import CardChoice from "./components/CardChoice";
import Button from "./components/Button";

const GameView: React.FC = () => {
  const [lives, setLives] = useState(9);
  return (
    <Canvas>
      <Sky>
        <LifeSphere lives={9} position="top" />
        <Orbs count={3} lives={9} position="top" />
        <PlayArea>
          <Hand cards={["10D", "2H"]} />
          <Score score={5} potential={2} />
          {false && <CardChoice card={"2H"} />}
          <div className="flex justify-around w-full">
            <Button backgroundColor="var(--color-imperial-red)">stay</Button>
            <Button backgroundColor="var(--color-mat-green)">
              hit
              <span className="ml-2 opacity-60">3/5</span>
            </Button>
          </div>
        </PlayArea>
        <Marker position="bottom" level={4} />
        <Orbs count={3} lives={lives} position="bottom" />
        <LifeSphere lives={lives} position="bottom" />
      </Sky>
    </Canvas>
  );
};

export default GameView;
