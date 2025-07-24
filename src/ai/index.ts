/**

AI actions:
- bet tokens
- retain or discard currernt card
- stay or hit

 */

import type { SnapshotFrom } from "xstate";
import { machine } from "../state";
import { MAX_DRAW, MAX_TOKENS, scoreHand, STEPS } from "../game";
import { clamp } from "lodash";

type Snapshot = SnapshotFrom<typeof machine>;

export const betTokens = (snapshot: Snapshot, aiIndex: number): number => {
  const tokens =
    aiIndex === 0
      ? snapshot.context.player0Tokens
      : snapshot.context.player1Tokens;
  const lives =
    aiIndex === 0
      ? snapshot.context.player0Lives
      : snapshot.context.player1Lives;
  const availableDraws = snapshot.context.poolSize;
  const maxLives = Math.floor(STEPS / 2); // not accurate, but should avoid AI panick

  const successChance = availableDraws / MAX_DRAW;
  const invertedSuccessChance = 1 - successChance;

  const urgency = 1 - Math.min(lives, maxLives) / maxLives;

  let aggression = invertedSuccessChance * 0.2 + urgency * 0.8;
  aggression = clamp(aggression, 0, 1);

  const minAgression = 0.4;

  let bet = aggression >= minAgression ? Math.round(aggression * tokens) : 0;
  bet = Math.max(0, Math.min(bet, tokens, MAX_TOKENS));
  return bet;
};

export const keepOrDiscard = (
  snapshot: Snapshot,
  aiIndex: number,
): "keep" | "discard" => {
  // Estimate opponent bet using AI's own logic
  const estimatedBet = betTokens(snapshot, aiIndex === 0 ? 1 : 0);

  const SIMULATIONS = 500;

  const availableDraws = snapshot.context.poolSize;
  const hand = snapshot.context.hand.slice();
  const deck = snapshot.context.deck.slice();
  const discard = snapshot.context.discard.slice();
  const currentCard = snapshot.context.currentCard;

  // Map bet to tolerance
  const tolerance = 3 - estimatedBet;
  const minScore = 21 - tolerance;
  const maxScore = 21 + tolerance;

  // Helper to run simulations
  function simulate(retain: boolean): number {
    let wins = 0;
    for (let i = 0; i < SIMULATIONS; i++) {
      const simHand = hand.slice();
      let simDeck = deck.slice();
      let simDiscard = discard.slice();
      let drawsLeft = availableDraws;

      if (retain && currentCard) {
        simHand.push(currentCard);
        drawsLeft--;
        const idx = simDeck.indexOf(currentCard);
        if (idx !== -1) simDeck.splice(idx, 1);
      } else if (currentCard) {
        drawsLeft--;
        const idx = simDeck.indexOf(currentCard);
        if (idx !== -1) simDeck.splice(idx, 1);
      }

      for (let j = 0; j < drawsLeft; j++) {
        if (simDeck.length === 0 && simDiscard.length > 0) {
          simDeck = simDiscard.slice();
          simDiscard = [];
        }
        if (simDeck.length === 0) break;
        const cardIdx = Math.floor(Math.random() * simDeck.length);
        simHand.push(simDeck[cardIdx]);
        simDeck.splice(cardIdx, 1);
      }

      const scores = scoreHand(simHand);
      if (
        scores.some((score: number) => score >= minScore && score <= maxScore)
      ) {
        wins++;
      }
    }
    return wins;
  }

  const retainWins = simulate(true);
  const discardWins = simulate(false);

  // console.log({ retainWins, discardWins });
  return retainWins >= discardWins ? "keep" : "discard";
};

export const hitOrStay = (
  snapshot: Snapshot,
  aiIndex: number,
): "hit" | "stay" => {
  const SIMULATIONS = 500;
  const { hand, deck, discard, poolSize } = snapshot.context;

  // Estimate opponent's bet and tolerance
  const opponentIndex = aiIndex === 0 ? 1 : 0;
  const estimatedBet = betTokens(snapshot, opponentIndex);
  const tolerance = 3 - estimatedBet;

  const minScore = 21 - tolerance;
  const maxScore = 21 + tolerance;

  // Simulate staying: just score the current hand
  const stayScores = scoreHand(hand);
  const stayWin = stayScores.some(
    (score) => score >= minScore && score <= maxScore,
  )
    ? 1
    : 0;

  // Simulate hitting: draw one more card, then fill out the rest randomly
  let hitWins = 0;
  for (let i = 0; i < SIMULATIONS; i++) {
    const simHand = hand.slice();
    let simDeck = deck.slice();
    let simDiscard = discard.slice();
    let drawsLeft = poolSize;

    if (simDeck.length > 0 && drawsLeft > 0) {
      const idx = Math.floor(Math.random() * simDeck.length);
      simHand.push(simDeck[idx]);
      simDeck.splice(idx, 1);
      drawsLeft--;
    } else if (simDeck.length === 0 && simDiscard.length > 0 && drawsLeft > 0) {
      simDeck = simDiscard.slice();
      simDiscard = [];
      const idx = Math.floor(Math.random() * simDeck.length);
      simHand.push(simDeck[idx]);
      simDeck.splice(idx, 1);
      drawsLeft--;
    }

    for (let j = 0; j < drawsLeft; j++) {
      if (simDeck.length === 0 && simDiscard.length > 0) {
        simDeck = simDiscard.slice();
        simDiscard = [];
      }
      if (simDeck.length === 0) break;
      const cardIdx = Math.floor(Math.random() * simDeck.length);
      simHand.push(simDeck[cardIdx]);
      simDeck.splice(cardIdx, 1);
    }

    const scores = scoreHand(simHand);
    if (scores.some((score) => score >= minScore && score <= maxScore)) {
      hitWins++;
    }
  }

  const hitWinRate = hitWins / SIMULATIONS;
  const stayWinRate = stayWin;

  // console.log({ hitWinRate });
  return hitWinRate > stayWinRate ? "hit" : "stay";
};
