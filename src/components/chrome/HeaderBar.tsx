import { type ReactNode } from "react";
import { type StyleDesc } from "@gpuix/react";
import { useAdwaita } from "../../theme/adwaita";

export interface HeaderBarProps {
  left?: ReactNode;

  center?: ReactNode;

  right?: ReactNode;

  centerMode?: "title" | "location";
  centerStyle?: Partial<StyleDesc>;
  style?: Partial<StyleDesc>;
}

export function HeaderBar({
  left,
  center,
  right,
  centerMode = "title",
  centerStyle,
  style,
}: HeaderBarProps) {
  const t = useAdwaita();
  const title = centerMode === "title";

  /*
   * The ends balance, so the middle stands on the window's axis.
   *
   * A centred title is centred on the *window*, which is what a GNOME header bar does: GTK
   * gives the title box a minimum of twice the wider end, so the two ends hold equal weight
   * and the buttons on them cannot slide the title sideways. The flex form of that rule is an
   * end that **grows** by an equal share of what the middle leaves. Two fixed spacers — the
   * first shape of this — centred the middle in the space the ends left over, so a long figure
   * at the trailing end moved the title off the axis by half of its own width, and the axis
   * moved again with every button added.
   *
   * A `location` middle is the opposite request: a field wants everything the two ends leave,
   * so there the ends stay content-sized and the middle grows.
   */
  const group = (justify: "flex-start" | "flex-end"): Partial<StyleDesc> => ({
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    gap: t.control.headerActionGap,
    flexGrow: title ? 1 : 0,
    flexShrink: 1,
    ...(title ? { flexBasis: 0 } : {}),
    minWidth: 0,
    justifyContent: justify,
  });

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        width: "100%",
        minHeight: t.control.headerBarHeight,
        paddingLeft: t.control.headerBarPaddingX,
        paddingRight: t.control.headerBarPaddingX,
        backgroundColor: t.color.surface.headerbar,
        borderBottomWidth: 1,
        borderColor: t.color.border.default,
        ...style,
      }}
    >
      <div style={group("flex-start")}>{left}</div>
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "flex-start",

          flexGrow: title ? 0 : 1,
          flexShrink: 1,
          flexBasis: title ? undefined : 0,
          minWidth: 0,
          maxWidth: title ? t.control.headerBarCenterMaxWidth : undefined,
          gap: t.control.headerGroupGap,
          overflow: "hidden",
          ...centerStyle,
        }}
      >
        {center}
      </div>
      <div style={group("flex-end")}>{right}</div>
    </div>
  );
}
