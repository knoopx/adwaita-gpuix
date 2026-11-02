import { type StyleDesc } from "@gpuix/react";
import { type ReactNode, useState } from "react";
import { FieldSlot } from "./Field";
import { T } from "./text";
import { type AdwaitaTheme, useAdwaita } from "../theme/adwaita";
import { hexToRgba } from "../theme/tokens";

export function textFieldStyle(
  t: AdwaitaTheme,
  style?: Partial<StyleDesc>,
): Partial<StyleDesc> {
  return {
    display: "flex",
    borderWidth: 1,
    borderColor: t.color.border.default,
    backgroundColor: t.color.surface.view,
    fontSize: t.type.body,
    fontFamily: t.type.fontFamily,
    color: t.color.text.primary,
    ...style,
  };
}

export function inputShellStyle(
  t: AdwaitaTheme,
  style?: Partial<StyleDesc>,
): Partial<StyleDesc> {
  return {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    padding: 8,
    paddingLeft: 12,
    borderRadius: t.radius.sm,
    borderWidth: 1,
    borderColor: t.color.border.default,
    backgroundColor: t.color.surface.button,
    ...style,
  };
}

export interface AdwaitaInputBaseProps {
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  invalid?: boolean;
  autoFocus?: boolean;
  onSubmit?: () => void;

  mask?: boolean;
  leading?: ReactNode;
  trailing?: ReactNode;

  surface?: "view" | "control";

  focused?: boolean;
  style?: Partial<StyleDesc>;
  testId?: string;
}

export function resolveFieldBorderColor(
  disabled: boolean | undefined,
  focused: boolean,
  invalid: boolean | undefined,
  t: AdwaitaTheme,
): string {
  if (disabled) return t.color.border.default;
  if (focused) return t.color.accent.base;
  if (invalid) return t.color.functional.destructive;
  return t.color.border.default;
}

export function focusRingStyle(color: string): Partial<StyleDesc> {
  return {
    boxShadow: {
      offsetX: 0,
      offsetY: 0,
      blurRadius: 8,
      spreadRadius: 0,
      color,
    },
  };
}

function inputBaseBorderColor(
  surface: "view" | "control",
  disabled: boolean | undefined,
  focused: boolean,
  invalid: boolean | undefined,
  t: AdwaitaTheme,
): string {
  if (surface === "control" && !focused && !invalid && !disabled) {
    return t.color.surface.input;
  }
  return resolveFieldBorderColor(disabled, focused, invalid, t);
}

function inputBaseShellStyle(
  surface: "view" | "control",
  disabled: boolean | undefined,
  focused: boolean,
  invalid: boolean | undefined,
  style: Partial<StyleDesc> | undefined,
  t: AdwaitaTheme,
): Partial<StyleDesc> {
  return {
    position: "relative",
    display: "flex",
    alignItems: "center",
    gap: 8,
    minHeight: 34,
    borderRadius: t.radius.sm,
    borderWidth: 1,
    borderColor: inputBaseBorderColor(surface, disabled, focused, invalid, t),
    backgroundColor:
      surface === "control" ? t.color.surface.input : t.color.surface.view,
    opacity: disabled ? 0.5 : 1,
    cursor: disabled ? "not-allowed" : "text",
    ...(focused ? focusRingStyle(hexToRgba(t.color.accent.base, 0.4)) : {}),
    ...style,
  };
}

function inputDisplayState(
  current: string,
  mask: boolean | undefined,
  placeholder: string | undefined,
): { displayed: string; showPlaceholder: boolean } {
  return {
    displayed: mask ? "•".repeat(current.length) : current,
    showPlaceholder: current.length === 0 && placeholder !== undefined,
  };
}

function InputOverlay({
  testId,
  value,
  placeholder,
  autoFocus,
  disabled,
  accent,
  onFocus,
  onBlur,
  onChange,
  onSubmit,
}: {
  testId?: string;
  value: string;
  placeholder?: string;
  autoFocus?: boolean;
  disabled?: boolean;
  accent: string;
  onFocus: () => void;
  onBlur: () => void;
  onChange: ((event: { value?: string }) => void) | undefined;
  onSubmit?: () => void;
}) {
  return (
    <input
      {...(testId ? { testId } : {})}
      value={value}
      placeholder={placeholder}
      autoFocus={autoFocus && !disabled ? true : undefined}
      readOnly={disabled}
      onFocus={onFocus}
      onBlur={onBlur}
      onChange={disabled ? undefined : onChange}
      onSubmit={disabled ? undefined : onSubmit}
      theme={{ caret: accent }}
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        opacity: 0,
        borderWidth: 0,
        backgroundColor: "transparent",
      }}
    />
  );
}

function InputDisplay({
  displayed,
  placeholder,
  showPlaceholder,
}: {
  displayed: string;
  placeholder?: string;
  showPlaceholder: boolean;
}) {
  const t = useAdwaita();
  if (displayed.length === 0 && !showPlaceholder) return null;
  return (
    <T
      size="body"
      color={showPlaceholder ? t.color.text.dim : t.color.text.primary}
      style={{
        flexShrink: 1,
        pointerEvents: "none",
        whiteSpace: "nowrap",
        textOverflow: "ellipsis",
      }}
    >
      {displayed || placeholder}
    </T>
  );
}

export function AdwaitaInputBase({
  value,
  onChange,
  placeholder,
  disabled,
  invalid,
  autoFocus,
  onSubmit,
  mask,
  leading,
  trailing,
  surface = "view",
  focused: focusedProp = false,
  style,
  testId,
}: AdwaitaInputBaseProps) {
  const t = useAdwaita();
  const [internal, setInternal] = useState<string>(value ?? "");
  const [focusedState, setFocused] = useState(false);
  const focused = focusedProp || focusedState;
  const current = value ?? internal;

  const { displayed, showPlaceholder } = inputDisplayState(
    current,
    mask,
    placeholder,
  );

  const handleChange = (event: { value?: string }) => {
    const next = event.value ?? "";
    if (value === undefined) setInternal(next);
    onChange?.(next);
  };

  return (
    <div
      style={inputBaseShellStyle(surface, disabled, focused, invalid, style, t)}
    >
      {leading ? <FieldSlot>{leading}</FieldSlot> : null}
      <InputOverlay
        testId={testId}
        value={current}
        placeholder={placeholder}
        autoFocus={autoFocus}
        disabled={disabled}
        accent={t.color.accent.base}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        onChange={handleChange}
        onSubmit={onSubmit}
      />
      <InputDisplay
        displayed={displayed}
        placeholder={placeholder}
        showPlaceholder={showPlaceholder}
      />
      {trailing ? <FieldSlot>{trailing}</FieldSlot> : null}
    </div>
  );
}
