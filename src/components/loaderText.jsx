import Text3DFlip from "./ui/text-3d-flip";

export function LoaderText() {
  return (
    <Text3DFlip
      className="scenario-loader-text font-serif"
      textClassName="text-foreground text-sm"
      flipTextClassName="text-foreground text-sm"
      rotateDirection="top"
      autoPlay
      autoPlayInterval={2200}
      staggerDuration={0.03}
      staggerFrom="first"
      transition={{ type: "spring", damping: 25, stiffness: 160 }}
    >
      We are getting the best results for you...
    </Text3DFlip>
  );
}

export function Text3DFlipDemo() {
  return <LoaderText />;
}
