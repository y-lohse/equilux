type ScoreProps = {
  scores: number[];
  potentials?: number[];
  range?: [number, number];
};

const Score: React.FC<ScoreProps> = ({ scores, potentials, range }) => {
  let scoreString = scores.join("/");
  let scoreColor = "text-black";
  const potentialsString = potentials ? potentials.join("/") : undefined;

  const min = range?.[0];
  const max = range?.[1];
  if (range) {
    const matchingScore = scores.find(
      (score) => score >= range[0] && score <= range[1],
    );
    if (matchingScore) {
      scoreString = matchingScore.toString();
      scoreColor = "text-mat-green";
    } else {
      scoreString = scores.length > 0 ? scores[0].toString() : "0";
      scoreColor = "text-imperial-red";
    }
  }

  return (
    <div
      className="flex w-full justify-center text-5xl"
      style={{
        textShadow: `1px 0 0 white,
        -1px 0 0 white,
        0 1px 0 white,
        0 -1px 0 white,
        1px 1px 0 white,
        -1px -1px 0 white,
        1px -1px 0 white,
        -1px 1px 0 white`,
      }}
    >
      {min && <span className="text-black mr-3">{min} &le;</span>}
      <span className={scoreColor}>{scoreString}</span>
      {max && <span className="text-black ml-2">&le; {max}</span>}
      {potentialsString !== undefined && (
        <span className="text-mat-green">+{potentialsString}</span>
      )}
    </div>
  );
};

export default Score;
