const Orb: React.FC<{ selected: boolean }> = ({ selected }) => {
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        borderRadius: "50%",
        background: selected
          ? "radial-gradient(circle farthest-side, white 0%, transparent 80%, white 100%)"
          : "radial-gradient(circle farthest-side, white 0%, transparent 70%)",
        boxShadow: "0 0 4px 1px rgba(255,255,255,0.9)",
      }}
    />
  );
};

export default Orb;
