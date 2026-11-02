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

  const spacer: Partial<StyleDesc> = {
    display: "flex",
    flexDirection: "row",
    flexGrow: 1,
    flexShrink: 1,
    flexBasis: 0,
    minWidth: 0,
  };

  const group = (justify: "flex-start" | "flex-end"): Partial<StyleDesc> => ({
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    gap: t.control.headerActionGap,
    flexGrow: 0,
    flexShrink: 1,
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
      {centerMode === "title" ? <div style={spacer} /> : null}
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "flex-start",

          flexGrow: centerMode === "title" ? 0 : 1,
          flexShrink: 1,
          flexBasis: centerMode === "title" ? undefined : 0,
          minWidth: 0,
          maxWidth: t.control.headerBarCenterMaxWidth,
          gap: t.control.headerGroupGap,
          overflow: "hidden",
          ...centerStyle,
        }}
      >
        {center}
      </div>
      {centerMode === "title" ? <div style={spacer} /> : null}
      <div style={group("flex-end")}>{right}</div>
    </div>
  );
}
