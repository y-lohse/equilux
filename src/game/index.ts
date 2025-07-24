type CardValue =
  | "2"
  | "3"
  | "4"
  | "5"
  | "6"
  | "7"
  | "8"
  | "9"
  | "10"
  | "J"
  | "Q"
  | "K"
  | "A";
type CardSuit = "H" | "D" | "C" | "S";
export type CardString = `${CardValue}${CardSuit}`;

export const MAX_DRAW = 7;
export const MAX_TOKENS = 3;
export const STEPS = 10;

export const scoreHand = (hand: CardString[]): number[] => {
  let scores = [0];
  for (const card of hand) {
    const value = card.slice(0, -1);
    if (value === "A") {
      scores = scores.flatMap((s) => [s + 1, s + 11]);
    } else if (["K", "Q", "J"].includes(value)) {
      scores = scores.map((s) => s + 10);
    } else {
      scores = scores.map((s) => s + Number(value));
    }
  }
  return Array.from(new Set(scores)).sort((a, b) => a - b);
};

export const getDifficultyLevel = (lives0: number, lives1: number): number => {
  return STEPS - (lives0 + lives1);
};
