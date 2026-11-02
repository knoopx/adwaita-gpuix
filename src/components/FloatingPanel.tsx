import { type StyleDesc } from "@gpuix/react";
import { type ReactNode } from "react";
import { type AdwaitaTheme, useAdwaita } from "../theme/adwaita";

export function FloatingPanel({
  children,
  side = "bottom",
  sideOffset = 4,
  xOffset = 0,
  minWidth,
  fit = "switch",
  padding = 4,
  gap = 2,
  style,
}: {
  children?: ReactNode;
  side?: "top" | "right" | "bottom" | "left";
  sideOffset?: number;
  xOffset?: number;
  minWidth?: number;

  fit?: "switch" | "snap";
  padding?: number;
  gap?: number;
  style?: Partial<StyleDesc>;
}) {
  const t = useAdwaita();
  return (
    <anchored
      side={side}
      align="start"
      gap={sideOffset}
      offset={{ x: xOffset, y: 0 }}
      fit={fit}
      snapMargin={8}
      deferred={true}
      priority={1}
      occlude={true}
      style={{
        borderRadius: t.radius.sm,
        backgroundColor: t.color.surface.view,
      }}
    >
      <div
        style={{
          ...menuPanelStyle(t, {
            display: "flex",
            flexDirection: "column",
            gap,
            padding,
            ...(minWidth !== undefined ? { minWidth } : {}),
          }),
          ...style,
        }}
      >
        {children}
      </div>
    </anchored>
  );
}

export function listPanelStyle(
  t: AdwaitaTheme,
  style?: Partial<StyleDesc>,
): Partial<StyleDesc> {
  return menuPanelStyle(t, { maxHeight: 200, ...style });
}
export function menuPanelStyle(
  t: AdwaitaTheme,
  style?: Partial<StyleDesc>,
): Partial<StyleDesc> {
  return {
    borderRadius: t.radius.sm,
    borderWidth: 1,
    borderColor: t.color.border.default,
    backgroundColor: t.color.surface.card,
    ...style,
  };
}
