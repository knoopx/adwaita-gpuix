import type { ReactNode } from "react";
import type { StyleDesc } from "@gpuix/react";
import {
  useAdwaita,
  accentForeground,
  type AdwaitaTheme,
} from "../theme/adwaita";
import { T } from "./common";
import { Icon, type IconName } from "./icons";

export type BadgeVariant =
  | "default"
  | "secondary"
  | "destructive"
  | "success"
  | "warning"
  | "outline";

export type BadgeSize = "sm" | "md";

export interface BadgeProps {
  variant?: BadgeVariant;
  size?: BadgeSize;
  icon?: IconName;
  dot?: boolean;
  disabled?: boolean;
  children?: ReactNode;
  style?: Partial<StyleDesc>;
}

interface BadgeVariantTheme {
  bg: string;
  fg: string;
  border: string;
}

function resolveVariantTheme(
  variant: BadgeVariant,
  t: AdwaitaTheme,
): BadgeVariantTheme {
  const { colors } = t;
  switch (variant) {
    case "secondary":
      return { bg: colors.button_bg, fg: colors.fg, border: "transparent" };
    case "destructive":
      return {
        bg: colors.destructive,
        fg: colors.destructive_fg,
        border: "transparent",
      };
    case "success":
      return {
        bg: colors.success,
        fg: accentForeground(colors.success),
        border: "transparent",
      };
    case "warning":
      return {
        bg: colors.warning,
        fg: accentForeground(colors.warning),
        border: "transparent",
      };
    case "outline":
      return { bg: "transparent", fg: colors.fg, border: colors.border };
    default:
      return { bg: colors.accent, fg: colors.accent_fg, border: "transparent" };
  }
}

export function Badge({
  variant = "default",
  size = "md",
  icon,
  dot,
  disabled,
  children,
  style,
}: BadgeProps) {
  const t = useAdwaita();
  const theme = resolveVariantTheme(variant, t);
  const small = size === "sm";
  const opacity = disabled ? 0.5 : 1;

  if (dot) {
    const d = small ? 8 : 10;
    const outline = variant === "outline";
    return (
      <div
        style={{
          width: d,
          height: d,
          borderRadius: d / 2,
          backgroundColor: outline ? "transparent" : theme.bg,
          borderWidth: outline ? 2 : 0,
          borderColor: theme.fg,
          flexShrink: 0,
          opacity,
          ...style,
        }}
      />
    );
  }

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        gap: small ? 3 : 4,
        padding: small ? 3 : 4,
        paddingLeft: small ? 6 : 8,
        paddingRight: small ? 6 : 8,
        borderRadius: t.radii.pill,
        borderWidth: theme.border === "transparent" ? 0 : 1,
        borderColor: theme.border,
        backgroundColor: theme.bg,
        flexShrink: 0,
        opacity,
        ...style,
      }}
    >
      {icon ? (
        <Icon name={icon} size={small ? 10 : 12} color={theme.fg} />
      ) : null}
      <T size="caption" weight={600} color={theme.fg} style={small ? { fontSize: 11 } : undefined}>
        {children}
      </T>
    </div>
  );
}
