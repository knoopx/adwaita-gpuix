import { useState } from "react";
import type { StyleDesc } from "@gpuix/react";
import type { EventPayload } from "@gpuix/native";
import {
  useAdwaita,
  hexToRgba,
} from "../theme/adwaita";
import { textFieldStyle, resolveFieldBorderColor } from "./common";

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
  const { colors, radii, spacing } = t;
  const [focused, setFocused] = useState(false);

  const borderColor = resolveFieldBorderColor(
    disabled,
    focused,
    invalid,
    colors,
  );

  const focusRing = focused
    ? {
        boxShadow: {
          offsetX: 0,
          offsetY: 0,
          blurRadius: 8,
          spreadRadius: 0,
          color: hexToRgba(colors.accent, 0.4),
        },
      }
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
      theme={{ caret: colors.accent, textMuted: colors.dim_fg }}
      style={textFieldStyle(t, {
        paddingTop: spacing.gap,
        paddingBottom: spacing.gap,
        paddingLeft: spacing.paddingTight,
        paddingRight: spacing.paddingTight,
        borderRadius: radii.button,
        borderColor,
        cursor: disabled ? "not-allowed" : "text",
        opacity: disabled ? 0.5 : 1,
        ...focusRing,
        ...style,
      })}
    />
  );
}
