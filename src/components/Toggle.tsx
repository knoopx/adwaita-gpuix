import { type ReactNode } from "react";
import { type EventPayload, type StyleDesc } from "@gpuix/react";
import {
  type AdwaitaTheme,
  hexToRgba,
  isDarkScheme,
  useAdwaita,
} from "../theme/adwaita";
import { T } from "./text";
import { disabledStyle } from "./disabled.ts";
import { Icon, type IconName } from "./icons";
import { isActivateKey } from "../lib/roving";

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

function toggleStyle(
  t: AdwaitaTheme,
  args: {
    pressed: boolean;
    variant: ToggleVariant;
    size: ToggleSize;
    disabled?: boolean;
  },
): Partial<StyleDesc> {
  const dark = isDarkScheme(t.scheme);
  const outline = args.variant === "outline";
  const { pressed } = args;
  const bg = pressed
    ? t.color.accent.tint
    : outline
      ? "transparent"
      : t.color.surface.button;
  return {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    minHeight: TOGGLE_MIN_HEIGHT[args.size],
    paddingLeft: t.space.md,
    paddingRight: t.space.md,
    borderRadius: t.radius.sm,
    borderWidth: 0,
    backgroundColor: bg,
    ...disabledStyle(args.disabled, {
      disabledCursor: "not-allowed",
      hover: {
        backgroundColor: pressed
          ? t.color.accent.tint
          : t.color.surface.buttonHover,
      },
      active: {
        backgroundColor: pressed
          ? hexToRgba(t.color.accent.base, dark ? 0.35 : 0.25)
          : t.color.surface.buttonActive,
      },
    }),
  };
}

function toggleInk(t: AdwaitaTheme, pressed: boolean) {
  return {
    fg: pressed ? t.color.accent.base : t.color.text.primary,
    icon: pressed ? t.color.accent.base : t.color.text.dim,
  };
}

function toggleActivate(
  event: EventPayload,
  disabled: boolean | undefined,
  onPressed: () => void,
) {
  if (disabled) return;
  if (isActivateKey(event.key, { space: true })) onPressed();
}

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
  const ink = toggleInk(t, pressed);

  return (
    <div
      onClick={disabled ? undefined : onPressed}
      tabIndex={disabled ? -1 : 0}
      onKeyDown={(event) => toggleActivate(event, disabled, onPressed)}
      style={{
        ...toggleStyle(t, { pressed, variant, size, disabled }),
        ...style,
      }}
    >
      {icon ? (
        <Icon
          name={icon}
          size={TOGGLE_ICON_SIZE[size]}
          color={ink.icon}
          style={{ pointerEvents: "none" }}
        />
      ) : null}
      {children ? (
        <T size="body" weight={600} color={ink.fg}>
          {children}
        </T>
      ) : null}
    </div>
  );
}
