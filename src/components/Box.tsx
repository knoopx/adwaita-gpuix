import { type ReactNode } from "react";
import { type StyleDesc } from "@gpuix/react";
import { type AdwaitaTheme, useAdwaita } from "../theme/adwaita";

export interface BoxProps {
  children?: ReactNode;
  gap?: number;
  padding?: number;
  margin?: number;
  justify?:
    | "start"
    | "center"
    | "end"
    | "space-between"
    | "space-around"
    | "space-evenly";
  align?: "start" | "center" | "end" | "stretch";
  grow?: number;
  style?: Partial<StyleDesc>;
}

function flexStyle(
  props: BoxProps,
  direction: "row" | "column",
): Partial<StyleDesc> {
  const {
    gap = 8,
    padding = 0,
    margin = 0,
    justify,
    align,
    grow,
    style,
  } = props;
  return {
    display: "flex",
    flexDirection: direction,
    gap,
    padding,
    margin,
    justifyContent: justify,
    alignItems: align ?? "stretch",
    flexGrow: grow,
    ...style,
  };
}

export function Row(props: BoxProps) {
  return <div style={flexStyle(props, "row")}>{props.children}</div>;
}

export function Column(props: BoxProps) {
  return <div style={flexStyle(props, "column")}>{props.children}</div>;
}

export function GapRow({
  children,
  style,
}: {
  children: ReactNode;
  style?: Partial<StyleDesc>;
}) {
  const t = useAdwaita();
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "row",
        gap: t.space.sm,
        ...style,
      }}
    >
      {children}
    </div>
  );
}

export function rowStyle(
  t: AdwaitaTheme,
  style?: Partial<StyleDesc>,
): Partial<StyleDesc> {
  return {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    ...style,
  };
}

export function TrailingSlot({
  children,
  style,
}: {
  children?: ReactNode;
  style?: Partial<StyleDesc>;
}) {
  const t = useAdwaita();
  return (
    <div style={rowStyle(t, { gap: t.space.sm, flexShrink: 0, ...style })}>
      {children}
    </div>
  );
}
