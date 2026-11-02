import { type ReactNode } from "react";
import { type StyleDesc } from "@gpuix/react";
import {
  type AdwaitaTheme,
  accentForeground,
  useAdwaita,
} from "../theme/adwaita";
import { T } from "./text";
import { Icon, type IconName } from "./icons";

export type BadgeVariant =
  "default" | "secondary" | "destructive" | "success" | "warning" | "outline";

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
  switch (variant) {
    case "secondary":
      return {
        bg: t.color.surface.button,
        fg: t.color.text.primary,
        border: "transparent",
      };
    case "destructive":
      return {
        bg: t.color.functional.destructive,
        fg: t.color.functional.destructiveFg,
        border: "transparent",
      };
    case "success":
      return {
        bg: t.color.functional.success,
        fg: accentForeground(t.color.functional.success),
        border: "transparent",
      };
    case "warning":
      return {
        bg: t.color.functional.warning,
        fg: accentForeground(t.color.functional.warning),
        border: "transparent",
      };
    case "outline":
      return {
        bg: t.color.selection.muted,
        fg: t.color.text.primary,
        border: "transparent",
      };
    default:
      return {
        bg: t.color.accent.base,
        fg: t.color.text.onAccent,
        border: "transparent",
      };
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
    return (
      <div
        style={{
          width: d,
          height: d,
          borderRadius: d / 2,
          backgroundColor: theme.bg,
          borderWidth: 0,
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
        borderRadius: t.radius.full,
        borderWidth: 0,
        backgroundColor: theme.bg,
        flexShrink: 0,
        opacity,
        ...style,
      }}
    >
      {icon ? (
        <Icon name={icon} size={small ? 10 : 12} color={theme.fg} />
      ) : null}
      <T
        size="caption"
        weight={600}
        color={theme.fg}
        style={small ? { fontSize: 11 } : undefined}
      >
        {children}
      </T>
    </div>
  );
}
