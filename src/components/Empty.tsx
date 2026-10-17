import type { ReactNode } from "react";
import type { StyleDesc } from "@gpuix/react";
import { useAdwaita, type AdwaitaColors } from "../theme/adwaita";
import { T, GapRow } from "./common";
import { Icon, type IconName } from "./icons";

export type EmptyTone = "accent" | "destructive" | "success" | "warning";

const TONE_TINT: Record<EmptyTone, keyof AdwaitaColors> = {
  accent: "accentTint",
  destructive: "destructiveTint",
  success: "successTint",
  warning: "warningTint",
};

const TONE_COLOR: Record<EmptyTone, keyof AdwaitaColors> = {
  accent: "accent",
  destructive: "destructive",
  success: "success",
  warning: "warning",
};

export interface EmptyProps {
  children: ReactNode;
  style?: Partial<StyleDesc>;
}

export function Empty({ children, style }: EmptyProps) {
  const t = useAdwaita();
  const { colors, radii, spacing } = t;
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: spacing.paddingTight,
        padding: spacing.padding,
        borderRadius: radii.card,
        borderWidth: 1,
        borderColor: colors.border,
        backgroundColor: colors.view_bg,
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
  const { colors, radii } = t;
  return (
    <div
      style={{
        width: 48,
        height: 48,
        borderRadius: radii.pill,
        backgroundColor: colors[TONE_TINT[tone]],
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        pointerEvents: "none",
        ...style,
      }}
    >
      {icon ? (
        <Icon name={icon} size={24} color={colors[TONE_COLOR[tone]]} />
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
  const t = useAdwaita();
  return (
    <T size="title2" weight={700} color={t.colors.fg} style={style}>
      {children}
    </T>
  );
}

export interface EmptyDescriptionProps {
  children: ReactNode;
  style?: Partial<StyleDesc>;
}

export function EmptyDescription({ children, style }: EmptyDescriptionProps) {
  const t = useAdwaita();
  return (
    <T
      size="body"
      color={t.colors.dim_fg}
      align="center"
      style={style}
    >
      {children}
    </T>
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
        gap: t.spacing.gap,
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
