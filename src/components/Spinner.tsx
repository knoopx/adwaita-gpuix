import { useEffect, useMemo, useState } from "react";
import { type StyleDesc } from "@gpuix/react";
import { useAdwaita } from "../theme/adwaita";
import { type Tone, toneColor } from "../theme/tones";
import { T } from "./text";

export type SpinnerColor = Tone;

export const SPINNER_FRAMES = 12;

export function spinnerFrameSrc(
  size: number,
  ring: string,
  track: string,
  step: number,
): string {
  const r = 42;
  const sw = 12;
  const circ = 2 * Math.PI * r;
  const arc = (circ * 270) / 360;
  const rotation = -90 + (step * 360) / SPINNER_FRAMES;
  const svg =
    `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 100 100">` +
    `<circle cx="50" cy="50" r="${r}" fill="none" stroke="${track}" stroke-width="${sw}" />` +
    `<circle cx="50" cy="50" r="${r}" fill="none" stroke="${ring}" ` +
    `stroke-width="${sw}" stroke-linecap="round" ` +
    `stroke-dasharray="${arc.toFixed(1)} ${(circ - arc).toFixed(1)}" ` +
    `transform="rotate(${rotation} 50 50)" />` +
    `</svg>`;
  return `data:image/svg+xml,${encodeURIComponent(svg)}`;
}

export type SpinnerSize = 16 | 32 | 64;

export interface SpinnerProps {
  size?: SpinnerSize;

  color?: SpinnerColor;

  duration?: number;

  animated?: boolean;

  label?: boolean;
  style?: Partial<StyleDesc>;
}

export function Spinner({
  size = 32,
  color = "accent",
  duration = 1,
  animated = true,
  label = true,
  style,
}: SpinnerProps) {
  const t = useAdwaita();
  const ring = toneColor(t, color);
  const track = t.color.border.default;
  const frames = useMemo(
    () =>
      Array.from({ length: SPINNER_FRAMES }, (_, step) =>
        spinnerFrameSrc(size, ring, track, step),
      ),
    [size, ring, track],
  );
  const [step, setStep] = useState(0);

  useEffect(() => {
    if (!animated) return;
    const interval = (Math.max(duration, 0.1) * 1000) / SPINNER_FRAMES;
    const timer = setInterval(
      () => setStep((s) => (s + 1) % SPINNER_FRAMES),
      interval,
    );
    return () => clearInterval(timer);
  }, [animated, duration]);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        flexShrink: 0,
        pointerEvents: "none",
        ...style,
      }}
    >
      <img
        src={frames[step % SPINNER_FRAMES]}
        style={{
          width: size,
          height: size,
          flexShrink: 0,
          pointerEvents: "none",
        }}
      />
      {label ? (
        <T
          size="caption"
          color={t.color.text.dim}
          style={{ width: 0, height: 0, opacity: 0 }}
        >
          Loading
        </T>
      ) : null}
    </div>
  );
}
