import { type StyleDesc } from "@gpuix/react";
import {
  type AdwaitaTheme,
  hexToRgba,
  isDarkScheme,
  useAdwaita,
} from "../theme/adwaita";
import { LabeledControl, accentFillInteractions } from "./checkable";
import { isActivateKey } from "../lib/roving";

export interface SwitchProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
  label?: string;
  labelPosition?: "start" | "end";
  style?: Partial<StyleDesc>;
}

function uncheckedTrackColor(t: AdwaitaTheme): string {
  return t.color.surface.sunken;
}

function knobColor(t: AdwaitaTheme, checked: boolean): string {
  return checked ? t.color.text.onAccent : t.color.text.primary;
}

function switchTrackStyle(
  t: AdwaitaTheme,
  checked: boolean,
  dimmed: boolean,
  style?: Partial<StyleDesc>,
): Partial<StyleDesc> {
  return {
    width: 44,
    height: 26,
    flexShrink: 0,
    display: "flex",
    alignItems: "center",
    justifyContent: checked ? "flex-end" : "flex-start",
    padding: 3,
    borderRadius: t.radius.full,
    backgroundColor: checked ? t.color.accent.base : uncheckedTrackColor(t),
    cursor: dimmed ? "not-allowed" : "pointer",
    opacity: dimmed ? 0.5 : 1,
    ...(dimmed ? {} : accentFillInteractions(t, checked)),
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
  const toggle = () => onChange(!checked);

  const track = (
    <div
      onClick={disabled ? undefined : toggle}
      tabIndex={disabled ? -1 : 0}
      onKeyDown={
        disabled
          ? undefined
          : (event) => {
              if (isActivateKey(event.key, { space: true })) toggle();
            }
      }
      style={switchTrackStyle(
        t,
        checked,
        disabled === true && label === undefined,
        style,
      )}
    >
      <div
        style={{
          width: 20,
          height: 20,
          borderRadius: t.radius.full,
          backgroundColor: knobColor(t, checked),
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
