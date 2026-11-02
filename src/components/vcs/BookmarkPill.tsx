import { type StyleDesc } from "@gpuix/react";
import { Icon } from "../icons";
import { T } from "../text";
import { useAdwaita } from "../../theme/adwaita";

const PILL_H = 22;
const PILL_PAD_X = 8;
const PILL_GAP = 4;
const PILL_ICON = 12;

const PILL_TEXT_MIN = 24;

const PILL_MIN_W = PILL_ICON + PILL_PAD_X * 2 + PILL_GAP + PILL_TEXT_MIN + 2;

export type BookmarkPillVariant = "default" | "accent";

export function BookmarkPill({
  name,
  dimmed = false,
  variant = "default",
  style,
}: {
  name: string;
  dimmed?: boolean;
  variant?: BookmarkPillVariant;
  style?: Partial<StyleDesc>;
}) {
  const t = useAdwaita();
  const accent = variant === "accent";
  const fg = dimmed
    ? t.color.text.dim
    : accent
      ? t.color.accent.base
      : t.color.text.primary;
  const iconColor = dimmed ? t.color.text.dim : t.color.accent.base;
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        gap: PILL_GAP,
        height: PILL_H,
        paddingLeft: PILL_PAD_X,
        paddingRight: PILL_PAD_X,
        borderRadius: t.radius.full,
        borderWidth: 0,
        backgroundColor: accent ? t.color.accent.tint : t.color.surface.button,
        flexShrink: 1,
        minWidth: PILL_MIN_W,
        ...style,
      }}
    >
      <Icon name="bookmark" size={PILL_ICON} color={iconColor} />
      <T
        size="caption"
        color={fg}
        style={{
          whiteSpace: "nowrap",
          minWidth: PILL_TEXT_MIN,
          overflow: "hidden",
          textOverflow: "ellipsis",
        }}
      >
        {name}
      </T>
    </div>
  );
}
