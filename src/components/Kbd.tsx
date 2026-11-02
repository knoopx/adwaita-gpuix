import { Children, Fragment, type ReactNode } from "react";
import { type StyleDesc } from "@gpuix/react";
import { RADIUS, SPACE, useAdwaita } from "../theme/adwaita";
import { T } from "./text";

const KBD_HEIGHT = 16;
const KBD_MIN_WIDTH = 16;
const KBD_PAD_X = 3;
const KBD_GAP = SPACE.xs;

export interface KbdColors {
  fill?: string;
  border?: string;
  color?: string;
}

export interface KbdProps {
  children: ReactNode;
  style?: Partial<StyleDesc>;
  colors?: KbdColors;
}

export function Kbd({ children, style, colors }: KbdProps) {
  const t = useAdwaita();
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
        borderColor: colors?.border ?? t.color.border.default,
        backgroundColor: colors?.fill ?? t.color.surface.button,
        userSelect: "none",
        pointerEvents: "none",
        ...style,
      }}
    >
      <T
        size="micro"
        weight={500}
        color={colors?.color ?? t.color.text.dim}
        style={{ fontFamily: t.type.fontFamilyMono }}
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
  colors?: KbdColors;
}

function KbdPlus({ colors }: { colors?: KbdColors }) {
  const t = useAdwaita();
  return (
    <T
      size="micro"
      color={colors?.color ?? t.color.text.dim}
      style={{
        flexShrink: 0,
        fontFamily: t.type.fontFamilyMono,
      }}
    >
      +
    </T>
  );
}

export function KbdCombo({ children, style, colors }: KbdComboProps) {
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
          {i > 0 ? <KbdPlus colors={colors} /> : null}
          {child}
        </Fragment>
      ))}
    </div>
  );
}
