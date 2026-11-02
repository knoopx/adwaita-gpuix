import { type StyleDesc } from "@gpuix/react";
import { type ReactNode } from "react";
import { useAdwaita } from "../theme/adwaita";

export type TextSize =
  | "display"
  | "title1"
  | "title2"
  | "title3"
  | "title4"
  | "body"
  | "list"
  | "caption"
  | "micro";

export interface TextProps {
  size?: TextSize;
  weight?: string | number;
  color?: string;
  align?: "left" | "center" | "right";
  clamp?: number;
  style?: Partial<StyleDesc>;
  children: ReactNode;
}

export function T({
  size = "body",
  weight,
  color,
  align,
  clamp,
  style,
  children,
}: TextProps) {
  const t = useAdwaita();
  return (
    <text
      style={{
        fontSize: t.type[size],

        lineHeight: t.type.lineHeight[size],
        fontFamily: t.type.fontFamily,
        fontWeight: weight,
        color: color ?? t.color.text.primary,
        textAlign: align,
        lineClamp: clamp,
        ...style,
      }}
    >
      {children}
    </text>
  );
}

export interface RoleTextProps {
  children?: ReactNode;
  size?: TextSize;
  align?: "left" | "center" | "right";
  style?: Partial<StyleDesc>;
}

export function TitleText({
  children,
  size = "title2",
  align,
  style,
}: RoleTextProps) {
  const t = useAdwaita();
  return (
    <T
      size={size}
      weight={700}
      align={align}
      color={t.color.text.primary}
      style={style}
    >
      {children}
    </T>
  );
}

export function DescriptionText({
  children,
  size = "body",
  align,
  style,
}: RoleTextProps) {
  const t = useAdwaita();
  return (
    <T size={size} align={align} color={t.color.text.dim} style={style}>
      {children}
    </T>
  );
}

export interface TextPartProps {
  size?: TextSize;
  weight?: string | number;

  dim?: boolean;
  style?: Partial<StyleDesc>;
  children: ReactNode;
}

export function TextPart({
  size = "body",
  weight,
  dim,
  style,
  children,
}: TextPartProps) {
  const t = useAdwaita();
  return (
    <T
      size={size}
      weight={weight}
      color={dim ? t.color.text.dim : t.color.text.primary}
      style={style}
    >
      {children}
    </T>
  );
}

export interface LabeledProps {
  caption: string;
  children?: ReactNode;
  style?: Partial<StyleDesc>;
}

export function Labeled({ caption, children, style }: LabeledProps) {
  const t = useAdwaita();
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 4,
        ...style,
      }}
    >
      <T size="caption" color={t.color.text.dim}>
        {caption}
      </T>
      {children}
    </div>
  );
}

export function CodeChip({
  children,
  padding = 4,
  centered = false,
  style,
}: {
  children: ReactNode;
  padding?: number;
  centered?: boolean;
  style?: Partial<StyleDesc>;
}) {
  const t = useAdwaita();
  return (
    <div
      style={{
        display: "flex",
        ...(centered ? { alignItems: "center", justifyContent: "center" } : {}),
        padding,
        borderRadius: 4,
        borderWidth: 0,
        backgroundColor: t.color.surface.button,
        ...style,
      }}
    >
      <T
        size="caption"
        color={t.color.text.primary}
        style={{ fontFamily: t.type.fontFamilyMono }}
      >
        {children}
      </T>
    </div>
  );
}
