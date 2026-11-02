import { type ReactNode, createContext, useContext, useState } from "react";
import { type StyleDesc } from "@gpuix/react";
import { type EventPayload } from "@gpuix/native";
import { isActivateKey } from "../lib/roving";
import {
  type AdwaitaTheme,
  hexToRgba,
  isDarkScheme,
  useAdwaita,
} from "../theme/adwaita";
import { LabeledControl } from "./checkable";
import { T } from "./text";

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
          gap: t.space.sm,
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

  description?: string;
  style?: Partial<StyleDesc>;
}

function radioRowStyle(
  t: AdwaitaTheme,
  disabled: boolean | undefined,
): Partial<StyleDesc> {
  return {
    cursor: disabled ? "not-allowed" : "pointer",
    borderRadius: t.radius.sm,
    ...(disabled
      ? {}
      : {
          hover: { backgroundColor: t.color.accent.tint },
          active: {
            backgroundColor: hexToRgba(
              t.color.accent.base,
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
  description,
  style,
}: RadioGroupItemProps) {
  const t = useAdwaita();
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
        borderRadius: 8,
        borderWidth: 2,
        borderColor: selected ? t.color.accent.base : t.color.border.default,
        backgroundColor: t.color.surface.view,
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
            backgroundColor: t.color.accent.base,
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
          if (isActivateKey(event.key, { space: true })) select?.();
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
  if (description === undefined) {
    return (
      <div {...sharedProps} style={rowStyle}>
        <LabeledControl control={circle} label={label} disabled={disabled} />
      </div>
    );
  }

  return (
    <div
      {...sharedProps}
      style={{
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        gap: t.space.sm,
        opacity: disabled ? 0.5 : 1,
        ...rowStyle,
      }}
    >
      {circle}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          flexGrow: 1,
          minWidth: 0,
        }}
      >
        <T size="body" color={t.color.text.primary}>
          {label}
        </T>
        <T size="caption" color={t.color.text.dim}>
          {description}
        </T>
      </div>
    </div>
  );
}
