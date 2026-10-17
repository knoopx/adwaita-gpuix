import { createContext, useContext, useState, type ReactNode } from "react";
import type { StyleDesc } from "@gpuix/react";
import type { EventPayload } from "@gpuix/native";
import {
  useAdwaita,
  hexToRgba,
  isDarkScheme,
  type AdwaitaTheme,
} from "../theme/adwaita";
import { LabeledControl } from "./common";

interface RadioGroupContextValue {
  value: string;
  onValueChange: (value: string) => void;
}
const RadioGroupCtx = createContext<RadioGroupContextValue | null>(null);
function useRadioGroup(): RadioGroupContextValue {
  const ctx = useContext(RadioGroupCtx);
  return ctx ?? { value: "", onValueChange: () => {} };
}

export interface RadioGroupProps {
  value?: string;
  onValueChange?: (value: string) => void;

  defaultValue?: string;
  children: ReactNode;
  style?: Partial<StyleDesc>;
}

export function RadioGroup({
  value,
  onValueChange,
  defaultValue,
  children,
  style,
}: RadioGroupProps) {
  const t = useAdwaita();
  const [internal, setInternal] = useState<string>(defaultValue ?? value ?? "");
  const current = value ?? internal;

  const handleValueChange = (v: string) => {
    if (value === undefined) setInternal(v);
    onValueChange?.(v);
  };

  return (
    <RadioGroupCtx.Provider
      value={{ value: current, onValueChange: handleValueChange }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: t.spacing.gap,
          ...style,
        }}
      >
        {children}
      </div>
    </RadioGroupCtx.Provider>
  );
}

export interface RadioGroupItemProps {
  value: string;
  disabled?: boolean;

  label?: string;
  style?: Partial<StyleDesc>;
}

function radioRowStyle(
  t: AdwaitaTheme,
  disabled: boolean | undefined,
): Partial<StyleDesc> {
  const { colors, radii } = t;
  return {
    cursor: disabled ? "not-allowed" : "pointer",
    borderRadius: radii.button,
    ...(disabled
      ? {}
      : {
          hover: { backgroundColor: colors.accentTint },
          active: {
            backgroundColor: hexToRgba(
              colors.accent,
              isDarkScheme(t.scheme) ? 0.3 : 0.2,
            ),
          },
        }),
  };
}

export function RadioGroupItem({
  value,
  disabled,
  label,
  style,
}: RadioGroupItemProps) {
  const t = useAdwaita();
  const { colors, radii } = t;
  const group = useRadioGroup();
  const selected = group.value === value;

  const select = disabled ? undefined : () => group.onValueChange(value);
  
  
  const circle = (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        width: 18,
        height: 18,
        borderRadius: 9,
        borderWidth: 2,
        borderColor: selected ? colors.accent : colors.border,
        backgroundColor: colors.view_bg,
        flexShrink: 0,
        pointerEvents: "none",
        ...style,
      }}
    >
      {selected ? (
        <div
          style={{
            width: 8,
            height: 8,
            borderRadius: 4,
            backgroundColor: colors.accent,
            pointerEvents: "none",
          }}
        />
      ) : null}
    </div>
  );
  
  const rowStyle = radioRowStyle(t, disabled);
  const sharedProps = {
    onClick: select,
    tabIndex: disabled ? -1 : 0,
    onKeyDown: disabled
      ? undefined
      : (event: EventPayload) => {
          if (event.key === "Enter" || event.key === " ") select?.();
        },
  };
  if (label === undefined) {
    return (
      <div
        {...sharedProps}
        style={{ display: "flex", opacity: disabled ? 0.5 : 1, ...rowStyle }}
      >
        {circle}
      </div>
    );
  }
  return (
    <div {...sharedProps} style={rowStyle}>
      <LabeledControl control={circle} label={label} disabled={disabled} />
    </div>
  );
}
