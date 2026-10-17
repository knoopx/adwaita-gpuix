import type { ReactNode } from "react";
import type { StyleDesc } from "@gpuix/react";
import { useAdwaita, type AdwaitaColors } from "../theme/adwaita";
import { T } from "./common";
import { Icon, type IconName } from "./icons";

export type StatusPageTone = "accent" | "destructive" | "success" | "warning";

const TONE_TINT: Record<StatusPageTone, keyof AdwaitaColors> = {
  accent: "accentTint",
  destructive: "destructiveTint",
  success: "successTint",
  warning: "warningTint",
};

const TONE_COLOR: Record<StatusPageTone, keyof AdwaitaColors> = {
  accent: "accent",
  destructive: "destructive",
  success: "success",
  warning: "warning",
};

export interface StatusPageProps {
  icon?: IconName;
  tone?: StatusPageTone;
  title: string;
  description?: string;
  children?: ReactNode;
  style?: Partial<StyleDesc>;
}

export function StatusPage({
  icon = "sparkles",
  tone = "accent",
  title,
  description,
  children,
  style,
}: StatusPageProps) {
  const t = useAdwaita();
  const { colors, radii, spacing } = t;
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: spacing.gap,
        padding: spacing.padding,
        minHeight: 160,
        ...style,
      }}
    >
      <div
        style={{
          width: 72,
          height: 72,
          borderRadius: radii.pill,
          backgroundColor: colors[TONE_TINT[tone]],
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          pointerEvents: "none",
        }}
      >
        <Icon name={icon} size={32} color={colors[TONE_COLOR[tone]]} />
      </div>
      <T size="title2" weight={700} color={colors.fg}>
        {title}
      </T>
      {description ? (
        <T
          size="body"
          color={colors.dim_fg}
          align="center"
          style={{ maxWidth: 320, whiteSpace: "normal", lineHeight: 20 }}
        >
          {description}
        </T>
      ) : null}
      {children}
    </div>
  );
}
