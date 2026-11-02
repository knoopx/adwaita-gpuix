import { type ReactNode } from "react";
import { type StyleDesc } from "@gpuix/react";
import { useAdwaita } from "../theme/adwaita";
import { type TextTone, textToneColor } from "../theme/tones";
import { T, type TextSize } from "./text";

export type LabelVariant = TextTone;

export interface LabelProps {
  children: ReactNode;

  size?: TextSize;

  variant?: LabelVariant;

  weight?: number | string;

  disabled?: boolean;

  style?: Partial<StyleDesc>;
}

export function Label({
  children,
  size = "body",
  variant = "default",
  weight,
  disabled,
  style,
}: LabelProps) {
  const t = useAdwaita();
  const color = textToneColor(t, variant);
  return (
    <T
      size={size}
      weight={weight}
      color={color}
      style={{ opacity: disabled ? 0.5 : 1, ...style }}
    >
      {children}
    </T>
  );
}
