import type { StyleDesc } from "@gpuix/react";
import {
  useAdwaita,
  hexToRgba,
  shade,
  isDarkScheme,
  type AdwaitaTheme,
} from "../theme/adwaita";
import { LabeledControl } from "./common";
import { Icon } from "./icons";

export type CheckboxState = boolean | "indeterminate";

export interface CheckboxProps {
  checked?: CheckboxState;
  onCheckedChange: (checked: boolean) => void;
  disabled?: boolean;

  label?: string;
  labelPosition?: "start" | "end";
  style?: Partial<StyleDesc>;
}

function checkboxStyle(
  t: AdwaitaTheme,
  filled: boolean,
  disabled: boolean,
  style?: Partial<StyleDesc>,
): Partial<StyleDesc> {
  const { colors } = t;
  return {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: 18,
    height: 18,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: filled ? colors.accent : colors.border,
    backgroundColor: filled ? colors.accent : "transparent",
    cursor: disabled ? "not-allowed" : "pointer",
    opacity: disabled ? 0.5 : 1,
    flexShrink: 0,
    ...(disabled
      ? {}
      : {
          hover: {
            backgroundColor: filled
              ? shade(colors.accent, -0.08)
              : colors.accentTint,
          },
          active: {
            backgroundColor: filled
              ? shade(colors.accent, -0.18)
              : hexToRgba(colors.accent, isDarkScheme(t.scheme) ? 0.3 : 0.2),
          },
        }),
    ...style,
  };
}

export function Checkbox({
  checked = false,
  onCheckedChange,
  disabled,
  label,
  labelPosition = "end",
  style,
}: CheckboxProps) {
  const t = useAdwaita();
  const { colors } = t;
  const isIndeterminate = checked === "indeterminate";
  const isChecked = checked === true;
  const filled = isChecked || isIndeterminate;
  const toggle = () => onCheckedChange(isIndeterminate ? true : !isChecked);

  const box = (
    <div
      onClick={disabled ? undefined : toggle}
      onKeyDown={
        disabled
          ? undefined
          : (event) => {
              if (event.key === "Enter" || event.key === " ") toggle();
            }
      }
      tabIndex={disabled ? -1 : 0}
      
      
      
      style={checkboxStyle(
        t,
        filled,
        disabled === true && label === undefined,
        style,
      )}
    >
      {isChecked ? (
        <Icon
          name="check"
          size={12}
          color={colors.accent_fg}
          style={{ pointerEvents: "none" }}
        />
      ) : isIndeterminate ? (
        <Icon
          name="minus"
          size={12}
          color={colors.accent_fg}
          style={{ pointerEvents: "none" }}
        />
      ) : null}
    </div>
  );

  if (label === undefined) return box;

  return (
    <LabeledControl
      control={box}
      label={label}
      disabled={disabled}
      labelPosition={labelPosition}
    />
  );
}
