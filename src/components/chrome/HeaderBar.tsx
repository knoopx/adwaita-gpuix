import type { ReactNode } from "react";
import type { StyleDesc } from "@gpuix/react";
import { useAdwaita } from "../../theme/adwaita";
import { T } from "../common";

export interface HeaderBarProps {
  
  title?: ReactNode;
  
  subtitle?: ReactNode;
  
  left?: ReactNode;
  
  right?: ReactNode;
  style?: Partial<StyleDesc>;
}


const HEADER_BAR_MIN_HEIGHT = 46;


function columnStyle(justify: "flex-start" | "center" | "flex-end"): Partial<StyleDesc> {
  return {
    flexGrow: 1,
    flexShrink: 1,
    flexBasis: 0,
    minWidth: 0,
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: justify,
  };
}


const clampStyle: Partial<StyleDesc> = {
  flexShrink: 1,
  minWidth: 0,
  whiteSpace: "nowrap",
  textOverflow: "ellipsis",
};

export function HeaderBar({
  title,
  subtitle,
  left,
  right,
  style,
}: HeaderBarProps) {
  const t = useAdwaita();
  const { colors, spacing } = t;

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        minHeight: HEADER_BAR_MIN_HEIGHT,
        paddingLeft: spacing.paddingTight,
        paddingRight: spacing.paddingTight,
        backgroundColor: colors.headerbar_bg,
        borderBottomWidth: 1,
        borderColor: colors.border,
        ...style,
      }}
    >
      <div style={{ ...columnStyle("flex-start"), gap: spacing.gap }}>{left}</div>
      <div
        style={{
          ...columnStyle("center"),
          flexDirection: "column",
          gap: 2,
        }}
      >
        {typeof title === "string" ? (
          <T
            size="title3"
            weight={700}
            color={colors.fg}
            style={{ textAlign: "center", ...clampStyle }}
          >
            {title}
          </T>
        ) : title ? (
          title
        ) : null}
        {typeof subtitle === "string" ? (
          <T
            size="caption"
            color={colors.dim_fg}
            style={{ textAlign: "center", ...clampStyle }}
          >
            {subtitle}
          </T>
        ) : subtitle ? (
          subtitle
        ) : null}
      </div>
      <div style={{ ...columnStyle("flex-end"), gap: spacing.gap }}>{right}</div>
    </div>
  );
}
