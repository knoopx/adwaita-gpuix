import { type StyleDesc } from "@gpuix/react";
import { useMemo } from "react";
import { useAdwaita } from "../../theme/adwaita";
import { ansiPalette } from "../../theme/tones";
import { tintOnto } from "../../theme/tokens";
import { ansiLinesOf, type AnsiSpan } from "../../lib/ansi";
import { T } from "../text";

/** How far a `dim` run moves off its colour and into the fill it sits on. */
const DIM_TOWARD_FILL = 0.45;

/**
 * The block a command's own text is read in — what a shell printed, what a test
 * runner failed on. Each line is one line the command emitted, so a line is
 * never broken across two: a line wider than the box is cut off at its edge,
 * the way a terminal cuts it off.
 *
 * The text is read as **terminal text**: the colours, weight and dim/underline a
 * command asked for are painted, and the rest of the escape grammar — cursor
 * moves, erases, titles, backgrounds — is consumed and drawn as nothing. Pass
 * `ansi={false}` to a box that has to show the bytes exactly as they arrived.
 */
export interface OutputBoxProps {
  text: string;
  tone?: "default" | "error";

  filled?: boolean;

  ansi?: boolean;

  color?: string;
  padding?: number;
  style?: Partial<StyleDesc>;
}

/**
 * Text with no terminal markup in it: one run per line, every run in the box's
 * own ink.
 */
function plainLines(text: string): AnsiSpan[][] {
  return text.split("\n").map((line) => [{ text: line, style: {} }]);
}

function spanColor(span: AnsiSpan, ink: string, fill: string): string {
  const color = span.style.fg ?? ink;
  return span.style.dim ? tintOnto(color, fill, DIM_TOWARD_FILL) : color;
}

export function OutputBox({
  text,
  tone = "default",
  filled = false,
  ansi = true,
  color,
  padding = 10,
  style,
}: OutputBoxProps) {
  const t = useAdwaita();
  const bg =
    tone === "error"
      ? t.color.functional.destructiveTint
      : filled
        ? t.color.surface.button
        : t.color.surface.card;
  const fg =
    color ??
    (tone === "error"
      ? t.color.functional.destructive
      : t.color.text.secondary);

  const lines = useMemo(
    () =>
      ansi ? ansiLinesOf(text, ansiPalette(t)) : plainLines(text),
    [text, ansi, t],
  );

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 2,
        minWidth: 0,
        padding,
        overflow: "hidden",
        borderRadius: t.radius.sm,
        borderLeftWidth: 0,
        borderColor:
          tone === "error"
            ? t.color.functional.destructive
            : t.color.border.default,
        backgroundColor: bg,
        ...style,
      }}
    >
      {lines.map((spans, i) => (
        <div
          key={i}
          style={{
            display: "flex",
            flexDirection: "row",
            minWidth: 0,
            flexShrink: 1,
            overflow: "hidden",
          }}
        >
          {spans.length === 0 ? (
            <T
              size="caption"
              color={t.color.text.dim}
              style={{
                fontFamily: t.type.fontFamilyMono,
                flexShrink: 0,
                whiteSpace: "nowrap",
              }}
            >
              {" "}
            </T>
          ) : (
            spans.map((span, j) => (
              <T
                key={j}
                size="caption"
                color={spanColor(span, fg, bg)}
                style={{
                  fontFamily: t.type.fontFamilyMono,
                  // Only the tail of a line gives way, so an over-wide line is
                  // cut at the box edge exactly where a terminal would cut it.
                  flexShrink: j === spans.length - 1 ? 1 : 0,
                  whiteSpace: "nowrap",
                  ...(span.style.bold
                    ? { fontWeight: t.type.weight.bold }
                    : {}),
                  ...(span.style.underline
                    ? { textDecoration: "underline" }
                    : {}),
                }}
              >
                {span.text}
              </T>
            ))
          )}
        </div>
      ))}
    </div>
  );
}
