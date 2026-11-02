import { useState } from "react";
import { type StyleDesc } from "@gpuix/react";
import { type EventPayload } from "@gpuix/native";
import { hexToRgba, useAdwaita } from "../theme/adwaita";
import {
  focusRingStyle,
  resolveFieldBorderColor,
  textFieldStyle,
} from "./input-base";

export interface TextareaProps {
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  rows?: number;
  disabled?: boolean;
  invalid?: boolean;

  autoFocus?: boolean;

  onSubmit?: () => void;
  onKeyDown?: (event: EventPayload) => void;
  style?: Partial<StyleDesc>;
}

export function Textarea({
  value,
  onChange,
  placeholder,
  rows = 3,
  disabled,
  invalid,
  autoFocus,
  onSubmit,
  onKeyDown,
  style,
}: TextareaProps) {
  const t = useAdwaita();
  const [focused, setFocused] = useState(false);

  const borderColor = resolveFieldBorderColor(disabled, focused, invalid, t);

  const focusRing = focused
    ? focusRingStyle(hexToRgba(t.color.accent.base, 0.4))
    : {};

  return (
    <textarea
      value={value}
      placeholder={placeholder}
      minRows={rows}
      readOnly={disabled}
      autoFocus={autoFocus && !disabled ? true : undefined}
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
      onSubmit={onSubmit}
      onKeyDown={onKeyDown}
      onChange={(event) => onChange?.(event.value ?? "")}
      theme={{ caret: t.color.accent.base, textMuted: t.color.text.dim }}
      style={textFieldStyle(t, {
        paddingTop: t.space.sm,
        paddingBottom: t.space.sm,
        paddingLeft: t.space.md,
        paddingRight: t.space.md,
        borderRadius: t.radius.sm,
        borderColor,
        cursor: disabled ? "not-allowed" : "text",
        opacity: disabled ? 0.5 : 1,
        ...focusRing,
        ...style,
      })}
    />
  );
}
