import { createContext, useContext, useEffect, useRef, useState } from "react";
import type { ReactNode } from "react";
import type { StyleDesc, EventPayload } from "@gpuix/react";
import { useAdwaita } from "../../theme/adwaita";

const DEFAULT_SIZE = 300;

const DEFAULT_MIN = 100;
const DEFAULT_MAX = 600;

const HANDLE = 6;

interface PanelConfig {
  min?: number;
  max?: number;
  defaultSize?: number;
}

interface ResizableGroupContextValue {
  orientation: "horizontal" | "vertical";

  sizes: number[];

  panelCount: number;
  dragging: boolean;
  registerPanel: (cfg: PanelConfig) => number;
  unregisterPanel: (index: number) => void;
  setPanelSize: (index: number, size: number) => void;
  startDrag: (index: number, event: EventPayload) => void;
  endDrag: () => void;
}

const ResizableGroupCtx = createContext<ResizableGroupContextValue | null>(
  null,
);

function useResizableGroup(): ResizableGroupContextValue {
  const ctx = useContext(ResizableGroupCtx);
  if (!ctx)
    throw new Error(
      "ResizablePanel / ResizableHandle must be used within <ResizablePanelGroup>",
    );
  return ctx;
}

interface DragState {
  index: number;
  startCoord: number;
  startSize: number;
  min: number;
  max: number;
}

export interface ResizablePanelGroupProps {
  orientation?: "horizontal" | "vertical";
  children?: ReactNode;
  style?: Partial<StyleDesc>;
}

export function ResizablePanelGroup({
  orientation = "horizontal",
  children,
  style,
}: ResizablePanelGroupProps) {
  const vertical = orientation === "vertical";
  const [sizes, setSizes] = useState<number[]>([]);
  const [panelCount, setPanelCount] = useState(0);
  const [drag, setDrag] = useState<DragState | null>(null);
  const panelOrderRef = useRef<PanelConfig[]>([]);

  const registerPanel = (cfg: PanelConfig): number => {
    panelOrderRef.current.push(cfg);
    setPanelCount(panelOrderRef.current.length);
    return panelOrderRef.current.length - 1;
  };

  const unregisterPanel = (index: number) => {
    panelOrderRef.current = panelOrderRef.current.filter((_, i) => i !== index);
    setPanelCount(panelOrderRef.current.length);
  };

  const setPanelSize = (index: number, size: number) => {
    setSizes((prev) => {
      const next = [...prev];
      while (next.length <= index) next.push(0);
      next[index] = size;
      return next;
    });
  };

  const startDrag = (index: number, event: EventPayload) => {
    const cfg = panelOrderRef.current[index];
    const coord = vertical ? (event.y ?? 0) : (event.x ?? 0);
    setDrag({
      index,
      startCoord: coord,
      startSize: sizes[index] || cfg?.defaultSize || DEFAULT_SIZE,
      min: cfg?.min ?? DEFAULT_MIN,
      max: cfg?.max ?? DEFAULT_MAX,
    });
  };

  const endDrag = () => setDrag(null);

  const handleMouseMove = (event: EventPayload) => {
    if (!drag) return;

    const coord = vertical
      ? (event.y ?? drag.startCoord)
      : (event.x ?? drag.startCoord);
    const next = Math.max(
      drag.min,
      Math.min(drag.max, drag.startSize + (coord - drag.startCoord)),
    );
    setPanelSize(drag.index, next);
  };

  const ctxValue: ResizableGroupContextValue = {
    orientation,
    sizes,
    panelCount,
    dragging: drag !== null,
    registerPanel,
    unregisterPanel,
    setPanelSize,
    startDrag,
    endDrag,
  };

  return (
    <ResizableGroupCtx.Provider value={ctxValue}>
      <div
        onMouseMove={handleMouseMove}
        onMouseUp={endDrag}
        onMouseLeave={endDrag}
        style={{
          display: "flex",
          flexDirection: vertical ? "column" : "row",
          ...style,
        }}
      >
        {children}
      </div>
    </ResizableGroupCtx.Provider>
  );
}

export interface ResizablePanelProps {
  children?: ReactNode;

  min?: number;

  max?: number;

  defaultSize?: number;
  style?: Partial<StyleDesc>;
}

export function ResizablePanel({
  children,
  min,
  max,
  defaultSize,
  style,
}: ResizablePanelProps) {
  const ctx = useResizableGroup();
  const vertical = ctx.orientation === "vertical";
  const indexRef = useRef(-1);
  const cfgRef = useRef<PanelConfig>({});
  cfgRef.current = { min, max, defaultSize };

  useEffect(() => {
    const index = ctx.registerPanel(cfgRef.current);
    indexRef.current = index;
    return () => ctx.unregisterPanel(index);
  }, []);

  const index = indexRef.current;
  const isLast = index === ctx.panelCount - 1;
  const size = ctx.sizes[index] || defaultSize || DEFAULT_SIZE;

  const pointerEvents = ctx.dragging ? "none" : undefined;

  const panelStyle: Partial<StyleDesc> = isLast
    ? {
        display: "flex",
        flexGrow: 1,
        pointerEvents,
        ...(vertical ? { minHeight: 0 } : { minWidth: 0 }),
        ...style,
      }
    : vertical
      ? {
          display: "flex",
          height: size,
          flexShrink: 0,
          pointerEvents,
          ...style,
        }
      : {
          display: "flex",
          width: size,
          flexShrink: 0,
          pointerEvents,
          ...style,
        };

  return <div style={panelStyle}>{children}</div>;
}

export interface ResizableHandleProps {
  panel?: number;
  style?: Partial<StyleDesc>;
}

export function ResizableHandle({ panel = 0, style }: ResizableHandleProps) {
  const t = useAdwaita();
  const { colors, radii } = t;
  const ctx = useResizableGroup();
  const vertical = ctx.orientation === "vertical";

  return (
    <div
      onMouseDown={(event: EventPayload) => ctx.startDrag(panel, event)}
      style={{
        display: "flex",
        flexShrink: 0,
        borderRadius: radii.pill,
        backgroundColor: colors.border,
        cursor: vertical ? "row-resize" : "col-resize",
        pointerEvents: ctx.dragging ? "none" : undefined,
        ...(vertical
          ? { height: HANDLE, width: "100%" }
          : { width: HANDLE, height: "100%" }),
        hover: { backgroundColor: colors.accentTint },
        active: { backgroundColor: colors.accent },
        ...style,
      }}
    />
  );
}

export interface ResizableProps {
  children: ReactNode;
  style?: Partial<StyleDesc>;

  initialLeftWidth?: number;
}

export function Resizable({
  children,
  style,
  initialLeftWidth = 300,
}: ResizableProps) {
  return (
    <ResizablePanelGroup style={style}>
      <ResizablePanel defaultSize={initialLeftWidth}>{children}</ResizablePanel>
      <ResizableHandle />
      <ResizablePanel />
    </ResizablePanelGroup>
  );
}

