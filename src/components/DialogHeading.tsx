import { type StyleDesc } from "@gpuix/react";
import { useAdwaita } from "../theme/adwaita";
import { T } from "./text";
import { Icon, type IconName } from "./icons";

/** The glyph that names a dialog's subject, drawn in the accent. */
const HEADING_GLYPH = 18;

export interface DialogHeadingProps {
  /** What the dialog acts on, in one line. */
  title: string;
  /** The icon naming that subject; omitted when the title needs no help. */
  icon?: IconName;
  /** Human context under the title — never an id, a counter or an address. */
  subtitle?: string;
  style?: Partial<StyleDesc>;
}

/**
 * The heading of a dialog: an accent glyph and one title, optionally one line
 * of context under it. Every overlay a GPUix app opens starts with this, so a
 * revset filter and a bookmark name ask the same way.
 */
export function DialogHeading({
  title,
  icon,
  subtitle,
  style,
}: DialogHeadingProps) {
  const t = useAdwaita();
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: t.space.xs,
        minWidth: 0,
        ...style,
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          gap: t.space.sm,
          minWidth: 0,
        }}
      >
        {icon ? (
          <Icon
            name={icon}
            size={HEADING_GLYPH}
            color={t.color.accent.base}
            style={{ flexShrink: 0 }}
          />
        ) : null}
        <T
          size="title2"
          weight={700}
          color={t.color.text.primary}
          style={{ minWidth: 0, whiteSpace: "nowrap" }}
        >
          {title}
        </T>
      </div>
      {subtitle ? (
        <T
          size="caption"
          color={t.color.text.dim}
          style={{ minWidth: 0, whiteSpace: "nowrap" }}
        >
          {subtitle}
        </T>
      ) : null}
    </div>
  );
}
