import { Composition } from "remotion";
import { Reel, FPS, reelDuration } from "./Reel";
import type { ReelProps } from "./types";

const namuna: ReelProps = { slides: [{ emoji: "🎬", text: "asadius" }] };

export const RemotionRoot = () => (
  <Composition
    id="Reel"
    component={Reel}
    width={1080}
    height={1920}
    fps={FPS}
    durationInFrames={reelDuration(namuna)}
    defaultProps={namuna}
    calculateMetadata={({ props }) => ({
      durationInFrames: reelDuration(props),
    })}
  />
);
