import { type ReactNode, createContext, useContext } from "react";
import { type StyleDesc } from "@gpuix/react";
import { useAdwaita } from "../theme/adwaita";
import {
  CloseButton,
  OverlayPanel,
  OverlayShell,
  sidePanelStyle,
} from "./overlay";
import { rowStyle } from "./Box";
import { T } from "./text";

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

  inset?: Partial<StyleDesc>;
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
  panelExtra,
  inset,
}: {
  onOpenChange: (open: boolean) => void;
  contained: boolean;
  side: PanelSide;
  children?: ReactNode;
  style?: Partial<StyleDesc>;
  panelExtra?: ReactNode;
  inset?: Partial<StyleDesc>;
}) {
  const pos = contained ? "absolute" : "fixed";
  const panelStyle = sidePanelStyle(side);
  return (
    <OverlayShell
      position={pos}
      onDismiss={() => onOpenChange(false)}
      style={{ ...inset, ...style }}
    >
      <OverlayPanel position={pos} panelStyle={{ ...panelStyle, ...inset }}>
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
        style={rowStyle(t, {
          justifyContent: "space-between",
          gap: t.space.sm,
          padding: t.space.lg,
          paddingBottom: 0,
          ...style,
        })}
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
    return (
      <div style={{ display: "flex", flexDirection: "column", ...style }}>
        <div style={{ flexGrow: 1 }} />
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "flex-end",
            gap: t.space.sm,
            padding: t.space.lg,
            borderTopWidth: 1,
            borderColor: t.color.border.default,
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
        gap: t.space.sm,
        padding: t.space.lg,
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

function ShowcaseCaption({ caption }: { caption?: string }) {
  const t = useAdwaita();
  if (!caption) return null;
  return (
    <T size="caption" color={t.color.text.dim}>
      {caption}
    </T>
  );
}

export function PanelShowcaseSection({
  caption,
  children,
}: {
  caption?: string;
  children?: ReactNode;
}) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 16,
        alignItems: "center",
      }}
    >
      <ShowcaseCaption caption={caption} />
      {children}
    </div>
  );
}

export function PanelShowcaseColumn({
  caption,
  children,
}: {
  caption?: string;
  children?: ReactNode;
}) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
      <ShowcaseCaption caption={caption} />
      {children}
    </div>
  );
}

export const PANEL_SIDES: { side: PanelSide; label: string }[] = [
  { side: "left", label: "side=left" },
  { side: "right", label: "side=right" },
  { side: "top", label: "side=top" },
  { side: "bottom", label: "side=bottom" },
];

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
  return (
    <div
      style={{
        position: "relative",
        width,
        height,
        borderRadius: t.radius.sm,
        borderWidth: 0,
        backgroundColor: t.color.surface.view,
        overflow: "hidden",
        ...style,
      }}
    >
      {children}
    </div>
  );
}
