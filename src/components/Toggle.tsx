import type { ReactNode } from "react";
import type { StyleDesc } from "@gpuix/react";
import { useAdwaita, hexToRgba, isDarkScheme } from "../theme/adwaita";
import { T } from "./common";
import { Icon, type IconName } from "./icons";

export type ToggleVariant = "default" | "outline";
export type ToggleSize = "sm" | "default" | "lg";

export interface ToggleProps {
  pressed: boolean;
  onPressed: () => void;
  variant?: ToggleVariant;
  size?: ToggleSize;
  icon?: IconName;
  disabled?: boolean;
  children?: ReactNode;
  style?: Partial<StyleDesc>;
}

const TOGGLE_MIN_HEIGHT: Record<ToggleSize, number> = {
  sm: 28,
  default: 34,
  lg: 40,
};

const TOGGLE_ICON_SIZE: Record<ToggleSize, number> = {
  sm: 14,
  default: 16,
  lg: 18,
};

export function Toggle({
  pressed,
  onPressed,
  variant = "default",
  size = "default",
  icon,
  disabled,
  children,
  style,
}: ToggleProps) {
  const t = useAdwaita();
  const { colors, radii, spacing } = t;
  const dark = isDarkScheme(t.scheme);

  const isOutline = variant === "outline";

  const bg = pressed
    ? colors.accentTint
    : isOutline
      ? "transparent"
      : colors.button_bg;
  const fg = pressed ? colors.accent : colors.fg;
  const iconColor = pressed ? colors.accent : colors.dim_fg;
  const borderColor = pressed ? colors.accent : colors.border;

  return (
    <div
      onClick={disabled ? undefined : onPressed}
      tabIndex={disabled ? -1 : 0}
      onKeyDown={(event) => {
        if (disabled) return;
        if (event.key === "Enter" || event.key === " ") onPressed();
      }}
      style={{
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        gap: 6,
        minHeight: TOGGLE_MIN_HEIGHT[size],
        paddingLeft: spacing.paddingTight,
        paddingRight: spacing.paddingTight,
        borderRadius: radii.button,
        borderWidth: 1,
        borderColor,
        backgroundColor: bg,
        opacity: disabled ? 0.5 : 1,
        cursor: disabled ? "not-allowed" : "pointer",
        ...(disabled
          ? {}
          : {
              hover: {
                backgroundColor: pressed
                  ? colors.accentTint
                  : colors.button_hover,
              },
              active: {
                backgroundColor: pressed
                  ? hexToRgba(colors.accent, dark ? 0.35 : 0.25)
                  : colors.button_active,
              },
            }),
        ...style,
      }}
    >
      {icon ? (
        <Icon
          name={icon}
          size={TOGGLE_ICON_SIZE[size]}
          color={iconColor}
          style={{ pointerEvents: "none" }}
        />
      ) : null}
      {children ? (
        <T size="body" weight={600} color={fg}>
          {children}
        </T>
      ) : null}
    </div>
  );
}
