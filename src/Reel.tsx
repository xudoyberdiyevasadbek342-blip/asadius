import {
  AbsoluteFill,
  Audio,
  Sequence,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { fontFamily } from "./font";
import type { ReelProps, Slide } from "./types";

export const FPS = 30;
const DEFAULT_SECONDS = 3;

const THEMES: Record<string, [string, string, string]> = {
  binafsha: ["#7b2ff7", "#f107a3", "#ff6a00"],
  kok: ["#0052d4", "#4364f7", "#6fb1fc"],
  olov: ["#ff512f", "#dd2476", "#f09819"],
  yashil: ["#11998e", "#38ef7d", "#0b6e4f"],
  tun: ["#0f0c29", "#302b63", "#24243e"],
};

const slideFrames = (slide: Slide) =>
  Math.round((slide.seconds ?? DEFAULT_SECONDS) * FPS);

export const reelDuration = (props: ReelProps) =>
  Math.max(1, props.slides.reduce((sum, s) => sum + slideFrames(s), 0));

const Background = ({ theme }: { theme: string }) => {
  const frame = useCurrentFrame();
  const [a, b, c] = THEMES[theme] ?? THEMES.binafsha;
  const angle = 135 + frame * 0.4;
  return (
    <AbsoluteFill
      style={{ background: `linear-gradient(${angle}deg, ${a}, ${b}, ${c})` }}
    />
  );
};

const SlideView = ({ slide }: { slide: Slide }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const total = slideFrames(slide);

  const enter = spring({ frame, fps, config: { damping: 14 } });
  const emojiPop = spring({ frame: frame - 4, fps, config: { damping: 8 } });
  const exit = interpolate(frame, [total - 8, total], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill
      style={{
        justifyContent: "center",
        alignItems: "center",
        padding: 90,
        opacity: exit,
      }}
    >
      {slide.emoji && (
        <div
          style={{
            fontSize: 220,
            marginBottom: 50,
            transform: `scale(${emojiPop})`,
          }}
        >
          {slide.emoji}
        </div>
      )}
      <div
        style={{
          fontFamily,
          fontWeight: 800,
          fontSize: slide.text.length > 60 ? 72 : 96,
          lineHeight: 1.2,
          color: "white",
          textAlign: "center",
          textShadow: "0 6px 30px rgba(0,0,0,0.35)",
          transform: `translateY(${(1 - enter) * 120}px)`,
          opacity: enter,
          whiteSpace: "pre-wrap",
        }}
      >
        {slide.text}
      </div>
    </AbsoluteFill>
  );
};

const ProgressBar = () => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  return (
    <div
      style={{
        position: "absolute",
        top: 70,
        left: 60,
        right: 60,
        height: 10,
        borderRadius: 5,
        background: "rgba(255,255,255,0.3)",
      }}
    >
      <div
        style={{
          width: `${(frame / durationInFrames) * 100}%`,
          height: "100%",
          borderRadius: 5,
          background: "white",
        }}
      />
    </div>
  );
};

export const Reel = (props: ReelProps) => {
  let from = 0;
  return (
    <AbsoluteFill>
      <Background theme={props.theme ?? "binafsha"} />
      {props.slides.map((slide, i) => {
        const start = from;
        from += slideFrames(slide);
        return (
          <Sequence key={i} from={start} durationInFrames={slideFrames(slide)}>
            <SlideView slide={slide} />
          </Sequence>
        );
      })}
      <ProgressBar />
      {props.handle && (
        <div
          style={{
            position: "absolute",
            bottom: 140,
            width: "100%",
            textAlign: "center",
            fontFamily,
            fontWeight: 800,
            fontSize: 44,
            color: "rgba(255,255,255,0.85)",
          }}
        >
          {props.handle}
        </div>
      )}
      {props.music && <Audio src={staticFile(props.music)} volume={0.6} />}
    </AbsoluteFill>
  );
};
