import { type StyleDesc } from "@gpuix/react";
import { type ReactNode } from "react";
import { Icon } from "./icons";
import { DescriptionText, TitleText } from "./text";
import { type AdwaitaTheme, useAdwaita } from "../theme/adwaita";
import { isDarkScheme } from "../theme/tokens";

export function Scrim({
  position = "fixed",
  onDismiss,
  style,
}: {
  position?: "absolute" | "fixed";
  onDismiss?: () => void;
  style?: Partial<StyleDesc>;
}) {
  const t = useAdwaita();
  return (
    <div
      onClick={onDismiss}
      style={{
        position,
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        backgroundColor: isDarkScheme(t.scheme)
          ? "rgba(0,0,0,0.5)"
          : "rgba(0,0,0,0.3)",
        pointerEvents: "auto",
        ...style,
      }}
    />
  );
}

export function OverlayShell({
  position = "fixed",
  onDismiss,
  children,
  style,
}: {
  position?: "absolute" | "fixed";
  onDismiss?: () => void;
  children?: ReactNode;
  style?: Partial<StyleDesc>;
}) {
  return (
    <div
      style={{
        position,
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        pointerEvents: "auto",
        ...style,
      }}
    >
      <Scrim position={position} onDismiss={onDismiss} />
      {children}
    </div>
  );
}

export function OverlayPanel({
  position = "fixed",
  panelStyle,
  children,
}: {
  position?: "absolute" | "fixed";
  panelStyle?: Partial<StyleDesc>;
  children?: ReactNode;
}) {
  const t = useAdwaita();
  return (
    <div
      style={{
        position,
        display: "flex",
        flexDirection: "column",
        backgroundColor: t.color.surface.view,
        ...panelStyle,
      }}
    >
      {children}
    </div>
  );
}

export function CloseButton({
  children,
  onClick,
  style,
}: {
  children?: ReactNode;
  onClick?: () => void;
  style?: Partial<StyleDesc>;
}) {
  const t = useAdwaita();
  return (
    <div
      onClick={onClick}
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        width: 24,
        height: 24,
        borderRadius: 6,
        cursor: "pointer",
        hover: { backgroundColor: t.color.surface.buttonHover },
        ...style,
      }}
    >
      {children ?? <Icon name="close" size={14} color={t.color.text.dim} />}
    </div>
  );
}

export function OverlayTitle(props: {
  children?: ReactNode;
  style?: Partial<StyleDesc>;
}) {
  return <TitleText {...props} />;
}

export function OverlayDescription(props: {
  children?: ReactNode;
  style?: Partial<StyleDesc>;
}) {
  return <DescriptionText {...props} />;
}

export type SidePanelSide = "bottom" | "left" | "right" | "top";

export function sidePanelStyle(side: SidePanelSide): Partial<StyleDesc> {
  switch (side) {
    case "left":
      return {
        top: 0,
        left: 0,
        height: "100%",
        width: 320,
      };
    case "right":
      return {
        top: 0,
        right: 0,
        height: "100%",
        width: 320,
      };
    case "bottom":
      return {
        bottom: 0,
        left: 0,
        width: "100%",
      };
    case "top":
      return {
        top: 0,
        left: 0,
        width: "100%",
      };
  }
}

export function dialogCardStyle(
  t: AdwaitaTheme,
  opts: { gap?: number; minWidth?: number } = {},
): Partial<StyleDesc> {
  const { gap = 12, minWidth = 320 } = opts;
  return {
    position: "relative",
    display: "flex",
    flexDirection: "column",
    gap,
    padding: 20,
    minWidth,
    maxWidth: 480,
    borderRadius: t.radius.sm,
    borderWidth: 1,
    borderColor: t.color.border.default,
    backgroundColor: t.color.surface.card,
  };
}

export const PANEL_SHADOW = {
  offsetX: 0,
  offsetY: 4,
  blurRadius: 16,
  spreadRadius: 0,
  color: "rgba(0,0,0,0.35)",
} as const;
