import { type ReactNode } from "react";
import { type StyleDesc } from "@gpuix/react";
import { useAdwaita } from "../theme/adwaita";
import { type Tone, toneColor } from "../theme/tones";
import { DescriptionText, TitleText } from "./text";
import { GapRow } from "./Box";
import { Icon, type IconName } from "./icons";

export type EmptyTone = Tone;

export interface EmptyProps {
  children: ReactNode;
  style?: Partial<StyleDesc>;
}

export function Empty({ children, style }: EmptyProps) {
  const t = useAdwaita();
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: t.space.md,
        padding: t.space.lg,
        borderRadius: t.radius.sm,
        borderWidth: 0,
        ...style,
      }}
    >
      {children}
    </div>
  );
}

export interface EmptyMediaProps {
  icon?: IconName;
  tone?: EmptyTone;
  children?: ReactNode;
  style?: Partial<StyleDesc>;
}

export function EmptyMedia({
  icon,
  tone = "accent",
  children,
  style,
}: EmptyMediaProps) {
  const t = useAdwaita();
  return (
    <div
      style={{
        width: t.control.emptyMediaSize,
        height: t.control.emptyMediaSize,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        pointerEvents: "none",
        ...style,
      }}
    >
      {icon ? (
        <Icon
          name={icon}
          size={t.control.emptyMediaIconSize}
          color={tone === "accent" ? t.color.text.dim : toneColor(t, tone)}
        />
      ) : (
        children
      )}
    </div>
  );
}

export interface EmptyTitleProps {
  children: ReactNode;
  style?: Partial<StyleDesc>;
}

export function EmptyTitle({ children, style }: EmptyTitleProps) {
  return <TitleText style={style}>{children}</TitleText>;
}

export interface EmptyDescriptionProps {
  children: ReactNode;
  style?: Partial<StyleDesc>;
}

export function EmptyDescription({ children, style }: EmptyDescriptionProps) {
  return (
    <DescriptionText align="center" style={style}>
      {children}
    </DescriptionText>
  );
}

export interface EmptyContentProps {
  children: ReactNode;
  style?: Partial<StyleDesc>;
}

function EmptyStack({
  children,
  style,
}: {
  children: ReactNode;
  style?: Partial<StyleDesc>;
}) {
  const t = useAdwaita();
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: t.space.sm,
        ...style,
      }}
    >
      {children}
    </div>
  );
}

export function EmptyContent({ children, style }: EmptyContentProps) {
  return <EmptyStack children={children} style={style} />;
}

export interface EmptyHeaderProps {
  children: ReactNode;
  style?: Partial<StyleDesc>;
}

export function EmptyHeader({ children, style }: EmptyHeaderProps) {
  return <EmptyStack children={children} style={style} />;
}

export interface EmptyActionProps {
  children: ReactNode;
  style?: Partial<StyleDesc>;
}

export function EmptyAction({ children, style }: EmptyActionProps) {
  return <GapRow children={children} style={style} />;
}
