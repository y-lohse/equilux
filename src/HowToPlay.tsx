import { useState } from "react";
import Button from "./components/Button";
import Card from "./components/Card";
import CardBack from "./components/CardBack";
import Marker from "./components/Marker";
import Orb from "./components/Orb";

const screens = [
  {
    title: "Winning the Game",
    content: (
      <div className="flex flex-col gap-3">
        <p>
          This marker designates the active player and the difficulty level.
        </p>
        <div className="w-10 h-10 m-auto">
          <Marker level={1} />
        </div>
        <p>
          When the active player wins a round, the passive player loses a life
          and the difficulty increases.
        </p>
        <div className="w-10 h-10 m-auto">
          <Marker level={2} />
        </div>
        <p>
          When the active player loses a round, the passive player wins a life,
          the difficulty decreases, and the marker is turned over.
        </p>
        <div className="w-10 h-10 m-auto">
          <Marker level={1} />
        </div>
        <p>The game ends when one player runs out of lives.</p>
      </div>
    ),
  },
  {
    title: "Playing a Round",
    content: (
      <div>
        <div className="flex justify-around mb-4">
          <div className="w-8 h-8">
            <Orb selected={false} />
          </div>
          <div className="w-8 h-8">
            <Orb selected={true} />
          </div>
          <div className="w-8 h-8">
            <Orb selected={false} />
          </div>
        </div>
        <ol className="list-decimal ml-6 mb-4">
          <li>Passive player secretly bets tokens.</li>
          <li>Active player draws a card from the deck.</li>
          <li>
            They decide whether to add the card to their hand or discard it.
          </li>
          <li>
            They can then choose to <em>hit</em> (request another card) or{" "}
            <em>stay</em> (score the current hand).
          </li>
          <li>If they hit, they draw another card and repeat steps 3-4.</li>
        </ol>
        <div className="flex justify-around mb-4">
          <CardBack />
          <CardBack />
          <CardBack />
        </div>
        <p>
          The number of hits available is determined by the difficulty level.
        </p>
      </div>
    ),
  },
  {
    title: "Scoring",
    content: (
      <>
        <p className="mb-4">Hands are scored using Blackjack rules.</p>

        <div className="mb-4">
          <div className="flex flex-row justify-between items-center mb-2">
            <div className="shrink-0">
              <Card card={"AH"} size="sm" />
            </div>
            <div className="text-right">1 or 11 points.</div>
          </div>
          <div className="flex flex-row justify-between items-center mb-2">
            <div className="shrink-0">
              <Card card={"JH"} size="sm" />
              <Card card={"QH"} size="sm" />
              <Card card={"KH"} size="sm" />
            </div>
            <div className="text-right">10 points.</div>
          </div>
          <div className="flex flex-row justify-between items-center ">
            <div className="shrink-0">
              <Card card={"2H"} size="sm" />
              <Card card={"3H"} size="sm" />
              <Card card={"4H"} size="sm" />
            </div>
            <div className="text-right">Number on the card.</div>
          </div>
        </div>

        <p className="mb-4">
          By betting tokens, the defender decides how close to 21 the attacker
          must get to win the round:
        </p>

        <div className="flex flex-row justify-between gap-4 mb-2">
          <div className="flex justify-start gap-2">
            <div className="w-6 h-6">
              <Orb selected={false} />
            </div>
            <div className="w-6 h-6">
              <Orb selected={false} />
            </div>
            <div className="w-6 h-6">
              <Orb selected={false} />
            </div>
          </div>
          <div>requires</div>
          <div className="text-2xl">21±3 points</div>
        </div>
        <div className="flex flex-row justify-between gap-4 mb-2">
          <div className="flex justify-start gap-2">
            <div className="w-6 h-6">
              <Orb selected={true} />
            </div>
            <div className="w-6 h-6">
              <Orb selected={false} />
            </div>
            <div className="w-6 h-6">
              <Orb selected={false} />
            </div>
          </div>
          <div>requires</div>
          <div className="text-2xl">21±2 points</div>
        </div>
        <div className="flex flex-row justify-between gap-4 mb-2">
          <div className="flex justify-start gap-2">
            <div className="w-6 h-6">
              <Orb selected={true} />
            </div>
            <div className="w-6 h-6">
              <Orb selected={true} />
            </div>
            <div className="w-6 h-6">
              <Orb selected={false} />
            </div>
          </div>
          <div>requires</div>
          <div className="text-2xl">21±1 points</div>
        </div>
        <div className="flex flex-row justify-between gap-4 mb-2">
          <div className="flex justify-start gap-2">
            <div className="w-6 h-6">
              <Orb selected={true} />
            </div>
            <div className="w-6 h-6">
              <Orb selected={true} />
            </div>
            <div className="w-6 h-6">
              <Orb selected={true} />
            </div>
          </div>
          <div>requires</div>
          <div className="text-2xl">21±0 points</div>
        </div>

        <p>Betted tokens are lost if the attacker wins the round.</p>
      </>
    ),
  },
];

const HowToPlay: React.FC<{
  onClose: () => void;
}> = ({ onClose }) => {
  const [screen, setScreen] = useState(0);

  return (
    <div className="w-full h-screen  bg-mat-green text-white font-josefin">
      <div className="max-w-lg h-full mx-auto p-6 flex flex-col justify-between">
        <div className="overflow-scroll">
          <h2 className="text-3xl uppercase font-light mb-4 text-center">
            {screens[screen].title}
          </h2>
          <div className="text-xl">{screens[screen].content}</div>
        </div>

        <div className="flex justify-between">
          <Button
            disabled={screen === 0}
            onClick={() => setScreen((s) => Math.max(0, s - 1))}
            backgroundColor="var(--color-imperial-red)"
          >
            Back
          </Button>
          <div className="flex gap-6 items-center">
            {screens.map((_, idx) => (
              <button
                key={idx}
                className={`w-3 h-3 rounded-full ${
                  idx === screen ? "bg-imperial-red" : "bg-gray-300"
                }`}
                onClick={() => setScreen(idx)}
                aria-label={`Go to screen ${idx + 1}`}
              />
            ))}
          </div>
          {screen < screens.length - 1 ? (
            <Button
              disabled={screen === screens.length - 1}
              onClick={() =>
                setScreen((s) => Math.min(screens.length - 1, s + 1))
              }
              backgroundColor="var(--color-imperial-red)"
            >
              Next
            </Button>
          ) : (
            <Button
              onClick={onClose}
              backgroundColor="var(--color-imperial-red)"
            >
              Play
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default HowToPlay;
