import { type StyleDesc } from "@gpuix/react";
import { useAdwaita } from "../../theme/adwaita";
import { T } from "../text";
import { Icon, type IconName } from "../icons";
import { Spinner } from "../Spinner";

export type ImagePlaceholderState =
  "pending" | "unsupported" | "missing" | "error";

const ICONS: Record<ImagePlaceholderState, IconName> = {
  pending: "image",
  unsupported: "imageNotSupported",
  missing: "image",
  error: "brokenImage",
};

export interface ImagePlaceholderProps {
  label?: string;

  caption?: string;
  state?: ImagePlaceholderState;

  size?: "thumb" | "panel";

  width?: number;
  height?: number;
  style?: Partial<StyleDesc>;
}

export function ImagePlaceholder({
  label,
  caption,
  state = "unsupported",
  size = "panel",
  width,
  height,
  style,
}: ImagePlaceholderProps) {
  const t = useAdwaita();
  const thumb = size === "thumb";
  const pending = state === "pending";
  const error = state === "error";

  const iconSize = thumb
    ? t.control.dataIconSize
    : Math.round(t.control.dataIconSize * 2);
  const boxWidth = width ?? (thumb ? t.control.dataIconSize * 4 : undefined);
  const boxHeight = thumb ? (height ?? boxWidth) : height;
  const minHeight = thumb ? boxHeight : Math.round(t.control.mediaTileHeight);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: thumb ? t.space.xs : t.space.sm,
        width: boxWidth,
        height: boxHeight,
        minHeight,
        minWidth: 0,
        flexShrink: thumb ? 0 : 1,
        padding: thumb ? t.space.sm : t.space.lg,
        borderRadius: t.radius.sm,
        backgroundColor: error
          ? t.color.functional.destructiveTint
          : t.color.surface.sunken,
        overflow: "hidden",
        pointerEvents: "none",
        ...style,
      }}
    >
      {pending ? (
        <Spinner size={thumb ? 16 : 32} animated={false} label={false} />
      ) : (
        <Icon
          name={ICONS[state]}
          size={iconSize}
          color={error ? t.color.functional.destructive : t.color.text.dim}
          style={{ flexShrink: 0 }}
        />
      )}
      {thumb ? null : label ? (
        <T
          size="caption"
          weight={600}
          align="center"
          color={t.color.text.primary}
          clamp={1}
          style={{ minWidth: 0 }}
        >
          {label}
        </T>
      ) : null}
      {thumb ? null : caption ? (
        <T
          size="micro"
          align="center"
          color={t.color.text.dim}
          clamp={1}
          style={{ minWidth: 0 }}
        >
          {caption}
        </T>
      ) : null}
    </div>
  );
}
