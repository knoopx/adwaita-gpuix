import { type ReactNode } from "react";
import { type StyleDesc } from "@gpuix/react";
import {
  type AdwaitaTheme,
  hexToRgba,
  isDarkScheme,
  shade,
  useAdwaita,
} from "../theme/adwaita";
import { disabledStyle } from "./disabled.ts";
import { T } from "./text";
import { Icon, type IconName } from "./icons";

export type ButtonVariant =
  | "default"
  | "suggested"
  | "destructive"
  | "pill"
  | "text"
  | "icon"
  | "secondary";

export type ButtonSize = "sm" | "default" | "lg" | "icon";

const BUTTON_SIZE_HEIGHT: Record<ButtonSize, number> = {
  sm: 28,
  default: 34,
  lg: 40,
  icon: 34,
};

export interface ButtonProps {
  variant?: ButtonVariant;

  size?: ButtonSize;

  shape?: "square" | "circle";
  label?: string;
  icon?: IconName;

  trailingIcon?: IconName;
  onClick?: () => void;
  disabled?: boolean;
  children?: ReactNode;
  style?: Partial<StyleDesc>;
}

interface ButtonVariantTheme {
  bg: string;
  fg: string;
  hoverBg: string;
  activeBg: string;
  border: string;
}

function resolveVariantTheme(
  variant: ButtonVariant,
  t: AdwaitaTheme,
): ButtonVariantTheme {
  switch (variant) {
    case "suggested":
      return {
        bg: t.color.accent.base,
        fg: t.color.text.onAccent,
        hoverBg: shade(t.color.accent.base, -0.08),
        activeBg: shade(t.color.accent.base, -0.18),
        border: t.color.border.default,
      };
    case "destructive":
      return {
        bg: t.color.functional.destructive,
        fg: t.color.functional.destructiveFg,
        hoverBg: shade(t.color.functional.destructive, -0.08),
        activeBg: shade(t.color.functional.destructive, -0.18),
        border: t.color.border.default,
      };
    case "text":
      return {
        bg: "transparent",
        fg: t.color.accent.base,
        hoverBg: t.color.accent.tint,
        activeBg: hexToRgba(
          t.color.accent.base,
          isDarkScheme(t.scheme) ? 0.3 : 0.2,
        ),
        border: "transparent",
      };
    case "icon":
      return {
        bg: "transparent",
        fg: t.color.text.primary,

        hoverBg: t.color.surface.buttonHover,
        activeBg: t.color.surface.buttonActive,
        border: "transparent",
      };
    default:
      return {
        bg: t.color.surface.button,
        fg: t.color.text.primary,
        hoverBg: t.color.surface.buttonHover,
        activeBg: t.color.surface.buttonActive,
        border: t.color.border.default,
      };
  }
}

function buttonGeometry(
  t: AdwaitaTheme,
  variant: ButtonVariant,
  size: ButtonSize,
) {
  const minHeight = BUTTON_SIZE_HEIGHT[size];
  const isIcon = size === "icon";
  const pill = variant === "pill";
  return {
    minHeight,
    isIcon,
    padding: isIcon ? 0 : pill ? t.space.lg : t.space.md,
    radius: isIcon ? t.radius.sm : pill ? t.radius.full : t.radius.sm,
  };
}

function buttonStyle(
  t: AdwaitaTheme,
  variant: ButtonVariant,
  size: ButtonSize,
  disabled?: boolean,
  style?: Partial<StyleDesc>,

  circle?: boolean,
): Partial<StyleDesc> {
  const theme = resolveVariantTheme(variant, t);
  const geo = buttonGeometry(t, variant, size);
  const minHeight = geo.minHeight;
  const isIcon = geo.isIcon || (circle ?? false);
  const padding = geo.padding;
  const radius = circle ? t.radius.full : geo.radius;
  return {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    minHeight,
    ...(isIcon ? { width: minHeight, padding: 0 } : {}),
    paddingLeft: padding,
    paddingRight: padding,
    borderRadius: radius,
    borderWidth: 0,
    borderColor: theme.border,
    backgroundColor: theme.bg,
    ...disabledStyle(disabled, {
      cursor: "pointer",
      disabledCursor: "not-allowed",
      hover: { backgroundColor: theme.hoverBg },
      active: { backgroundColor: theme.activeBg },
    }),
    ...style,
  };
}

export function Button({
  variant = "default",
  size = "default",
  shape,
  label,
  icon,
  trailingIcon,
  onClick,
  disabled,
  children,
  style,
}: ButtonProps) {
  const t = useAdwaita();
  const fg = resolveVariantTheme(variant, t).fg;

  return (
    <div
      onClick={disabled ? undefined : onClick}
      style={{
        ...buttonStyle(t, variant, size, disabled, style, shape === "circle"),
        color: fg,
      }}
    >
      {icon ? (
        <Icon name={icon} size={size === "lg" ? 18 : 16} color={fg} />
      ) : null}
      {label ? (
        <T size="body" weight={600} color={fg}>
          {label}
        </T>
      ) : null}
      {typeof children === "string" ? (
        <T size="body" weight={600} color={fg}>
          {children}
        </T>
      ) : (
        children
      )}
      {trailingIcon ? (
        <Icon name={trailingIcon} size={size === "lg" ? 18 : 16} color={fg} />
      ) : null}
    </div>
  );
}
