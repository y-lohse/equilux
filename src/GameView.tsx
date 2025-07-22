import { useMachine } from "@xstate/react";
import { machine } from "./state";
import { scoreHand } from "./game";
import Tokens from "./components/Tokens";
import { useEffect, useState } from "react";

const Game: React.FC = () => {
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
    deck,
    discard,
  } = snapshot.context;

  const [selectedTokens, setSelectedTokens] = useState<number[]>([]);

  const bettingPlayer = initiative === 0 ? 1 : 0;

  const handleTokenClick = (idx: number) => {
    setSelectedTokens((prev) =>
      prev.includes(idx) ? prev.filter((i) => i !== idx) : [...prev, idx],
    );
  };

  const handleBet = () => {
    send({ type: "bet", params: { tokens: selectedTokens.length } });
    setSelectedTokens([]);
  };

  return (
    <div className="flex flex-col items-center gap-8 mt-8">
      <div className="flex gap-8 items-center mt-2 mb-2">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-gray-700">Deck:</span>
          <span className="px-2 py-1 bg-blue-100 rounded text-blue-700 font-mono">
            {deck.length}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="font-semibold text-gray-700">Discard:</span>
          <span className="px-2 py-1 bg-gray-200 rounded text-gray-700 font-mono">
            {discard.length}
          </span>
        </div>
      </div>
      {snapshot.value}

      <div className="flex flex-col items-center gap-2">
        <div className="text-lg font-bold flex items-center gap-2">
          Player 0
          <span className="ml-2 text-red-500 text-xl">
            {Array.from({ length: player0Lives })
              .map(() => "❤️")
              .join("")}
          </span>
          {initiative === 0 && (
            <span className="px-2 py-1 bg-yellow-300 rounded text-xs font-semibold">
              Initiative
            </span>
          )}
        </div>
        {snapshot.value === "betting" && bettingPlayer === 0 ? (
          <div className="flex flex-col items-center mt-4">
            <div className="text-sm mb-2">Select tokens to bet:</div>
            <div className="mb-2">
              <Tokens
                count={player0Tokens}
                selected={selectedTokens}
                color="blue"
                onToggle={handleTokenClick}
              />
            </div>
            <button
              className="px-4 py-1 bg-blue-500 text-white rounded disabled:opacity-50"
              onClick={handleBet}
            >
              Bet {selectedTokens.length}
            </button>
          </div>
        ) : (
          <Tokens
            count={player0Tokens}
            color="blue"
            selected={
              currentBet > 0 && initiative === 1
                ? Array.from({ length: currentBet }, (_, i) => i)
                : []
            }
          />
        )}
      </div>

      {/* Card display and related UI */}
      <div className="flex flex-col items-center gap-4 my-8">
        {snapshot.value === "drawing" && currentCard && (
          <div className="flex flex-col items-center gap-4">
            <div className="text-lg font-semibold">Current Card</div>
            <div className="flex items-center gap-4">
              <div className="px-4 py-2 border rounded bg-white text-xl font-mono shadow">
                {currentCard}
              </div>
              <button
                className="px-4 py-2 bg-green-500 text-white rounded"
                onClick={() => send({ type: "keep" })}
              >
                Keep
              </button>
              <button
                className="px-4 py-2 bg-gray-400 text-white rounded"
                onClick={() => send({ type: "discard" })}
              >
                Discard
              </button>
            </div>
          </div>
        )}
        {snapshot.value === "judging" && (
          <div className="flex flex-col items-center gap-4">
            <div className="text-lg font-semibold">Judging Phase</div>
            <div className="flex items-center gap-4">
              <button
                className="px-4 py-2 bg-blue-500 text-white rounded"
                onClick={() => send({ type: "hit" })}
              >
                Hit
              </button>
              <button
                className="px-4 py-2 bg-gray-500 text-white rounded"
                onClick={() => send({ type: "stay" })}
              >
                Stay
              </button>
            </div>
          </div>
        )}
        <div className="flex items-center gap-6">
          <div>
            <div className="text-md font-semibold mb-1">
              Current Hand
              <span className="ml-2 text-gray-600 text-base font-normal">
                {hand && hand.length > 0
                  ? (() => {
                      const values = scoreHand(hand).join(", ");
                      if (currentCard) {
                        const withCard = scoreHand([...hand, currentCard]).join(
                          ", ",
                        );
                        return `Value: ${values} (${withCard}?)`;
                      }
                      return `Value: ${values}`;
                    })()
                  : ""}
              </span>
            </div>
            <div className="flex gap-2">
              {hand && hand.length > 0 ? (
                hand.map((card: string, idx: number) => (
                  <div
                    key={idx}
                    className="px-3 py-1 border rounded bg-gray-50 text-base font-mono shadow"
                  >
                    {card}
                  </div>
                ))
              ) : (
                <div className="text-gray-400 italic">No cards</div>
              )}
            </div>
          </div>
          <div>
            <div className="text-md font-semibold mb-1">Draws Remaining</div>
            <div className="px-3 py-1 border rounded bg-gray-50 text-base font-mono shadow text-center">
              {snapshot.context.poolSize}
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col items-center gap-2">
        <div className="text-lg font-bold flex items-center gap-2">
          Player 1
          <span className="ml-2 text-red-500 text-xl">
            {Array.from({ length: player1Lives })
              .map(() => "❤️")
              .join("")}
          </span>
          {initiative === 1 && (
            <span className="px-2 py-1 bg-yellow-300 rounded text-xs font-semibold">
              Initiative
            </span>
          )}
        </div>
        {snapshot.value === "betting" && bettingPlayer === 1 ? (
          <div className="flex flex-col items-center mt-4">
            <div className="text-sm mb-2">Select tokens to bet:</div>
            <div className="mb-2">
              <Tokens
                count={player1Tokens}
                selected={selectedTokens}
                color="red"
                onToggle={handleTokenClick}
              />
            </div>
            <button
              className="px-4 py-1 bg-red-500 text-white rounded disabled:opacity-50"
              onClick={handleBet}
            >
              Bet {selectedTokens.length}
            </button>
          </div>
        ) : (
          <Tokens
            count={player1Tokens}
            color="red"
            selected={
              currentBet > 0 && initiative === 0
                ? Array.from({ length: currentBet }, (_, i) => i)
                : []
            }
          />
        )}
      </div>
    </div>
  );
};

export default Game;
