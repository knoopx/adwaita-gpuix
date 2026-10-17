import type { ReactNode } from "react";
import type { StyleDesc } from "@gpuix/react";
import { useAdwaita, hexToRgba } from "../theme/adwaita";
import { T, GapRow } from "./common";

export interface InputOTPProps {
  length: number;
  value: string;
  onChange: (value: string) => void;

  onComplete?: () => void;
  autoFocus?: boolean;
  disabled?: boolean;
  style?: Partial<StyleDesc>;
}

export function InputOTP({
  length,
  value,
  onChange,
  onComplete,
  autoFocus,
  disabled,
  style,
}: InputOTPProps) {
  const t = useAdwaita();
  const { spacing } = t;

  const chars = Array.from({ length: length }, (_, i) => value[i] ?? "");

  return (
    <div
      style={{
        position: "relative",
        display: "flex",
        flexDirection: "row",
        gap: spacing.gap,
        ...style,
      }}
    >
      <input
        value={value}
        autoFocus={autoFocus && !disabled ? true : undefined}
        readOnly={disabled}
        onChange={(event) => {
          const next = event.value ?? "";
          onChange(next);
          if (next.length === length) onComplete?.();
        }}
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: 1,
          opacity: 0,
          borderWidth: 0,
          backgroundColor: "transparent",
        }}
      />
      {chars.map((char, i) => (
        <InputOTPSlot
          key={i}
          index={i}
          char={char}
          filled={char.length > 0}
          active={i === value.length && !disabled}
          disabled={disabled}
        />
      ))}
    </div>
  );
}

export interface InputOTPGroupProps {
  children: ReactNode;
  style?: Partial<StyleDesc>;
}

export function InputOTPGroup({ children, style }: InputOTPGroupProps) {
  return <GapRow children={children} style={style} />;
}

export interface InputOTPSlotProps {
  index: number;

  char?: string;

  filled?: boolean;
  active?: boolean;
  disabled?: boolean;
  style?: Partial<StyleDesc>;
}

export function InputOTPSlot({
  index,
  char = "",
  filled,
  active,
  disabled,
  style,
}: InputOTPSlotProps) {
  const t = useAdwaita();
  const { colors, radii, spacing } = t;
  void index;
  const size = spacing.rowHeight;
  const focusRing = active
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
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        width: size,
        height: size,
        flexShrink: 0,
        borderRadius: radii.button,
        borderWidth: 1,
        borderColor: active ? colors.accent : colors.border,
        backgroundColor: colors.button_bg,
        opacity: disabled ? 0.5 : 1,
        ...focusRing,
        ...style,
      }}
    >
      <T size="title2" color={filled ? colors.fg : colors.dim_fg}>
        {char}
      </T>
    </div>
  );
}

export interface InputOTPSeparatorProps {
  style?: Partial<StyleDesc>;
}

export function InputOTPSeparator({ style }: InputOTPSeparatorProps) {
  const t = useAdwaita();
  return (
    <div style={{ display: "flex", alignItems: "center", ...style }}>
      <T size="body" color={t.colors.dim_fg}>
        -
      </T>
    </div>
  );
}
