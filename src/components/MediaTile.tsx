import { type StyleDesc } from "@gpuix/react";
import { hexToRgba, isDarkScheme, useAdwaita } from "../theme/adwaita";
import { T } from "./text";
import { Icon, type IconName } from "./icons";

export interface MediaTileProps {
  label: string;
  sublabel?: string;
  icon?: IconName;

  tintIndex?: number;
  width?: number;
  height?: number;
  selected?: boolean;
  onSelect?: () => void;

  badge?: boolean;
  style?: Partial<StyleDesc>;
}

export function MediaTile({
  label,
  sublabel,
  icon,
  tintIndex = 0,
  width,
  height,
  selected = false,
  onSelect,
  badge = false,
  style,
}: MediaTileProps) {
  const t = useAdwaita();
  const size = t.control;
  const series = t.color.chart.series;
  const color = series[tintIndex % series.length];
  const w = width ?? size.mediaTileWidth;
  const h = height ?? w;
  const square = height === undefined;

  return (
    <div
      onClick={onSelect}
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "flex-end",
        width: w,
        height: h,
        padding: t.space.md,
        borderRadius: t.radius.sm,
        cursor: onSelect ? "pointer" : "default",
        backgroundColor: selected
          ? t.color.selection.accent
          : hexToRgba(
              color,
              isDarkScheme(t.scheme)
                ? t.color.chart.bandTint + 0.12
                : t.color.chart.bandTint,
            ),
        hover: {
          backgroundColor: selected
            ? t.color.selection.accent
            : hexToRgba(color, t.color.chart.bandTint + 0.08),
        },
        ...style,
      }}
    >
      {badge ? (
        <div
          style={{
            position: "absolute",
            right: t.space.sm,
            bottom: t.space.sm,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: size.compactIconSize + t.space.xs,
            height: size.compactIconSize + t.space.xs,
            borderRadius: size.compactIconSize + t.space.xs,
            backgroundColor: t.color.accent.base,
          }}
        >
          <Icon
            name="check"
            size={t.control.caretIconSize}
            color={t.color.text.onAccent}
          />
        </div>
      ) : null}
      {icon ? (
        <div
          style={{
            position: "absolute",
            left: t.space.md,
            top: t.space.md,
          }}
        >
          <Icon name={icon} size={size.navIconSize} color={color} />
        </div>
      ) : null}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: t.space.xs,
          minWidth: 0,
        }}
      >
        <T
          size={square ? "caption" : "caption"}
          weight={600}
          color={t.color.text.primary}
          clamp={3}
        >
          {label}
        </T>
        {sublabel ? (
          <T size="micro" color={t.color.text.dim} clamp={1}>
            {sublabel}
          </T>
        ) : null}
      </div>
    </div>
  );
}
