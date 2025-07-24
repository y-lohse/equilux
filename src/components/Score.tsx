type ScoreProps = {
  score: string | number;
  potential?: string | number;
};

const Score: React.FC<ScoreProps> = ({ score, potential }) => {
  return (
    <div className="flex w-full justify-center text-5xl">
      <span
        className="text-black"
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
        {score}
      </span>
      {potential !== undefined && (
        <span
          className="text-mat-green"
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
          +{potential}
        </span>
      )}
    </div>
  );
};

export default Score;
