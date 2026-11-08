import { type ReactNode } from "react";
import { type StyleDesc } from "@gpuix/react";
import { useAdwaita } from "../../theme/adwaita";
import { Icon, type IconName } from "../../components/icons";
import { Spinner, type SpinnerSize } from "../../components/Spinner";

export type GlyphStatus = "pending" | "running" | "complete" | "error";

const GLYPH_ICON: Record<Exclude<GlyphStatus, "running">, IconName> = {
  pending: "circle",
  complete: "checkCircle",
  error: "error",
};

export interface StatusGlyphProps {
  status: GlyphStatus;

  icon?: IconName;

  color?: string;

  size?: number;

  spinnerSize?: SpinnerSize;

  /**
   * An element to stand in for the ring `Spinner` while the status runs. The
   * running mark is the one thing of a status glyph an app may want in its own
   * idiom — a braille cell, a bar, a word — and the icon of the settled states
   * stays the library's.
   */
  spinnerSlot?: ReactNode;
  style?: Partial<StyleDesc>;
}

export function StatusGlyph({
  status,
  icon,
  color,
  size = 14,
  spinnerSize = 16,
  spinnerSlot,
  style,
}: StatusGlyphProps) {
  const t = useAdwaita();
  if (status === "running") {
    if (spinnerSlot !== undefined) return <>{spinnerSlot}</>;
    return (
      <Spinner
        size={spinnerSize}
        label={false}
        style={{ flexShrink: 0, ...style }}
      />
    );
  }

  const functional =
    status === "complete"
      ? t.color.functional.success
      : status === "error"
        ? t.color.functional.destructive
        : t.color.text.dim;

  return (
    <Icon
      name={icon ?? GLYPH_ICON[status]}
      size={size}
      color={color ?? functional}
      style={{ flexShrink: 0, ...style }}
    />
  );
}
