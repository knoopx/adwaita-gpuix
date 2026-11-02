import { type StyleDesc } from "@gpuix/react";
import { type AdwaitaTheme, useAdwaita } from "../theme/adwaita";
import { LabeledControl, accentFillInteractions } from "./checkable";
import { Icon } from "./icons";
import { isActivateKey } from "../lib/roving";

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
  return {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: 18,
    height: 18,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: filled ? t.color.accent.base : t.color.border.default,
    backgroundColor: filled ? t.color.accent.base : "transparent",
    cursor: disabled ? "not-allowed" : "pointer",
    opacity: disabled ? 0.5 : 1,
    flexShrink: 0,
    ...(disabled ? {} : accentFillInteractions(t, filled)),
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
              if (isActivateKey(event.key, { space: true })) toggle();
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
          color={t.color.text.onAccent}
          style={{ pointerEvents: "none" }}
        />
      ) : isIndeterminate ? (
        <Icon
          name="remove"
          size={12}
          color={t.color.text.onAccent}
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
