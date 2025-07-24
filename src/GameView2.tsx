import { useEffect, useState } from "react";
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
import { useMachine } from "@xstate/react";
import { machine } from "./state";
import { getDifficultyLevel, MAX_DRAW, scoreHand } from "./game";

const GameView: React.FC = () => {
  const [snapshot, send] = useMachine(machine);

  useEffect(() => {
    if (snapshot.can({ type: "begin" })) {
      send({ type: "begin" });
    }
  }, [snapshot, send]);

  const {
    player0Tokens,
    player1Tokens,
    initiative,
    player0Lives,
    player1Lives,
    currentBet,
    currentCard,
    hand,
    poolSize,
  } = snapshot.context;

  const level = getDifficultyLevel(player0Lives, player1Lives);

  const isInitiativeWithPlayer0 = initiative === 0;
  const isInitiativeWithPlayer1 = initiative === 1;

  const handScores = scoreHand(hand);
  const handScore = handScores.join("/");

  const currentCardScores = currentCard ? scoreHand([currentCard]) : null;
  const currentCardScore = currentCardScores
    ? currentCardScores.join("/")
    : null;

  const isBettingPhase = snapshot.matches("betting");
  const [selectedTokens, setSelectedTokens] = useState<number[]>([]);
  const toggleToken = (idx: number) => {
    setSelectedTokens((prev) =>
      prev.includes(idx) ? prev.filter((i) => i !== idx) : [...prev, idx],
    );
  };
  const confirmBet = () => {
    send({ type: "bet", params: { tokens: selectedTokens.length } });
    setSelectedTokens([]);
  };
  const tokensInPlay = isBettingPhase
    ? selectedTokens
    : Array.from({ length: currentBet }, (_, i) => i);

  const drawsRemaining = MAX_DRAW - level;

  const isJudgingPhase = snapshot.matches("judging");

  return (
    <Canvas>
      <Sky>
        <Marker
          position={initiative === 0 ? "top" : "bottom"}
          level={level + 1}
        />
        <LifeSphere lives={player0Lives} position="top" />
        <Orbs
          count={player0Tokens}
          position="top"
          selected={isInitiativeWithPlayer1 ? tokensInPlay : []}
          onToggle={
            isBettingPhase && isInitiativeWithPlayer1 ? toggleToken : undefined
          }
        />
        <PlayArea>
          <Hand cards={hand} />
          {handScore !== "0" && (
            <Score
              score={handScore}
              potential={currentCardScore ?? undefined}
            />
          )}
          {currentCard && (
            <CardChoice
              card={currentCard}
              onDiscard={() => send({ type: "discard" })}
              onRetain={() => send({ type: "keep" })}
            />
          )}
          {isJudgingPhase && (
            <div className="flex justify-around w-full">
              <Button
                onClick={() => send({ type: "stay" })}
                backgroundColor="var(--color-imperial-red)"
              >
                stay
              </Button>
              <Button
                onClick={() => send({ type: "hit" })}
                backgroundColor="var(--color-mat-green)"
              >
                hit
                <span className="ml-2 opacity-60">
                  {poolSize}/{drawsRemaining}
                </span>
              </Button>
            </div>
          )}
          {isBettingPhase && (
            <Button
              onClick={confirmBet}
              backgroundColor="var(--color-imperial-red)"
            >
              bet {selectedTokens.length}
            </Button>
          )}
        </PlayArea>
        <Orbs
          count={player1Tokens}
          position="bottom"
          selected={isInitiativeWithPlayer0 ? tokensInPlay : []}
          onToggle={
            isBettingPhase && isInitiativeWithPlayer0 ? toggleToken : undefined
          }
        />
        <LifeSphere lives={player1Lives} position="bottom" />
      </Sky>
    </Canvas>
  );
};

export default GameView;
