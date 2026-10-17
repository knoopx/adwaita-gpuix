import type { StyleDesc } from "@gpuix/react";
import {
  useAdwaita,
  hexToRgba,
  isDarkScheme,
  shade,
  type AdwaitaTheme,
} from "../theme/adwaita";
import { LabeledControl } from "./common";

export interface SwitchProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
  label?: string;
  labelPosition?: "start" | "end";
  style?: Partial<StyleDesc>;
}

function switchTrackStyle(
  t: AdwaitaTheme,
  checked: boolean,
  dimmed: boolean,
  style?: Partial<StyleDesc>,
): Partial<StyleDesc> {
  const { colors, radii } = t;
  return {
    width: 44,
    height: 26,
    flexShrink: 0,
    display: "flex",
    alignItems: "center",
    justifyContent: checked ? "flex-end" : "flex-start",
    padding: 3,
    borderRadius: radii.pill,
    backgroundColor: checked ? colors.accent : colors.border,
    cursor: dimmed ? "not-allowed" : "pointer",
    opacity: dimmed ? 0.5 : 1,
    ...(dimmed
      ? {}
      : {
          hover: {
            backgroundColor: checked
              ? shade(colors.accent, -0.08)
              : colors.accentTint,
          },
          active: {
            backgroundColor: checked
              ? shade(colors.accent, -0.18)
              : hexToRgba(colors.accent, isDarkScheme(t.scheme) ? 0.3 : 0.2),
          },
        }),
    ...style,
  };
}

export function Switch({
  checked,
  onChange,
  disabled,
  label,
  labelPosition = "end",
  style,
}: SwitchProps) {
  const t = useAdwaita();
  const { colors, radii } = t;

  const toggle = () => onChange(!checked);

  const track = (
    <div
      onClick={disabled ? undefined : toggle}
      tabIndex={disabled ? -1 : 0}
      onKeyDown={
        disabled
          ? undefined
          : (event) => {
              if (event.key === "Enter" || event.key === " ") toggle();
            }
      }
      style={switchTrackStyle(
        t,
        checked,
        disabled === true && label === undefined,
        style,
      )}
    >
      {}
      <div
        style={{
          width: 20,
          height: 20,
          borderRadius: radii.pill,
          backgroundColor: colors.accent_fg,
          pointerEvents: "none",
        }}
      />
    </div>
  );

  if (label === undefined) return track;

  return (
    <LabeledControl
      control={track}
      label={label}
      disabled={disabled}
      labelPosition={labelPosition}
    />
  );
}
