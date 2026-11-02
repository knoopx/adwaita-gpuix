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
  style?: Partial<StyleDesc>;
}

export function StatusGlyph({
  status,
  icon,
  color,
  size = 14,
  spinnerSize = 16,
  style,
}: StatusGlyphProps) {
  const t = useAdwaita();
  if (status === "running")
    return (
      <Spinner
        size={spinnerSize}
        label={false}
        style={{ flexShrink: 0, ...style }}
      />
    );

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
