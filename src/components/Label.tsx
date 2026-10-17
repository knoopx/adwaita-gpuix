import type { ReactNode } from "react";
import type { StyleDesc } from "@gpuix/react";
import { useAdwaita } from "../theme/adwaita";
import { T, type TextSize } from "./common";

export type LabelVariant =
  | "default"
  | "dim"
  | "accent"
  | "destructive"
  | "success"
  | "warning";

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
  const color = {
    default: t.colors.fg,
    dim: t.colors.dim_fg,
    accent: t.colors.accent,
    destructive: t.colors.destructive,
    success: t.colors.success,
    warning: t.colors.warning,
  }[variant];
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
