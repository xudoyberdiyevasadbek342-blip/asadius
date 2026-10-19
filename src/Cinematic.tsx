import {
  AbsoluteFill,
  Audio,
  Img,
  Sequence,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { fontFamily } from "./font";
import type { ReelProps, Scene, Word } from "./types";

const FADE = 12;
const WORDS_PER_CHUNK = 3;

export const sceneFrames = (scene: Scene, fps: number) =>
  Math.round(scene.seconds * fps);

// So'zlarni 3 tadan guruhlab, subtitr bo'laklariga ajratadi
const chunkWords = (words: Word[]) => {
  const chunks: Word[][] = [];
  let current: Word[] = [];
  for (const w of words) {
    const last = current[current.length - 1];
    if (current.length >= WORDS_PER_CHUNK || (last && w.start - last.end > 0.4)) {
      chunks.push(current);
      current = [];
    }
    current.push(w);
  }
  if (current.length) chunks.push(current);
  return chunks;
};

const KenBurns = ({ scene, index, total }: { scene: Scene; index: number; total: number }) => {
  const frame = useCurrentFrame();
  const progress = frame / total;
  const scale = interpolate(progress, [0, 1], index % 2 ? [1.25, 1.08] : [1.08, 1.25]);
  const x = interpolate(progress, [0, 1], index % 3 === 1 ? [-30, 30] : [30, -30]);
  const opacity = index === 0 ? 1 : interpolate(frame, [0, FADE], [0, 1], { extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ opacity, background: "#111" }}>
      {scene.image ? (
        <Img
          src={staticFile(scene.image)}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            transform: `scale(${scale}) translateX(${x}px)`,
          }}
        />
      ) : (
        <AbsoluteFill style={{ background: "linear-gradient(160deg, #1d1a3a, #5a2d0c)" }} />
      )}
    </AbsoluteFill>
  );
};

const Subtitles = ({ words }: { words: Word[] }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;
  const chunks = chunkWords(words);
  const chunk = chunks.find((c, i) => {
    const next = chunks[i + 1];
    return t >= c[0].start && (!next || t < next[0].start);
  });
  if (!chunk) return null;

  const pop = spring({ frame: frame - Math.round(chunk[0].start * fps), fps, config: { damping: 12 } });

  return (
    <div
      style={{
        position: "absolute",
        top: "60%",
        left: 60,
        right: 60,
        display: "flex",
        flexWrap: "wrap",
        justifyContent: "center",
        columnGap: 26,
        fontFamily,
        fontWeight: 800,
        fontSize: 86,
        lineHeight: 1.15,
        textTransform: "uppercase",
        transform: `scale(${0.85 + pop * 0.15})`,
      }}
    >
      {chunk.map((w, i) => {
        const active = t >= w.start && t < (chunk[i + 1]?.start ?? Infinity);
        return (
          <span
            key={i}
            style={{
              color: active ? "#FFD400" : "white",
              WebkitTextStroke: "14px black",
              paintOrder: "stroke fill",
              textShadow: "0 8px 24px rgba(0,0,0,0.6)",
            }}
          >
            {w.text}
          </span>
        );
      })}
    </div>
  );
};

const Title = ({ text }: { text: string }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const enter = spring({ frame, fps, config: { damping: 14 } });
  return (
    <div
      style={{
        position: "absolute",
        top: 200,
        left: 70,
        right: 70,
        textAlign: "center",
        fontFamily,
        fontWeight: 800,
        fontSize: 78,
        lineHeight: 1.15,
        color: "white",
        textTransform: "uppercase",
        WebkitTextStroke: "12px black",
        paintOrder: "stroke fill",
        opacity: enter,
        transform: `translateY(${(1 - enter) * -80}px)`,
      }}
    >
      {text}
    </div>
  );
};

const ProgressBar = () => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  return (
    <div style={{ position: "absolute", top: 70, left: 60, right: 60, height: 10, borderRadius: 5, background: "rgba(255,255,255,0.3)" }}>
      <div style={{ width: `${(frame / durationInFrames) * 100}%`, height: "100%", borderRadius: 5, background: "#FFD400" }} />
    </div>
  );
};

export const Cinematic = (props: ReelProps) => {
  const { fps } = useVideoConfig();
  const scenes = props.scenes ?? [];
  let from = 0;
  const starts = scenes.map((s) => {
    const start = from;
    from += sceneFrames(s, fps);
    return start;
  });

  return (
    <AbsoluteFill style={{ background: "black" }}>
      {scenes.map((scene, i) => (
        <Sequence key={`img${i}`} from={starts[i]} durationInFrames={sceneFrames(scene, fps) + FADE}>
          <KenBurns scene={scene} index={i} total={sceneFrames(scene, fps) + FADE} />
        </Sequence>
      ))}
      <AbsoluteFill
        style={{
          background:
            "linear-gradient(to bottom, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0) 28%, rgba(0,0,0,0) 50%, rgba(0,0,0,0.7) 100%)",
        }}
      />
      {scenes.map((scene, i) => (
        <Sequence key={`txt${i}`} from={starts[i]} durationInFrames={sceneFrames(scene, fps)}>
          <Audio src={staticFile(scene.audio)} />
          <Subtitles words={scene.words} />
        </Sequence>
      ))}
      {props.title && scenes[0] && (
        <Sequence durationInFrames={sceneFrames(scenes[0], fps)}>
          <Title text={props.title} />
        </Sequence>
      )}
      <ProgressBar />
      {props.handle && (
        <div
          style={{
            position: "absolute",
            bottom: 120,
            width: "100%",
            textAlign: "center",
            fontFamily,
            fontWeight: 800,
            fontSize: 40,
            color: "rgba(255,255,255,0.8)",
          }}
        >
          {props.handle}
        </div>
      )}
      {props.music && <Audio src={staticFile(props.music)} volume={0.12} loop />}
    </AbsoluteFill>
  );
};
