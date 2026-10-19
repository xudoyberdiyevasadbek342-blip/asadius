import { Composition } from "remotion";
import { Reel, FPS, reelDuration } from "./Reel";
import namuna from "../reels/01-namuna.json";
import type { ReelProps } from "./types";

export const RemotionRoot = () => (
  <Composition
    id="Reel"
    component={Reel}
    width={1080}
    height={1920}
    fps={FPS}
    durationInFrames={reelDuration(namuna as ReelProps)}
    defaultProps={namuna as ReelProps}
    calculateMetadata={({ props }) => ({
      durationInFrames: reelDuration(props),
    })}
  />
);
