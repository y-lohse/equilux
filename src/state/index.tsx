import { setup, assign, raise } from "xstate";
import {
  type CardString,
  getDifficultyLevel,
  MAX_DRAW,
  MAX_TOKENS,
  scoreHand,
  STEPS,
} from "../game";

export const machine = setup({
  types: {
    context: {} as {
      initiative: number;
      poolSize: number;
      player0Tokens: number;
      player0Lives: number;
      player1Tokens: number;
      player1Lives: number;
      currentBet: number;
      currentCard: CardString | null;
      deck: CardString[];
      discard: CardString[];
      hand: CardString[];
    },
    events: {} as
      | { type: "bet"; params: { tokens: number } }
      | { type: "win" }
      | { type: "stay" }
      | { type: "begin" }
      | { type: "lose" }
      | { type: "resolve" }
      | { type: "hit" }
      | { type: "keep" }
      | { type: "discard" },
  },
  actions: {
    initPoolSize: assign({
      poolSize: ({ context }) => {
        const diff = getDifficultyLevel(
          context.player0Lives,
          context.player1Lives,
        );
        return Math.max(MAX_DRAW - diff, 2);
      },
    }),
    drawCard: assign(({ context }) => {
      const { deck, poolSize, discard } = context;

      const newPoolSize = Math.max(poolSize - 1, 0);
      const cardIndex = Math.floor(Math.random() * deck.length);
      const newCard = deck[cardIndex];
      const newDeck = deck.filter((_, index) => index !== cardIndex);
      const newDiscard = discard.slice();

      if (newDeck.length === 0) {
        newDeck.push(...newDiscard);
        newDiscard.length = 0;
      }

      return {
        poolSize: newPoolSize,
        currentCard: newCard,
        deck: newDeck,
        discard: newDiscard,
      };
    }),
    resolveHand: raise(({ context }) => {
      const hand = context.hand;
      const tolerance = 3 - context.currentBet;
      const scores = scoreHand(hand);
      const minScore = 21 - tolerance;
      const maxScore = 21 + tolerance;
      const hasWinningScore = scores.some(
        (score) => score >= minScore && score <= maxScore,
      );

      return {
        type: hasWinningScore ? ("win" as const) : ("lose" as const),
      };
    }),
    discardHand: assign(({ context }) => {
      const newDiscard = [...context.discard, ...context.hand];

      return {
        discard: newDiscard,
        hand: [],
      };
    }),
    placeBet: assign({
      currentBet: ({ context, event }) =>
        event.type === "bet" ? event.params.tokens : context.currentBet,
    }),
    winLife: assign(({ context }) => {
      const hasHitMaxLives =
        context.player0Lives + context.player1Lives >= STEPS;
      if (hasHitMaxLives) return {};

      const targetPlayerLives =
        context.initiative === 1 ? "player0Lives" : "player1Lives";
      return {
        [targetPlayerLives]: context[targetPlayerLives] + 1,
      };
    }),
    loseLife: assign(({ context }) => {
      const targetPlayerLives =
        context.initiative === 1 ? "player0Lives" : "player1Lives";

      return {
        [targetPlayerLives]: context[targetPlayerLives] - 1,
      };
    }),
    turnOver: assign({
      initiative: ({ context }) => (context.initiative === 0 ? 1 : 0),
    }),
    checkBlackJack: assign(({ context }) => {
      const { hand } = context;
      const hasBlackJack = hand.length === 2 && scoreHand(hand).includes(21);
      if (!hasBlackJack) return {};

      // other player looses a token
      const targetPlayerTokens =
        context.initiative === 1 ? "player0Tokens" : "player1Tokens";
      return {
        [targetPlayerTokens]: Math.min(
          context[targetPlayerTokens] - 1,
          MAX_TOKENS,
        ),
      };
    }),
    loseBet: assign({
      player0Tokens: ({ context }) =>
        context.initiative === 1
          ? Math.max(context.player0Tokens - context.currentBet, 0)
          : context.player0Tokens,
      player1Tokens: ({ context }) =>
        context.initiative === 0
          ? Math.max(context.player1Tokens - context.currentBet, 0)
          : context.player1Tokens,
    }),
    keepCard: assign({
      hand: ({ context }) => {
        if (context.currentCard) context.hand.push(context.currentCard);
        return context.hand;
      },
      currentCard: () => null,
    }),
    discardCard: assign({
      discard: ({ context }) => {
        if (context.currentCard) context.discard.push(context.currentCard);
        return context.discard;
      },
      currentCard: () => null,
    }),
  },
  guards: {
    victoryScore: function ({ context }) {
      return context.player0Lives === 0 || context.player1Lives === 0;
    },
    poolEmpty: function ({ context }) {
      return context.poolSize === 0;
    },
  },
}).createMachine({
  context: {
    initiative: 0,
    poolSize: 0,
    player0Tokens: 3,
    player0Lives: 4,
    player1Tokens: 3,
    player1Lives: 4,
    currentBet: 0,
    currentCard: null,
    // prettier-ignore
    deck: [
      "2C", "2D", "2H", "2S",
      "3C", "3D", "3H", "3S",
      "4C", "4D", "4H", "4S",
      "5C", "5D", "5H", "5S",
      "6C", "6D", "6H", "6S",
      "7C", "7D", "7H", "7S",
      "8C", "8D", "8H", "8S",
      "9C", "9D", "9H", "9S",
      "10C", "10D", "10H", "10S",
      "JC", "JD", "JH", "JS",
      "QC", "QD", "QH", "QS",
      "KC", "KD", "KH", "KS",
      "AC", "AD", "AH", "AS",
    ],
    discard: [],
    hand: [],
  },
  id: "Equilux",
  initial: "setup",
  states: {
    setup: {
      on: {
        begin: {
          target: "betting",
        },
      },
    },
    betting: {
      on: {
        bet: {
          target: "drawing",
          actions: {
            type: "placeBet",
            params: {
              tokens: 0,
            },
          },
        },
      },
      entry: {
        type: "initPoolSize",
      },
    },
    drawing: {
      on: {
        keep: {
          target: "judging",
          actions: {
            type: "keepCard",
          },
        },
        discard: {
          target: "judging",
          actions: {
            type: "discardCard",
          },
        },
      },
      entry: {
        type: "drawCard",
      },
    },
    judging: {
      on: {
        stay: {
          target: "waiting",
        },
        hit: {
          target: "drawing",
        },
      },
      always: {
        target: "waiting",
        guard: {
          type: "poolEmpty",
        },
      },
    },
    waiting: {
      on: {
        resolve: {
          target: "resolving",
          actions: {
            type: "resolveHand",
          },
        },
      },
    },
    resolving: {
      on: {
        win: {
          target: "scoring",
          actions: [
            { type: "checkBlackJack" },
            { type: "discardHand" },
            {
              type: "loseLife",
            },
            {
              type: "loseBet",
            },
          ],
        },
        lose: {
          target: "betting",
          actions: [
            { type: "discardHand" },
            {
              type: "winLife",
            },
            {
              type: "turnOver",
            },
          ],
        },
      },
    },
    scoring: {
      always: [
        {
          target: "end",
          guard: {
            type: "victoryScore",
          },
        },
        {
          target: "betting",
        },
      ],
    },
    end: {
      type: "final",
    },
  },
});
