import { useState } from "react";
import { type EventPayload, type StyleDesc } from "@gpuix/react";
import { type AdwaitaTheme, useAdwaita } from "../theme/adwaita";
import { T } from "./text";
import { focusRingStyle, resolveFieldBorderColor } from "./input-base";
import { Icon } from "./icons";

export interface NumberFieldProps {
  value?: number;
  defaultValue?: number;
  onChange?: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  disabled?: boolean;
  orientation?: "vertical" | "horizontal";
  suffix?: string;
  style?: Partial<StyleDesc>;
}

const STEPPER_WIDTH = 28;

const INPUT_MIN_HEIGHT = 34;

function clampToRange(n: number, min?: number, max?: number): number {
  let v = n;
  if (min !== undefined) v = Math.max(min, v);
  if (max !== undefined) v = Math.min(max, v);
  return v;
}

function isInRange(n: number, min?: number, max?: number): boolean {
  return (min === undefined || n >= min) && (max === undefined || n <= max);
}

function parseNumber(raw: string): number | null {
  const n = parseFloat(raw);
  return Number.isNaN(n) ? null : n;
}

function draftIsInvalid(
  draft: string | null,
  focused: boolean,
  min?: number,
  max?: number,
): boolean {
  if (!focused || draft === null || draft.trim() === "") return false;
  const n = parseNumber(draft);
  return n === null || !isInRange(n, min, max);
}

function outerFieldStyle(
  disabled: boolean | undefined,
  borderColor: string,
  focusRing: Partial<StyleDesc>,
  style: Partial<StyleDesc> | undefined,
  theme: AdwaitaTheme,
): Partial<StyleDesc> {
  return {
    position: "relative",
    display: "flex",
    flexDirection: "row",
    alignItems: "stretch",
    minHeight: INPUT_MIN_HEIGHT,
    borderRadius: theme.radius.sm,
    borderWidth: 1,
    borderColor,
    backgroundColor: theme.color.surface.view,
    overflow: "hidden",
    opacity: disabled ? 0.5 : 1,
    ...focusRing,
    ...style,
  };
}

function StepperButton({
  icon,
  disabled,
  horizontal,
  onClick,
}: {
  icon: "add" | "remove";
  disabled?: boolean;
  horizontal: boolean;
  onClick: () => void;
}) {
  const t = useAdwaita();
  return (
    <div
      onClick={disabled ? undefined : onClick}
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        cursor: disabled ? "default" : "pointer",
        hover: disabled
          ? undefined
          : { backgroundColor: t.color.surface.buttonHover },
        active: disabled
          ? undefined
          : { backgroundColor: t.color.surface.buttonActive },
        ...(horizontal
          ? { width: STEPPER_WIDTH, flexShrink: 0 }
          : { flexGrow: 1 }),
      }}
    >
      <Icon name={icon} size={12} color={t.color.text.dim} />
    </div>
  );
}

function NumberFieldSuffix({ suffix }: { suffix?: string }) {
  const t = useAdwaita();
  if (!suffix) return null;
  return (
    <T
      size="body"
      color={t.color.text.dim}
      style={{
        flexShrink: 0,
        alignSelf: "center",
        paddingRight: t.space.md,
        pointerEvents: "none",
      }}
    >
      {suffix}
    </T>
  );
}

function NumberFieldDisplay({
  displayValue,
  suffix,
}: {
  displayValue: string;
  suffix?: string;
}) {
  const t = useAdwaita();
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        flexGrow: 1,
        gap: t.space.sm,
        minWidth: 0,
      }}
    >
      <T size="body" color={t.color.text.primary}>
        {displayValue}
      </T>
      <NumberFieldSuffix suffix={suffix} />
    </div>
  );
}

function resolveDisplayValue(
  current: number,
  draft: string | null,
  focused: boolean,
): string {
  return focused && draft !== null ? draft : String(current);
}

function NumberFieldInput({
  displayValue,
  disabled,
  suffix,
  onFocus,
  inputHandlers,
}: {
  displayValue: string;
  disabled?: boolean;
  suffix?: string;
  onFocus: () => void;
  inputHandlers?: {
    onBlur: () => void;
    onChange: (e: EventPayload) => void;
  };
}) {
  const t = useAdwaita();
  return (
    <>
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          flexGrow: 1,
          minWidth: 0,
          gap: t.space.sm,
          paddingLeft: t.space.md,
          paddingRight: suffix ? 0 : t.space.md,
          pointerEvents: "none",
        }}
      >
        <T size="body" color={t.color.text.primary}>
          {displayValue}
        </T>
        <NumberFieldSuffix suffix={suffix} />
      </div>
      <input
        value={displayValue}
        readOnly={disabled}
        onFocus={onFocus}
        {...inputHandlers}
        theme={{ caret: t.color.accent.base }}
        style={{
          position: "absolute",
          top: 1,
          left: 1,
          bottom: 1,
          right: STEPPER_WIDTH + 1,
          opacity: 0,
          borderWidth: 0,
          borderRadius: 0,
          backgroundColor: "transparent",
          paddingLeft: t.space.md,
          fontSize: t.type.body,
          fontFamily: t.type.fontFamily,
          color: t.color.text.primary,
        }}
      />
    </>
  );
}

function NumberFieldHorizontal({
  disabled,
  onMinus,
  onPlus,
  displayValue,
  suffix,
}: {
  disabled?: boolean;
  onMinus: () => void;
  onPlus: () => void;
  displayValue: string;
  suffix?: string;
}) {
  const t = useAdwaita();
  const separator = { width: 1 };
  const sepStyle = { ...separator, backgroundColor: t.color.border.default };
  return (
    <>
      <StepperButton
        icon="remove"
        disabled={disabled}
        horizontal
        onClick={onMinus}
      />
      <div style={sepStyle} />
      <NumberFieldDisplay displayValue={displayValue} suffix={suffix} />
      <div style={sepStyle} />
      <StepperButton
        icon="add"
        disabled={disabled}
        horizontal
        onClick={onPlus}
      />
    </>
  );
}

function NumberFieldVertical({
  disabled,
  onMinus,
  onPlus,
  displayValue,
  suffix,
  onFocus,
  inputHandlers,
}: {
  disabled?: boolean;
  onMinus: () => void;
  onPlus: () => void;
  displayValue: string;
  suffix?: string;
  onFocus: () => void;
  inputHandlers?: {
    onBlur: () => void;
    onChange: (e: EventPayload) => void;
  };
}) {
  const t = useAdwaita();
  const verticalSeparator = {
    width: 1,
    backgroundColor: t.color.border.default,
  };
  const horizontalSeparator = {
    height: 1,
    backgroundColor: t.color.border.default,
  };
  return (
    <>
      <NumberFieldInput
        displayValue={displayValue}
        disabled={disabled}
        suffix={suffix}
        onFocus={onFocus}
        inputHandlers={inputHandlers}
      />
      <div style={verticalSeparator} />
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          width: STEPPER_WIDTH,
          flexShrink: 0,
        }}
      >
        <StepperButton
          icon="add"
          disabled={disabled}
          horizontal={false}
          onClick={onPlus}
        />
        <div style={horizontalSeparator} />
        <StepperButton
          icon="remove"
          disabled={disabled}
          horizontal={false}
          onClick={onMinus}
        />
      </div>
    </>
  );
}

export function NumberField({
  value,
  defaultValue = 0,
  onChange,
  min,
  max,
  step = 1,
  disabled,
  orientation = "vertical",
  suffix,
  style,
}: NumberFieldProps) {
  const t = useAdwaita();
  const [internal, setInternal] = useState<number>(defaultValue);
  const current = value ?? internal;

  const [draft, setDraft] = useState<string | null>(null);
  const [focused, setFocused] = useState(false);

  const commit = (next: number) => {
    const c = clampToRange(next, min, max);
    if (value === undefined) setInternal(c);
    setDraft(null);
    onChange?.(c);
  };

  const handleInput = (raw: string) => {
    setDraft(raw);
    const n = parseNumber(raw);
    if (n !== null && isInRange(n, min, max)) {
      const c = clampToRange(n, min, max);
      if (value === undefined) setInternal(c);
      onChange?.(c);
    }
  };

  const handleBlur = () => {
    setFocused(false);
    if (draft === null) return;
    const n = parseNumber(draft);
    if (n === null) {
      setDraft(null);
      return;
    }
    commit(n);
  };

  const horizontal = orientation === "horizontal";
  const displayValue = resolveDisplayValue(current, draft, focused);
  const invalid = draftIsInvalid(draft, focused, min, max);
  const borderColor = resolveFieldBorderColor(
    disabled === true,
    focused,
    invalid,
    t,
  );
  const focusRing =
    focused && disabled !== true ? focusRingStyle(t.color.accent.tint) : {};
  const inputHandlers = disabled
    ? undefined
    : {
        onBlur: handleBlur,
        onChange: (e: EventPayload) => handleInput(e.value ?? ""),
      };

  const minus = () => commit(current - step);
  const plus = () => commit(current + step);

  return (
    <div style={outerFieldStyle(disabled, borderColor, focusRing, style, t)}>
      {horizontal ? (
        <NumberFieldHorizontal
          disabled={disabled}
          onMinus={minus}
          onPlus={plus}
          displayValue={displayValue}
          suffix={suffix}
        />
      ) : (
        <NumberFieldVertical
          disabled={disabled}
          onMinus={minus}
          onPlus={plus}
          displayValue={displayValue}
          suffix={suffix}
          onFocus={() => setFocused(true)}
          inputHandlers={inputHandlers}
        />
      )}
    </div>
  );
}
