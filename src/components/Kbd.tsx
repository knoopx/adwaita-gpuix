import { Children, Fragment, type ReactNode } from "react";
import type { StyleDesc } from "@gpuix/react";
import { useAdwaita, RADIUS, SPACE } from "../theme/adwaita";
import { T } from "./common";

const KBD_HEIGHT = 16;
const KBD_MIN_WIDTH = 16;
const KBD_PAD_X = 3;
const KBD_GAP = SPACE.xs;

export interface KbdProps {
  children: ReactNode;
  style?: Partial<StyleDesc>;
}

export function Kbd({ children, style }: KbdProps) {
  const t = useAdwaita();
  const { colors, typography } = t;
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        height: KBD_HEIGHT,
        minWidth: KBD_MIN_WIDTH,
        paddingLeft: KBD_PAD_X,
        paddingRight: KBD_PAD_X,
        gap: KBD_GAP,
        borderRadius: RADIUS.xs,
        borderWidth: 1,
        borderBottomWidth: 2,
        borderColor: colors.border,
        backgroundColor: colors.button_bg,
        userSelect: "none",
        pointerEvents: "none",
        ...style,
      }}
    >
      <T
        size="micro"
        weight={500}
        color={colors.dim_fg}
        style={{ fontFamily: typography.fontFamilyMono }}
      >
        {children}
      </T>
    </div>
  );
}

export interface KbdGroupProps {
  children: ReactNode;
  style?: Partial<StyleDesc>;
}

export function KbdGroup({ children, style }: KbdGroupProps) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: KBD_GAP,
        ...style,
      }}
    >
      {children}
    </div>
  );
}

export interface KbdComboProps {
  children: ReactNode;
  style?: Partial<StyleDesc>;
}

function KbdPlus() {
  const t = useAdwaita();
  return (
    <T
      size="micro"
      color={t.colors.dim_fg}
      style={{
        flexShrink: 0,
        fontFamily: t.typography.fontFamilyMono,
      }}
    >
      +
    </T>
  );
}

export function KbdCombo({ children, style }: KbdComboProps) {
  const items = Children.toArray(children).filter(Boolean);
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: KBD_GAP,
        ...style,
      }}
    >
      {items.map((child, i) => (
        <Fragment key={i}>
          {i > 0 ? <KbdPlus /> : null}
          {child}
        </Fragment>
      ))}
    </div>
  );
}
