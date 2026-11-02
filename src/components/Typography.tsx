import { type ReactNode } from "react";
import { type StyleDesc } from "@gpuix/react";
import { useAdwaita } from "../theme/adwaita";
import { type TextTone, textToneColor } from "../theme/tones";
import { CodeChip, T, type TextSize } from "./text";

export type { TextTone };

const HEADING_LEVEL_SIZES: Record<1 | 2 | 3 | 4 | 5 | 6, TextSize> = {
  1: "title1",
  2: "title2",
  3: "title3",
  4: "title4",
  5: "body",
  6: "caption",
};

export interface HeadingProps {
  level?: 1 | 2 | 3 | 4 | 5 | 6;
  children: ReactNode;
  style?: Partial<StyleDesc>;
}

export function Heading({ level = 2, children, style }: HeadingProps) {
  const t = useAdwaita();
  return (
    <T
      size={HEADING_LEVEL_SIZES[level]}
      weight={700}
      color={t.color.text.primary}
      style={style}
    >
      {children}
    </T>
  );
}

export interface ParagraphProps {
  children: ReactNode;
  tone?: TextTone;
  align?: "left" | "center" | "right";
  style?: Partial<StyleDesc>;
}

export function Paragraph({
  children,
  tone = "default",
  align,
  style,
}: ParagraphProps) {
  const t = useAdwaita();
  return (
    <T size="body" color={textToneColor(t, tone)} align={align} style={style}>
      {children}
    </T>
  );
}

export interface SmallProps {
  children: ReactNode;
  tone?: TextTone;
  style?: Partial<StyleDesc>;
}

export function Small({ children, tone = "dim", style }: SmallProps) {
  const t = useAdwaita();
  return (
    <T size="caption" color={textToneColor(t, tone)} style={style}>
      {children}
    </T>
  );
}

export interface BlockquoteProps {
  children: ReactNode;
  style?: Partial<StyleDesc>;
}

export function Blockquote({ children, style }: BlockquoteProps) {
  const t = useAdwaita();
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: t.space.sm,
        padding: t.space.md,
        borderLeftWidth: 3,
        borderColor: t.color.accent.base,
        backgroundColor: t.color.surface.button,
        borderRadius: t.radius.sm,
        ...style,
      }}
    >
      <T size="body" color={t.color.text.dim} style={{ whiteSpace: "normal" }}>
        {children}
      </T>
    </div>
  );
}

export interface InlineCodeProps {
  children: ReactNode;
  style?: Partial<StyleDesc>;
}

export function InlineCode({ children, style }: InlineCodeProps) {
  return (
    <CodeChip padding={2} style={style}>
      {children}
    </CodeChip>
  );
}
