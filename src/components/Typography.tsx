import type { ReactNode } from "react";
import type { StyleDesc } from "@gpuix/react";
import { useAdwaita, type AdwaitaTheme } from "../theme/adwaita";
import { CodeChip, T, type TextSize } from "./common";


export type TextTone =
  | "default"
  | "dim"
  | "accent"
  | "destructive"
  | "success"
  | "warning";

function toneColor(t: AdwaitaTheme, tone: TextTone): string {
  const { colors } = t;
  return {
    default: colors.fg,
    dim: colors.dim_fg,
    accent: colors.accent,
    destructive: colors.destructive,
    success: colors.success,
    warning: colors.warning,
  }[tone];
}


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
      color={t.colors.fg}
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
    <T size="body" color={toneColor(t, tone)} align={align} style={style}>
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
    <T size="caption" color={toneColor(t, tone)} style={style}>
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
  const { colors, radii, spacing } = t;
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: spacing.gap,
        padding: spacing.paddingTight,
        borderLeftWidth: 3,
        borderColor: colors.accent,
        backgroundColor: colors.button_bg,
        borderRadius: radii.button,
        ...style,
      }}
    >
      <T size="body" color={colors.dim_fg} style={{ whiteSpace: "normal" }}>
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
