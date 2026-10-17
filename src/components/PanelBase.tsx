import { createContext, useContext, type ReactNode } from "react";
import type { StyleDesc } from "@gpuix/react";
import { useAdwaita } from "../theme/adwaita";
import {
  OverlayShell,
  OverlayPanel,
  sidePanelStyle,
  CloseButton,
  T,
} from "./common";

export type PanelSide = "bottom" | "left" | "right" | "top";

export interface PanelContextValue {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  contained: boolean;
  side: PanelSide;
}

export interface PanelRootProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  side?: PanelSide;
  contained?: boolean;
  children?: ReactNode;
  style?: Partial<StyleDesc>;
}

export function createPanelContext(name: string) {
  const PanelCtx = createContext<PanelContextValue | null>(null);
  const usePanel = (): PanelContextValue => {
    const ctx = useContext(PanelCtx);
    if (!ctx)
      throw new Error(`${name} sub-components must be used within <${name}>`);
    return ctx;
  };
  return { PanelCtx, usePanel };
}

export function renderPanelShell({
  onOpenChange,
  contained,
  side,
  children,
  style,
  colors,
  panelExtra,
}: {
  onOpenChange: (open: boolean) => void;
  contained: boolean;
  side: PanelSide;
  children?: ReactNode;
  style?: Partial<StyleDesc>;
  colors: { border: string };
  panelExtra?: ReactNode;
}) {
  const pos = contained ? "absolute" : "fixed";
  const panelStyle = sidePanelStyle(side, colors);
  return (
    <OverlayShell
      position={pos}
      onDismiss={() => onOpenChange(false)}
      style={style}
    >
      <OverlayPanel position={pos} panelStyle={panelStyle}>
        {panelExtra}
        {children}
      </OverlayPanel>
    </OverlayShell>
  );
}

export function makePanelTrigger(usePanel: () => PanelContextValue) {
  return function PanelTrigger({
    children,
    style,
  }: {
    children: ReactNode;
    style?: Partial<StyleDesc>;
  }) {
    const { onOpenChange } = usePanel();
    return (
      <div
        onClick={() => onOpenChange(true)}
        style={{ cursor: "pointer", ...style }}
      >
        {children}
      </div>
    );
  };
}

export function makePanelClose(usePanel: () => PanelContextValue) {
  return function PanelClose({
    children,
    style,
  }: {
    children?: ReactNode;
    style?: Partial<StyleDesc>;
  }) {
    const { onOpenChange } = usePanel();
    return (
      <CloseButton onClick={() => onOpenChange(false)} style={style}>
        {children}
      </CloseButton>
    );
  };
}

export function makePanelHeader(usePanel: () => PanelContextValue) {
  return function PanelHeader({
    children,
    style,
  }: {
    children?: ReactNode;
    style?: Partial<StyleDesc>;
  }) {
    const t = useAdwaita();
    return (
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          gap: t.spacing.gap,
          padding: t.spacing.padding,
          paddingBottom: 0,
          ...style,
        }}
      >
        {children}
      </div>
    );
  };
}

export function makePanelFooter(usePanel: () => PanelContextValue) {
  return function PanelFooter({
    children,
    style,
  }: {
    children?: ReactNode;
    style?: Partial<StyleDesc>;
  }) {
    const t = useAdwaita();
    const { colors, spacing } = t;
    return (
      <div style={{ display: "flex", flexDirection: "column", ...style }}>
        <div style={{ flexGrow: 1 }} />
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "flex-end",
            gap: spacing.gap,
            padding: spacing.padding,
            borderTopWidth: 1,
            borderColor: colors.border,
          }}
        >
          {children}
        </div>
      </div>
    );
  };
}

export function PaddedSection({
  children,
  style,
}: {
  children?: ReactNode;
  style?: Partial<StyleDesc>;
}) {
  const t = useAdwaita();
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: t.spacing.gap,
        padding: t.spacing.padding,
        ...style,
      }}
    >
      {children}
    </div>
  );
}

export function PanelShowcase({ children }: { children?: ReactNode }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      {children}
    </div>
  );
}

export function PanelShowcaseRow({ children }: { children?: ReactNode }) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "row",
        gap: 16,
        alignItems: "center",
      }}
    >
      {children}
    </div>
  );
}

export function PanelShowcaseSection({
  caption,
  children,
}: {
  caption: string;
  children?: ReactNode;
}) {
  const t = useAdwaita();
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 16,
        alignItems: "center",
      }}
    >
      <T size="caption" color={t.colors.dim_fg}>
        {caption}
      </T>
      {children}
    </div>
  );
}

export function PanelShowcaseColumn({
  caption,
  children,
}: {
  caption: string;
  children?: ReactNode;
}) {
  const t = useAdwaita();
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
      <T size="caption" color={t.colors.dim_fg}>
        {caption}
      </T>
      {children}
    </div>
  );
}

export function PanelSideStages({
  stages,
  renderPanel,
  width = 360,
  height = 150,
}: {
  stages: { side: PanelSide; label: string }[];
  renderPanel: (side: PanelSide) => ReactNode;
  width?: number;
  height?: number;
}) {
  return (
    <PanelShowcaseSection caption="Open · sides (side prop, contained in a stage)">
      {stages.map(({ side, label }) => (
        <PanelShowcaseColumn key={side} caption={label}>
          <PanelShowcaseStage width={width} height={height}>
            {renderPanel(side)}
          </PanelShowcaseStage>
        </PanelShowcaseColumn>
      ))}
    </PanelShowcaseSection>
  );
}

export function PanelShowcaseStage({
  width,
  height,
  children,
  style,
}: {
  width: number;
  height: number;
  children?: ReactNode;
  style?: Partial<StyleDesc>;
}) {
  const t = useAdwaita();
  const { colors, radii } = t;
  return (
    <div
      style={{
        position: "relative",
        width,
        height,
        borderRadius: radii.card,
        borderWidth: 1,
        borderColor: colors.border,
        backgroundColor: colors.view_bg,
        overflow: "hidden",
        ...style,
      }}
    >
      {children}
    </div>
  );
}
