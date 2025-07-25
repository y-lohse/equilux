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
import DeckStack from "./components/DeckStack";
import Victory from "./components/Victory";
import { betTokens, hitOrStay, keepOrDiscard } from "./ai";

const GameView: React.FC<{
  mainPlayerIndex: number;
}> = ({ mainPlayerIndex }) => {
  const [snapshot, send] = useMachine(machine);

  const remotePlayerIndex = mainPlayerIndex === 0 ? 1 : 0;

  useEffect(
    function autoAdvance() {
      if (snapshot.can({ type: "begin" })) {
        send({ type: "begin" });
      }

      if (snapshot.matches("waiting")) {
        setTimeout(() => send({ type: "resolve" }), 2000);
      }
    },
    [snapshot, send],
  );

  useEffect(
    function AIPlays() {
      if (
        snapshot.matches("betting") &&
        snapshot.context.initiative === mainPlayerIndex
      ) {
        const bet = betTokens(snapshot, remotePlayerIndex);
        setTimeout(
          () =>
            send({
              type: "bet",
              params: { tokens: bet },
            }),
          1000,
        );
      }

      if (
        snapshot.matches("drawing") &&
        snapshot.context.initiative === remotePlayerIndex
      ) {
        const result = keepOrDiscard(snapshot, remotePlayerIndex);
        // console.log({ result });
        setTimeout(() => send({ type: result }), 1000);
      }

      if (
        snapshot.matches("judging") &&
        snapshot.context.initiative === remotePlayerIndex
      ) {
        const result = hitOrStay(snapshot, remotePlayerIndex);
        // console.log(result);
        setTimeout(() => send({ type: result }), 1000);
      }
    },
    [mainPlayerIndex, remotePlayerIndex, send, snapshot],
  );

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
  const isPlayerInitiative = initiative === mainPlayerIndex;

  const handScores = scoreHand(hand);
  const currentCardScores = currentCard ? scoreHand([currentCard]) : null;

  const isBettingPhase = snapshot.matches("betting");
  const isPlayerBetting = !isPlayerInitiative && isBettingPhase;
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

  const drawsRemaining = poolSize;
  const allowedDraws = MAX_DRAW - level;

  const isJudgingPhase = snapshot.matches("judging");

  const isFinished = snapshot.matches("end");
  const mostLives = Math.max(player0Lives, player1Lives);
  const isPlayer0Winner = player0Lives === mostLives;
  const isPlayer1Winner = player1Lives === mostLives;

  const isReadyToResolve = snapshot.matches("waiting");
  const tolerance = 3 - currentBet;
  const showCurrentBet = !isPlayerInitiative || isReadyToResolve;
  const acceptableRange: [number, number] = [21 - tolerance, 21 + tolerance];

  return (
    <Canvas>
      <Sky>
        <div
          className={`transition-all duration-500 w-12 h-12 flex items-center justify-center absolute z-10 right-4 ${initiative === 0 ? "top" : "bottom"}`}
        >
          <Marker level={level + 1} />
        </div>
        {!isFinished && <DeckStack count={drawsRemaining} />}

        <LifeSphere lives={player0Lives} position="top" />
        <Orbs
          count={player0Tokens}
          position="top"
          selected={
            isInitiativeWithPlayer1 && showCurrentBet ? tokensInPlay : []
          }
          onToggle={
            isBettingPhase && isInitiativeWithPlayer1 ? toggleToken : undefined
          }
        />
        {isFinished ? (
          <Victory>
            {isPlayer0Winner && "Player 1 wins!"}
            {isPlayer1Winner && "Player 2 wins!"}
          </Victory>
        ) : (
          <PlayArea>
            <Hand cards={hand} />

            <Score
              scores={handScores}
              potentials={currentCardScores ?? undefined}
              range={isReadyToResolve ? acceptableRange : undefined}
            />

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
                    {drawsRemaining}/{allowedDraws}
                  </span>
                </Button>
              </div>
            )}

            {isBettingPhase && (
              <Button
                onClick={confirmBet}
                backgroundColor="var(--color-imperial-red)"
                disabled={!isPlayerBetting}
              >
                bet {selectedTokens.length}
              </Button>
            )}
          </PlayArea>
        )}
        <Orbs
          count={player1Tokens}
          position="bottom"
          selected={
            showCurrentBet && isInitiativeWithPlayer0 ? tokensInPlay : []
          }
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
